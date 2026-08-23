/* ------------------------------------------------------------------ */
/* jsx/puzzle-page.jsx – Seite „Brückentage-Rätsel des Tages"           */
/* (/raetsel). Anders als Impressum/Datenschutz bewusst OHNE „noindex"  */
/* (soll indexierbar sein) und mit eigenem, lokalem Dark/Light-         */
/* Umschalter (die Seite hängt nicht am Dark-State von Urlaubsplaner,   */
/* da sie eigenständig über App() geroutet wird) – analog zu             */
/* jsx/guide-page.jsx. Wird über Babel-Standalone im Browser verarbeitet */
/* (kein Bundler, kein Modulsystem, siehe CLAUDE.md). Muss NACH          */
/* jsx/support-components.jsx UND js/puzzle.js/js/puzzle-stats.js        */
/* geladen werden. In einer IIFE gekapselt; öffentliche Oberfläche:      */
/* window.FREILOTSE.ui.                                                  */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";
  const { useState, useEffect, useMemo, useRef } = React;
  const t = window.I18N.t;
  const { SiteLink, SiteFooter, InfoHint, LanguageSwitcher } = window.FREILOTSE.ui;
  const { generateDailyPuzzle, longestFreeRun, buildEmojiWindow, EMOJI_WINDOW_SIZE } = window.FREILOTSE.puzzle;
  const {
    STORAGE_KEY: STATS_KEY, defaultStats, parseStats, serializeStats,
    hasPlayedToday, getTodayResult, recordResult,
  } = window.FREILOTSE.puzzleStats;

  const MONTHS = t("months");
  const STATE_NAMES = t("states").DE;

  // "Heute" ist immer der lokale Kalendertag des Geräts (nicht UTC) – wie
  // bei Wordle/NYT-Spielen. Der Rätsel-INHALT bleibt trotzdem für ein
  // gegebenes Datum überall identisch, da js/puzzle.js rein aus dem
  // Datumsstring seedet.
  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function msUntilNextMidnight() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    return next.getTime() - now.getTime();
  }

  function formatCountdown(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function PuzzlePage() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
      const previousTitle = document.title;
      document.title = t("puzzle.documentTitle");
      let meta = document.querySelector('meta[name="description"]');
      const created = !meta;
      const previousContent = meta ? meta.getAttribute("content") : null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", t("puzzle.metaDescription"));
      return () => {
        document.title = previousTitle;
        if (created) meta.remove();
        else if (previousContent === null) meta.removeAttribute("content");
        else meta.setAttribute("content", previousContent);
      };
    }, []);

    const dateKey = useMemo(() => todayKey(), []);
    const year = useMemo(() => new Date().getFullYear(), []);
    const puzzle = useMemo(() => generateDailyPuzzle(dateKey, t, year), [dateKey, year]);

    // Verfügbarkeits-Probe wie bei "Meine Pläne" (js/local-plans.js) – bei
    // fehlendem localStorage (z. B. Safaris privates Fenster) bleibt das
    // Spiel voll spielbar, nur ohne Streak-Persistenz.
    const statsRef = useRef(undefined);
    if (statsRef.current === undefined) {
      let raw = null, available = true;
      try {
        window.localStorage.setItem("__freilotse_probe__", "1");
        window.localStorage.removeItem("__freilotse_probe__");
        raw = window.localStorage.getItem(STATS_KEY);
      } catch (e) { available = false; }
      const parsed = available ? parseStats(raw) : { stats: defaultStats(), corrupted: false };
      statsRef.current = { available, ...parsed };
    }
    const statsAvailable = statsRef.current.available;

    const [stats, setStats] = useState(() => statsRef.current.stats);
    const initialResult = hasPlayedToday(stats, dateKey) ? getTodayResult(stats, dateKey) : null;
    const [phase, setPhase] = useState(() => (initialResult ? "result" : "playing"));
    // officialResult ist der EINE gewertete Erstversuch des Tages (fließt in
    // Streak/Statistik ein, wird nie überschrieben). practiceResult ist ein
    // optionaler, nicht gewerteter Übungsversuch danach ("Erneut versuchen") –
    // hält die Serie ehrlich vergleichbar, erlaubt aber trotzdem beliebig oft
    // zu üben.
    const [officialResult, setOfficialResult] = useState(() => initialResult);
    const [practiceResult, setPracticeResult] = useState(null);
    const displayedResult = practiceResult || officialResult;
    const [playerSel, setPlayerSel] = useState(() => new Array(puzzle.monthDays.length).fill(null));
    const [copyUrl, setCopyUrl] = useState(null);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);
    const [, setTick] = useState(0); // treibt die Sekunden-Anzeige des Countdowns an

    useEffect(() => {
      const id = setInterval(() => setTick((n) => n + 1), 1000);
      return () => clearInterval(id);
    }, []);

    const showToast = (msg) => {
      setToast(msg);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const selectedCount = playerSel.filter((v) => v === "vac").length;
    const remaining = puzzle.budget - selectedCount;

    const toggleDay = (idx) => {
      if (phase !== "playing") return;
      const day = puzzle.monthDays[idx];
      if (day.cost === 0) return; // bereits frei, nicht klickbar
      setPlayerSel((prev) => {
        const next = [...prev];
        if (next[idx] === "vac") next[idx] = null;
        else if (remaining > 0) next[idx] = "vac";
        return next;
      });
    };

    const handleEvaluate = () => {
      if (phase !== "playing") return;
      const run = longestFreeRun(puzzle.monthDays, playerSel);
      const emojiGrid = buildEmojiWindow(puzzle.monthDays, playerSel, puzzle.optimalRun, EMOJI_WINDOW_SIZE);
      const entry = {
        dateKey: puzzle.dateKey, puzzleNumber: puzzle.puzzleNumber,
        score: run.length, optimal: puzzle.optimalScore, emojiGrid,
      };
      setPhase("result");
      if (!officialResult) {
        // Erster, gewerteter Versuch des Tages.
        setOfficialResult(entry);
        if (statsAvailable) {
          const next = recordResult(statsRef.current.stats, entry);
          statsRef.current = { ...statsRef.current, stats: next };
          setStats(next);
          try { window.localStorage.setItem(STATS_KEY, serializeStats(next)); }
          catch (e) { /* z. B. Speicherplatz voll/privates Fenster – still degradieren */ }
        }
      } else {
        // Übungsversuch nach dem gewerteten Erstversuch – zählt nicht für
        // Streak/Statistik, überschreibt officialResult nicht.
        setPracticeResult(entry);
      }
    };

    // Neue Runde im selben Rätsel zum Üben – das gewertete Erstergebnis
    // (officialResult) und die Statistik bleiben davon unberührt.
    const handleRetry = () => {
      setPracticeResult(null);
      setPlayerSel(new Array(puzzle.monthDays.length).fill(null));
      setPhase("playing");
    };

    // Teilen: identische 3-stufige Logik wie handleShare/copyFromModal in
    // app.jsx (navigator.share -> Zwischenablage -> Kopier-Dialog), lokal
    // dupliziert – jede geroutete Seite bleibt eigenständig und teilt nur
    // SiteLink/SiteFooter aus support-components.jsx.
    // Teilt immer das GEWERTETE Ergebnis (officialResult), nie einen
    // Übungsversuch – hält geteilte Ergebnisse zwischen Spielern fair
    // vergleichbar (jeder hat nur den einen echten Versuch geteilt).
    const handleShareResult = async () => {
      if (!officialResult) return;
      const url = `${window.location.origin}${window.location.pathname}`;
      const text = t("puzzle.share.nativeText", {
        puzzleNumber: officialResult.puzzleNumber, score: officialResult.score,
        optimal: officialResult.optimal, emojiGrid: officialResult.emojiGrid, url,
      });
      if (typeof navigator !== "undefined" && navigator.share &&
          (!navigator.canShare || navigator.canShare({ text }))) {
        try {
          await navigator.share({ title: t("puzzle.share.nativeTitle", { puzzleNumber: officialResult.puzzleNumber }), text });
          return;
        } catch (e) { if (e && e.name === "AbortError") return; }
      }
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        try { await navigator.clipboard.writeText(text); showToast(t("share.toast.linkCopied")); return; }
        catch (e) { /* Fallback */ }
      }
      setCopyUrl(text);
    };

    const copyFromModal = async () => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(copyUrl);
        } else {
          const inp = document.getElementById("puzzle-share-input");
          if (inp) { inp.focus(); inp.select(); document.execCommand("copy"); }
        }
        showToast(t("share.toast.linkCopied"));
        setCopyUrl(null);
      } catch (e) {
        showToast(t("share.toast.copyManually"));
      }
    };

    const softTextCls = dark ? "text-sonnencreme/80" : "text-espresso/80";
    const mutedTextCls = dark ? "text-sonnencreme/60" : "text-espresso/60";
    const cardCls = dark
      ? "bg-tiefwasser-hell border border-tiefwasser-hell rounded-3xl shadow-warm-dark"
      : "bg-kalkstein border border-beckenwasser/20 rounded-3xl shadow-warm";
    const inputCls = dark
      ? "w-full rounded-xl border border-tiefwasser-hell bg-tiefwasser px-3 py-2 text-sm text-sonnencreme"
      : "w-full rounded-xl border border-beckenwasser/30 bg-kalkstein px-3 py-2 text-sm text-espresso";

    const monthDays = puzzle.monthDays;
    const firstDow = monthDays[0].dow; // 0=So..6=Sa
    const leadBlanks = (firstDow + 6) % 7; // Montag zuerst
    const trailBlanks = (7 - ((leadBlanks + monthDays.length) % 7)) % 7;

    return (
      <div className={`min-h-screen flex flex-col font-body ${dark ? "bg-tiefwasser text-sonnencreme" : "bg-sonnencreme text-espresso"}`}>
        <header className={dark ? "border-b border-tiefwasser-hell bg-tiefwasser-hell" : "border-b border-beckenwasser/20 bg-kalkstein"}>
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5">
            <SiteLink to="/" className={`font-bold tracking-tight ${dark ? "text-kalkstein hover:text-beckenwasser-hell" : "text-espresso hover:text-beckenwasser"}`}>
              FREILOTSE
            </SiteLink>
            <div className="flex items-center gap-4">
              <SiteLink to="/" className={`text-sm ${dark ? "text-sonnencreme/80 hover:text-kalkstein" : "text-espresso/80 hover:text-espresso"}`}>
                {t("puzzle.backToPlanner")}
              </SiteLink>
              <button onClick={() => setDark(!dark)}
                title={t("theme.toggleTitle")}
                className={`rounded-xl border px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-beckenwasser ${
                  dark ? "border-tiefwasser-hell text-sonnencreme/80 hover:bg-tiefwasser" : "border-beckenwasser/30 text-espresso/80 hover:bg-beckenwasser/5"
                }`}>
                {dark ? t("theme.toLight") : t("theme.toDark")}
              </button>
              <LanguageSwitcher dark={dark} />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
          <article className={`${cardCls} space-y-6 p-5 sm:p-8`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? "text-beckenwasser-hell" : "text-beckenwasser"}`}>
                {t("puzzle.intro.puzzleNumberLabel", { number: puzzle.puzzleNumber })}
              </p>
              <h1 className="mt-1 text-3xl font-display font-bold tracking-tight">{t("puzzle.pageTitle")}</h1>
              <p className={`mt-2 text-sm leading-7 ${softTextCls}`}>
                {t("puzzle.intro.stateAndMonth", { state: STATE_NAMES[puzzle.st], month: MONTHS[puzzle.month], year: puzzle.year })}
              </p>
              <p className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${dark ? "text-sonnengelb-hell" : "text-tiefwasser"}`}>
                {t("puzzle.intro.rulesHint", { budget: puzzle.budget })}
                <InfoHint dark={dark} text={t("puzzle.intro.rulesDetail")} />
              </p>
            </div>

            {phase === "playing" ? (
              <>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className={`inline-block h-3 w-3 rounded-full ${dark ? "bg-beckenwasser-hell/20" : "bg-beckenwasser-hell/60"}`} />
                    {t("puzzle.calendar.legendFree")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full bg-beckenwasser" />
                    {t("puzzle.calendar.legendSelected")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className={`inline-block h-3 w-3 rounded-full ${dark ? "bg-tiefwasser-hell" : "border border-beckenwasser/20 bg-kalkstein"}`} />
                    {t("puzzle.calendar.legendWorking")}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {t("calendar.weekdaysMonFirst").map((w) => (
                    <span key={w} className={`text-xs font-semibold ${mutedTextCls}`}>{w}</span>
                  ))}
                  {Array.from({ length: leadBlanks }).map((_, i) => <span key={`lead-${i}`} />)}
                  {monthDays.map((day, idx) => {
                    const isFree = day.cost === 0;
                    const isSelected = playerSel[idx] === "vac";
                    const clickable = !isFree;
                    // aria-label statt Verlass auf den title-Tooltip (unzuverlässig für
                    // Screenreader, auf Touch nicht erreichbar) – ohne aria-label wäre
                    // der zugängliche Name sonst nur die nackte Tageszahl (day.d).
                    const dayAriaLabel = t("puzzle.calendar.dayAriaLabel", {
                      day: day.d, month: MONTHS[puzzle.month],
                      status: isFree ? t("puzzle.calendar.legendFree") : isSelected ? t("puzzle.calendar.legendSelected") : t("puzzle.calendar.legendWorking"),
                      holiday: day.holiday || "",
                    });
                    return (
                      <button key={idx} type="button" onClick={() => toggleDay(idx)}
                        disabled={!clickable}
                        title={day.holiday || undefined}
                        aria-label={dayAriaLabel}
                        className={`rounded-xl aspect-square flex items-center justify-center text-sm font-semibold font-data transition-colors focus:outline-none focus:ring-2 focus:ring-beckenwasser ${
                          isFree
                            ? (dark ? "bg-beckenwasser-hell/20 text-sonnencreme" : "bg-beckenwasser-hell/60 text-espresso")
                            : isSelected
                            ? "bg-beckenwasser text-kalkstein"
                            : (dark
                                ? "bg-tiefwasser-hell text-sonnencreme hover:bg-tiefwasser cursor-pointer"
                                : "border border-beckenwasser/20 bg-kalkstein text-espresso hover:bg-beckenwasser-hell/30 cursor-pointer")
                        }`}>
                        {day.d}
                      </button>
                    );
                  })}
                  {Array.from({ length: trailBlanks }).map((_, i) => <span key={`trail-${i}`} />)}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className={`text-sm ${softTextCls}`}>
                    {t("puzzle.calendar.budgetCounter", { used: selectedCount, budget: puzzle.budget })}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setPlayerSel(new Array(monthDays.length).fill(null))}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold ${dark ? "text-sonnencreme/60 hover:bg-tiefwasser-hell" : "text-espresso/60 hover:bg-beckenwasser-hell/30"}`}>
                      {t("puzzle.actions.resetButton")}
                    </button>
                    <button onClick={handleEvaluate}
                      className="rounded-xl bg-sonnenkoralle px-4 py-2 text-sm font-bold font-display text-kalkstein hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
                      {t("puzzle.actions.evaluateButton")}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className={`rounded-2xl p-4 ${dark ? "bg-tiefwasser/50 border border-tiefwasser-hell" : "bg-kalkstein border border-beckenwasser/20"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${mutedTextCls}`}>
                    {t("puzzle.locked.title")}
                  </p>
                  <p className={`mt-1 text-sm ${softTextCls}`}>{t("puzzle.locked.description")}</p>
                </div>

                <p className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                  practiceResult
                    ? "bg-sonnengelb text-tiefwasser"
                    : (dark ? "bg-beckenwasser-hell/20 text-beckenwasser-hell" : "bg-beckenwasser-hell text-beckenwasser")
                }`}>
                  {practiceResult ? t("puzzle.result.practiceBadge") : t("puzzle.result.officialBadge")}
                </p>
                <p className="text-lg font-bold">
                  {t("puzzle.result.scoreLine", { score: displayedResult.score, optimal: displayedResult.optimal })}
                </p>
                <p className={`text-sm ${softTextCls}`}>
                  {displayedResult.score >= displayedResult.optimal
                    ? t("puzzle.result.perfectMessage")
                    : t("puzzle.result.belowOptimalMessage", { diff: displayedResult.optimal - displayedResult.score })}
                </p>
                {practiceResult && (
                  <p className={`text-xs ${mutedTextCls}`}>
                    {t("puzzle.result.officialReference", { score: officialResult.score, optimal: officialResult.optimal })}
                  </p>
                )}

                <div>
                  <p className={`mb-1 text-xs font-semibold uppercase tracking-wide ${mutedTextCls}`}>
                    {t("puzzle.result.emojiGridLabel")}
                  </p>
                  <p className="text-2xl leading-none tracking-wide">{displayedResult.emojiGrid}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={handleShareResult}
                    className="rounded-xl bg-sonnenkoralle px-4 py-2 text-sm font-bold font-display text-kalkstein hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
                    {t("puzzle.actions.shareButton")}
                  </button>
                  <button onClick={handleRetry}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold ${dark ? "border-tiefwasser-hell text-sonnencreme/80 hover:bg-tiefwasser-hell" : "border-beckenwasser/30 text-espresso/80 hover:bg-beckenwasser-hell/30"}`}>
                    {t("puzzle.actions.retryButton")}
                  </button>
                  <p className={`text-xs ${mutedTextCls}`}>
                    {t("puzzle.countdown.label", { time: formatCountdown(msUntilNextMidnight()) })}
                  </p>
                </div>

                <div className={`rounded-2xl p-4 ${dark ? "bg-tiefwasser/50 border border-tiefwasser-hell" : "bg-kalkstein border border-beckenwasser/20"}`}>
                  <p className="text-sm font-bold">{t("puzzle.stats.title")}</p>
                  {statsAvailable ? (
                    <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-bold tabular-nums">{stats.currentStreak}</p>
                        <p className={`text-[11px] ${mutedTextCls}`}>{t("puzzle.stats.currentStreak")}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums">{stats.maxStreak}</p>
                        <p className={`text-[11px] ${mutedTextCls}`}>{t("puzzle.stats.maxStreak")}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums">{stats.gamesPlayed}</p>
                        <p className={`text-[11px] ${mutedTextCls}`}>{t("puzzle.stats.gamesPlayed")}</p>
                      </div>
                    </div>
                  ) : (
                    <p className={`mt-1 text-xs ${mutedTextCls}`}>{t("puzzle.stats.unavailableNotice")}</p>
                  )}
                </div>

                <SiteLink to="/"
                  className="block w-full rounded-2xl bg-sonnenkoralle px-4 py-3 text-center text-sm font-bold font-display text-kalkstein hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
                  {t("puzzle.actions.ctaButton")}
                </SiteLink>
              </div>
            )}
          </article>
        </main>

        <SiteFooter dark={dark} />

        {copyUrl && (
          <div role="dialog" aria-modal="true" aria-label={t("puzzle.actions.shareButton")}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-tiefwasser/60"
            onClick={() => setCopyUrl(null)}>
            <div className={`w-full max-w-md rounded-3xl p-4 space-y-3 ${dark ? "bg-tiefwasser-hell border border-tiefwasser-hell shadow-warm-dark" : "bg-kalkstein shadow-warm"}`}
              onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-bold">{t("puzzle.actions.shareButton")}</p>
              <textarea id="puzzle-share-input" readOnly value={copyUrl} rows={4}
                onFocus={(e) => e.target.select()} className={inputCls} />
              <div className="flex gap-2">
                <button onClick={copyFromModal}
                  className="flex-1 rounded-xl bg-sonnenkoralle px-3 py-2 text-sm font-bold font-display text-kalkstein hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
                  {t("share.modal.copyButton")}
                </button>
                <button onClick={() => setCopyUrl(null)}
                  className={`rounded-xl px-3 py-2 text-sm ${dark ? "text-sonnencreme/60 hover:bg-tiefwasser" : "text-espresso/60 hover:bg-beckenwasser-hell/30"}`}>
                  {t("share.modal.closeButton")}
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div role="status" aria-live="polite"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] rounded-2xl border border-tiefwasser-hell bg-tiefwasser-hell px-4 py-2 text-sm text-kalkstein shadow-warm-dark">
            {toast}
          </div>
        )}
      </div>
    );
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.ui = window.FREILOTSE.ui || {};
  Object.assign(window.FREILOTSE.ui, { PuzzlePage });
})();
