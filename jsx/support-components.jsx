/* ------------------------------------------------------------------ */
/* jsx/support-components.jsx – Site-Chrome (interne Navigation,        */
/* Footer) und PayPal-Unterstützungskomponenten. Wird über              */
/* Babel-Standalone im Browser verarbeitet (kein Bundler, kein          */
/* Modulsystem, siehe CLAUDE.md). In einer IIFE gekapselt; öffentliche  */
/* Oberfläche: window.FREILOTSE.ui.                                     */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";
  const { useState, useEffect, useRef } = React;
  const t = window.I18N.t;

  /* Rechtliche Seiten + Navigation                                      */
  /* ------------------------------------------------------------------ */

  function internalNavigate(event, path) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function SiteLink({ to, children, className = "" }) {
    return <a href={to} onClick={(event) => internalNavigate(event, to)} className={className}>{children}</a>;
  }

  const PAYPAL_URL = "https://paypal.me/JoRi85";

  function HeartIcon({ className = "" }) {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="16" height="16"
        className={className} fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 8.6c0 4.5-8.8 10.4-8.8 10.4S3.2 13.1 3.2 8.6a4.9 4.9 0 0 1 8.8-3 4.9 4.9 0 0 1 8.8 3Z" />
      </svg>
    );
  }

  function SupportFooterLink() {
    return (
      <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-sonnenkoralle px-3 py-1.5 text-xs font-semibold text-kalkstein transition-colors hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
        <HeartIcon />
        {t("support.footerLinkText")}
      </a>
    );
  }

  function SupportFloatingButton({ planReady, path }) {
    const [interactiveExpanded, setInteractiveExpanded] = useState(false);
    const [autoExpanded, setAutoExpanded] = useState(false);
    const canHoverRef = useRef(false);
    const autoShownRef = useRef(false);
    const delayTimerRef = useRef(null);
    const hideTimerRef = useRef(null);
    const pathRef = useRef(path);

    useEffect(() => {
      canHoverRef.current = typeof window.matchMedia === "function"
        && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }, []);

    // Aktuellen Pfad in einem Ref nachführen, damit der verzögerte Timer beim
    // Auslösen den Pfad zu diesem Zeitpunkt prüfen kann (nicht den Pfad, der
    // beim Start der 1 Minute galt).
    useEffect(() => { pathRef.current = path; }, [path]);

    // Timer beim Unmounten der Seite sauber aufräumen (separat von der
    // Auslöse-Logik, damit ein Cleanup nicht bei jeder Prop-Änderung feuert).
    useEffect(() => () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }, []);

    useEffect(() => {
      if (!planReady || autoShownRef.current) return;
      if (path === "/impressum" || path === "/datenschutz" || path === "/ueber-freilotse" || path === "/neuigkeiten" || path === "/anleitung" || path === "/raetsel") return;
      // Einmaliger 1-Minuten-Timer nach dem ersten sichtbaren Planungsergebnis;
      // sofort gesperrt, damit eine erneute Berechnung keinen zweiten Timer
      // startet.
      autoShownRef.current = true;
      delayTimerRef.current = setTimeout(() => {
        delayTimerRef.current = null;
        if (pathRef.current === "/impressum" || pathRef.current === "/datenschutz" || pathRef.current === "/ueber-freilotse" || pathRef.current === "/neuigkeiten" || pathRef.current === "/anleitung" || pathRef.current === "/raetsel") return;
        // Auf schmalen Smartphone-Displays wird der automatische Hinweis
        // unterdrückt, da der längere Hinweistext dort Inhalte verdecken
        // könnte; Tippen öffnet PayPal weiterhin direkt (unverändertes
        // Verhalten).
        if (typeof window.matchMedia === "function" && !window.matchMedia("(min-width: 640px)").matches) return;
        setAutoExpanded(true);
        hideTimerRef.current = setTimeout(() => setAutoExpanded(false), 7000);
      }, 1 * 60 * 1000);
    }, [planReady, path]);

    const expanded = interactiveExpanded || autoExpanded;

    return (
      <>
        <style>{`
          .support-fab-label {
            display: inline-block; max-width: 0; margin-left: 0; opacity: 0; overflow: hidden; white-space: nowrap;
            transition: max-width .3s ease, opacity .25s ease, margin-left .3s ease;
          }
          .support-fab-label.is-expanded { max-width: 440px; opacity: 1; margin-left: .5rem; }
          @media (prefers-reduced-motion: reduce) {
            .support-fab-label { transition: none; }
          }
        `}</style>
        <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer" aria-label={t("support.floatingAriaLabel")}
          onMouseEnter={() => { if (canHoverRef.current) setInteractiveExpanded(true); }}
          onMouseLeave={() => { if (canHoverRef.current) setInteractiveExpanded(false); }}
          onFocus={() => setInteractiveExpanded(true)}
          onBlur={() => setInteractiveExpanded(false)}
          className="fixed right-0 top-1/2 -translate-y-1/2 max-sm:top-auto max-sm:translate-y-0 max-sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 flex items-center gap-2 rounded-l-2xl bg-sonnenkoralle px-3 py-2.5 text-kalkstein shadow-warm hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
          <HeartIcon className="shrink-0 text-kalkstein" />
          <span className={`support-fab-label text-sm font-semibold${expanded ? " is-expanded" : ""}`}>
            {autoExpanded ? t("support.floatingHintText") : t("support.floatingLabelText")}
          </span>
        </a>
      </>
    );
  }

  function SiteFooter({ dark = true }) {
    const muted = dark ? "text-sonnencreme/60" : "text-espresso/60";
    const hover = dark ? "hover:text-sonnencreme" : "hover:text-tiefwasser";
    return (
      <footer className={`border-t ${dark ? "border-tiefwasser-hell bg-tiefwasser" : "border-beckenwasser/20 bg-sonnencreme"}`}>
        <div className={`mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between ${muted}`}>
          <p>© {new Date().getFullYear()} FREILOTSE</p>
          <nav aria-label={t("common.legalNavAriaLabel")} className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SiteLink to="/impressum" className={hover}>{t("legal.impressumLink")}</SiteLink>
            <SiteLink to="/datenschutz" className={hover}>{t("legal.datenschutzLink")}</SiteLink>
            <SiteLink to="/ueber-freilotse" className={hover}>{t("about.footerLink")}</SiteLink>
            <SiteLink to="/neuigkeiten" className={hover}>{t("changelog.footerLink")}</SiteLink>
            <SiteLink to="/anleitung" className={hover}>{t("guide.footerLink")}</SiteLink>
            <SiteLink to="/raetsel" className={hover}>{t("puzzle.footerLink")}</SiteLink>
            <SupportFooterLink />
          </nav>
        </div>
      </footer>
    );
  }

  /* Sprachumschalter (Header)                                            */
  /* ------------------------------------------------------------------ */
  // Reload-basiert statt Live-Umschaltung: siehe CLAUDE.md, Abschnitt
  // „Zentrale technische Entscheidung: Reload statt Live-Umschaltung".
  // onBeforeSwitch (optional) erhält Gelegenheit, vor dem Reload
  // ungespeicherten Zustand zu sichern (siehe Urlaubsplaner in app.jsx).
  const LOCALE_STORAGE_KEY = "freilotse.locale.v1";

  function LanguageSwitcher({ dark = true, onBeforeSwitch }) {
    const target = window.I18N.getLocale() === "de" ? "en" : "de";
    const label = target === "en" ? t("common.switchToEnglish") : t("common.switchToGerman");
    const handleClick = () => {
      if (typeof onBeforeSwitch === "function") {
        try { onBeforeSwitch(); } catch (e) {}
      }
      try { window.localStorage.setItem(LOCALE_STORAGE_KEY, target); } catch (e) {}
      window.location.reload();
    };
    return (
      <button onClick={handleClick}
        className={`self-start rounded-xl border px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-beckenwasser ${
          dark ? "border-tiefwasser-hell text-sonnencreme/80 hover:bg-tiefwasser-hell" : "border-beckenwasser/30 text-espresso/80 hover:bg-beckenwasser/5"
        }`}
        title={label} aria-label={label}>
        {target.toUpperCase()}
      </button>
    );
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.ui = window.FREILOTSE.ui || {};
  Object.assign(window.FREILOTSE.ui, {
    internalNavigate, SiteLink, HeartIcon, SupportFooterLink, SupportFloatingButton, SiteFooter,
    LanguageSwitcher, PAYPAL_URL,
  });
})();
