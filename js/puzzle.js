/* ------------------------------------------------------------------ */
/* js/puzzle.js – deterministische Erzeugung des "Brückentage-Rätsels   */
/* des Tages" (Wordle-Stil). Rein, kein React, kein DOM, kein fetch()   */
/* – Feiertage werden ausschließlich über die bereits bestehende        */
/* Offline-Berechnung in js/calendar.js bezogen (buildDays() mit        */
/* extHolidays=null berechnet Feiertage selbst lokal), damit das Rätsel */
/* nie von einer Netzwerkverbindung abhängt. Wiederverwendet plan()     */
/* aus js/planning.js unverändert als "Musterlösung"-Orakel (gleiches   */
/* Prinzip wie bei "Gemeinsam frei" und der Jahreswechsel-Erweiterung – */
/* ein zweiter plan()-Aufruf auf anderen Eingaben, kein Eingriff in den */
/* Kernalgorithmus). Muss NACH js/calendar.js und js/planning.js        */
/* geladen werden (siehe index.html). Öffentliche Oberfläche:           */
/* window.FREILOTSE.puzzle.                                             */
/*                                                                       */
/* WICHTIG: STATE_CODES (Reihenfolge!), MAX_ATTEMPTS, QUALITY_MARGIN,    */
/* LAUNCH_DATE_KEY und die Zug-Reihenfolge in generateCandidates() sind  */
/* nach Veröffentlichung EINGEFROREN. Jede spätere Änderung würde        */
/* rückwirkend ändern, welches Rätsel an welchem Kalendertag lag –       */
/* dieselbe Vorsicht wie bei einer echten Wordle-Antwortliste.           */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";

  const { DAY, buildDays } = window.FREILOTSE.calendar;
  const { plan } = window.FREILOTSE.planning;

  const STATE_CODES = [
    "BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV",
    "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH",
  ];
  const LAUNCH_DATE_KEY = "2026-07-28"; // Tag der Einführung, Rätsel #1
  const MAX_ATTEMPTS = 64; // feste Kandidaten-Anzahl pro Tag, siehe generateCandidates
  const QUALITY_MARGIN = 2; // Musterlösung muss länger als Budget + 2 sein
  const EMOJI_WINDOW_SIZE = 12;

  // Einfacher, deterministischer 32-Bit-Hash (FNV-1a) als Seed-Quelle.
  function fnv1aHash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  // Deterministischer PRNG (mulberry32) – keine externe Bibliothek nötig.
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeRng(dateKey) {
    return mulberry32(fnv1aHash(dateKey));
  }

  // Zieht ALLE Kandidaten auf einmal aus dem RNG-Strom (nicht "einer nach
  // dem anderen, nur bei Bedarf") – dadurch ist die Auswahl nachweislich
  // terminierend (feste Schleife statt while(true)) und für jedes Datum
  // exakt reproduzierbar, unabhängig davon, welche Kandidaten später den
  // Qualitäts-Filter bestehen.
  function generateCandidates(dateKey) {
    const rng = makeRng(dateKey);
    const candidates = [];
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      candidates.push({
        st: STATE_CODES[Math.floor(rng() * STATE_CODES.length)],
        month: Math.floor(rng() * 12),
        budget: 2 + Math.floor(rng() * 3), // 2..4
      });
    }
    return candidates;
  }

  // "Ist dieser Tag frei" – gleiche Regel wie bei "Gemeinsam frei":
  // kalendarisch frei (Feiertag/Wochenende/kein Arbeitstag) ODER als
  // Urlaub gesetzt.
  function isFreeDay(day, selVal) {
    return day.cost === 0 || selVal === "vac" || selVal === "ot";
  }

  // Längster zusammenhängender freier Lauf – wiederverwendbar für die
  // Musterlösung (sel aus plan()) UND das Spieler-Ergebnis (sel nur aus
  // "vac"/null, das Spiel kennt keine Überstunden).
  function longestFreeRun(monthDays, sel) {
    let best = 0, bestStart = -1, bestEnd = -1;
    let cur = 0, curStart = -1;
    for (let i = 0; i < monthDays.length; i++) {
      if (isFreeDay(monthDays[i], sel[i])) {
        if (cur === 0) curStart = i;
        cur++;
        if (cur > best) { best = cur; bestStart = curStart; bestEnd = i; }
      } else {
        cur = 0;
      }
    }
    return { length: best, startIdx: bestStart, endIdx: bestEnd };
  }

  // plan() kennt keine Grenze "nur innerhalb dieses Monats" – bei einem
  // vollen Jahres-Array würde die Automatik ggf. über mehrere Monate
  // verteilen, was mit dem angezeigten Spielbrett nicht mehr vergleichbar
  // wäre. Deshalb wird buildDays() zwar für das volle Jahr aufgerufen (kennt
  // keine Teiljahre), das Ergebnis aber auf den Zielmonat gefiltert und NUR
  // dieses gefilterte Array an plan() übergeben. plan() arbeitet rein über
  // Array-Indizes (kein Bezug auf day.i), das Slicing ist daher sicher.
  function evaluateCandidate(candidate, year, t) {
    const yearDays = buildDays(year, candidate.st, "50", null, t, undefined, "DE");
    const monthDays = yearDays.filter((d) => d.m === candidate.month);
    const workingDays = monthDays.filter((d) => d.cost > 0).length;
    if (workingDays < candidate.budget) return null; // Budget passt nicht in den Monat
    const cfg = {
      vac: candidate.budget, ot: 0,
      autoVac: candidate.budget, autoOt: 0,
      spendFirst: "vac", autoFromMonth: 0,
      schoolHolidayPreference: "neutral", vacationDays: null,
      overrides: {}, blocks: [],
    };
    const result = plan(monthDays, cfg);
    const optimalRun = longestFreeRun(monthDays, result.sel);
    return {
      st: candidate.st, month: candidate.month, budget: candidate.budget,
      year, monthDays, optimalSel: result.sel,
      optimalRun, optimalScore: optimalRun.length,
    };
  }

  // Erster Kandidat (in fester Zug-Reihenfolge), dessen Musterlösung
  // spürbar mehr freie Tage als eingesetztes Budget ergibt – sonst wäre
  // das Rätsel trivial/uninteressant. Fallback: bester Kandidat nach
  // Marge, falls keiner die Schwelle erreicht (kann laut Analyse nicht
  // leer bleiben, da jeder Monat ausreichend Arbeitstage für ein Budget
  // von höchstens 4 hat).
  function generateDailyPuzzle(dateKey, t, year) {
    const evaluated = generateCandidates(dateKey)
      .map((c) => evaluateCandidate(c, year, t))
      .filter(Boolean);
    const passing = evaluated.filter((e) => e.optimalScore > e.budget + QUALITY_MARGIN);
    const chosen = passing.length > 0
      ? passing[0]
      : evaluated.slice().sort((a, b) => (b.optimalScore - b.budget) - (a.optimalScore - a.budget))[0];
    return { dateKey, puzzleNumber: puzzleNumber(dateKey), ...chosen };
  }

  function puzzleNumber(dateKey) {
    const [ly, lm, ld] = LAUNCH_DATE_KEY.split("-").map(Number);
    const [y, m, d] = dateKey.split("-").map(Number);
    return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(ly, lm - 1, ld)) / DAY) + 1;
  }

  // Emoji-Fenster um die Musterlösung zentriert (bei Rand-Überlauf
  // verschoben statt abgeschnitten, damit das geteilte Grid immer exakt
  // windowSize breit ist). Die Emoji-WERTE kommen aus dem übergebenen
  // sel-Array (beim Teilen: das Spieler-Ergebnis).
  function buildEmojiWindow(monthDays, sel, optimalRun, windowSize) {
    const n = monthDays.length;
    const size = Math.min(windowSize, n);
    let start = optimalRun.startIdx - Math.floor((size - (optimalRun.endIdx - optimalRun.startIdx + 1)) / 2);
    start = Math.max(0, Math.min(start, n - size));
    let out = "";
    for (let i = start; i < start + size; i++) {
      const day = monthDays[i];
      if (sel[i] === "vac" && day.cost > 0) out += "🟨";
      else if (day.cost === 0 || sel[i] === "vac") out += "🟩";
      else out += "⬜";
    }
    return out;
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.puzzle = {
    STATE_CODES, LAUNCH_DATE_KEY, MAX_ATTEMPTS, QUALITY_MARGIN, EMOJI_WINDOW_SIZE,
    generateDailyPuzzle, longestFreeRun, buildEmojiWindow, puzzleNumber, isFreeDay,
  };
})();
