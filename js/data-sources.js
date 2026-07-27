/* ------------------------------------------------------------------ */
/* js/data-sources.js – Anbindung externer Datenquellen (OpenHolidays    */
/* API, schulferien-api.de): Netzwerkabruf, quellenspezifische           */
/* Normalisierung, Fallback-Orchestrierung, eindeutige Statuswerte. Kein */
/* React, keine Abhängigkeit von window.I18N. Wird unverändert per       */
/* <script src="js/data-sources.js"> geladen (kein Modulsystem, siehe    */
/* CLAUDE.md). Öffentliche Oberfläche: window.FREILOTSE.dataSources.     */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";

  /* --- Feiertage: OpenHolidays API (Primärquelle), integrierte          --- */
  /* --- Berechnung (js/calendar.js: holidayMap) bleibt unveränderter Fallback --- */

  // Fragt die OpenHolidays API (PublicHolidays) ab und liefert ein
  // strukturiertes Ergebnis im unveränderten Format { status, holidays }.
  // status "api": Abruf erfolgreich UND mindestens ein Feiertag enthalten.
  // status "lokal": HTTP-/Netzwerkfehler, kein gültiges JSON-Array oder leeres
  // Ergebnis -> Aufrufer verwendet die integrierte Berechnung als Fallback.
  // Wirft nie – jeder Fehlerfall wird als { status: "lokal", holidays: null }
  // codiert, damit ein Ausfall nie zum Absturz führt.
  async function loadPublicHolidays(year, stateCode, country) {
    const c = country || "DE";
    try {
      // Interne Bundesland-/Kantons-Codes (z. B. "BY", "ZH") bleiben
      // unverändert; nur für die Anfrage wird daraus der OpenHolidays-
      // Subdivision-Code (z. B. "DE-BY", "CH-ZH").
      const url = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${c}&subdivisionCode=${c}-${stateCode}&languageIsoCode=DE&validFrom=${year}-01-01&validTo=${year}-12-31`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      if (!Array.isArray(json)) throw new Error("kein Array");
      const map = {};
      for (const e of json) {
        if (!e || typeof e !== "object" || e.type !== "Public") continue;
        // Nur landesweite bzw. exakt für dieses Bundesland/diesen Kanton
        // gültige Feiertage. Feinere Sonderfälle liefert die API mit tieferer
        // Subdivision (z. B. Augsburger Friedensfest als "DE-BY-AU", oder
        // schweizerische Bezirke wie "CH-AG-RF-MA") und fallen damit heraus –
        // gleiche Wirkung wie der frühere Augsburg-Filter bei feiertage-api.de.
        const appliesToState = e.nationwide === true ||
          (Array.isArray(e.subdivisions) && e.subdivisions.some(
            (s) => s && (s.shortName === stateCode || s.code === `${c}-${stateCode}`)
          ));
        if (!appliesToState) continue;
        // Gesetzliche Feiertage sind eintägig -> startDate genügt ("YYYY-MM-DD").
        if (typeof e.startDate !== "string") continue;
        const [yy, mm, dd] = e.startDate.split("-").map((x) => parseInt(x, 10));
        if (yy !== year || !(mm >= 1) || !(dd >= 1)) continue;
        let name = null;
        if (Array.isArray(e.name)) {
          const de = e.name.find((n) => n && n.language === "DE" && typeof n.text === "string");
          const first = e.name.find((n) => n && typeof n.text === "string");
          name = (de || first || {}).text || null;
        }
        if (!name) continue;
        map[`${mm - 1}-${dd}`] = name;
      }
      if (Object.keys(map).length === 0) throw new Error("keine Daten");
      return { status: "api", holidays: map };
    } catch (e) {
      return { status: "lokal", holidays: null };
    }
  }

  /* ------------------------------------------------------------------ */
  /* Schulferien: Primärquelle OpenHolidays API, Ersatzquelle             */
  /* schulferien-api.de – beide werden unmittelbar nach dem Abruf auf     */
  /* ein gemeinsames internes Format normalisiert: { start, end, name,    */
  /* source }. "start"/"end" sind gültige ISO-Datumswerte, "end" ist bei  */
  /* BEIDEN Quellen inklusive (letzter Ferientag), sodass vacationDayMap()*/
  /* (js/calendar.js) unverändert bleiben kann.                          */
  /* ------------------------------------------------------------------ */

  // OpenHolidays SchoolHolidays liefert ein JSON-Array direkt (kein Wrapper-
  // Objekt), Felder u. a. startDate/endDate ("YYYY-MM-DD", ohne Uhrzeit -> von
  // JS als UTC-Mitternacht interpretiert, keine Zeitzonenverschiebung) sowie
  // name als Array [{ language, text }]. endDate ist INKLUSIVE: Einträge mit
  // nur einem Ferientag haben startDate === endDate (z. B. „Buß- und Bettag“),
  // was bei einem exklusiven Enddatum nicht möglich wäre.
  function normalizeOpenHolidaysPeriod(e) {
    if (!e || typeof e !== "object") return null;
    const start = typeof e.startDate === "string" ? e.startDate : null;
    const end = typeof e.endDate === "string" ? e.endDate : null;
    if (!start || !end) return null;
    const sd = new Date(start), ed = new Date(end);
    if (isNaN(sd) || isNaN(ed) || ed < sd) return null; // ungültigen Zeitraum verwerfen
    let name = null;
    if (Array.isArray(e.name)) {
      const de = e.name.find((n) => n && n.language === "DE" && typeof n.text === "string");
      const first = e.name.find((n) => n && typeof n.text === "string");
      name = (de || first || {}).text || null;
    }
    return { start, end, name, source: "openholidays" };
  }

  // schulferien-api.de (v1) liefert ein JSON-Array mit Feldern start/end
  // (ISO-Zeitstempel inkl. "Z", z. B. "2029-07-30T00:00Z" / "...T23:59Z" –
  // das Enddatum bezeichnet seit der v1-Datenkorrektur den tatsächlichen
  // letzten Ferientag, also ebenfalls INKLUSIVE) sowie name/name_cp.
  function normalizeSchulferienApiPeriod(e) {
    if (!e || typeof e !== "object") return null;
    const start = typeof e.start === "string" ? e.start : null;
    const end = typeof e.end === "string" ? e.end : null;
    if (!start || !end) return null;
    const sd = new Date(start), ed = new Date(end);
    if (isNaN(sd) || isNaN(ed) || ed < sd) return null;
    const name = (typeof e.name_cp === "string" && e.name_cp) || (typeof e.name === "string" && e.name) || null;
    return { start, end, name, source: "schulferien-api" };
  }

  function fetchOpenHolidaysResponse(year, st, country) {
    const c = country || "DE";
    // Interne Bundesland-/Kantons-Codes (z. B. "BY", "ZH") bleiben
    // unverändert; nur für diese eine Anfrage wird daraus der OpenHolidays-
    // Subdivision-Code (z. B. "DE-BY", "CH-ZH").
    const url = `https://openholidaysapi.org/SchoolHolidays?countryIsoCode=${c}&subdivisionCode=${c}-${st}&languageIsoCode=DE&validFrom=${year}-01-01&validTo=${year}-12-31`;
    return fetch(url);
  }
  function fetchSchulferienApiResponse(year, st) {
    return fetch(`https://schulferien-api.de/api/v1/${year}/${st}/`);
  }

  // Fragt eine einzelne Quelle ab und unterscheidet dabei klar zwischen
  // "technisch nicht erreichbar" (Netzwerkfehler oder HTTP-Fehlerstatus) und
  // "erreichbar, aber ohne verwertbare Daten" (Antwort kam an, war jedoch kein
  // gültiges Array, enthielt nur ungültige Einträge oder schlicht keine Ferien
  // für Jahr+Bundesland). Wirft nie – Fehler werden immer als Ergebnis codiert,
  // damit ein Ausfall nie zum Absturz führt.
  async function trySchoolHolidaySource(requestFn, normalizeFn) {
    let response;
    try {
      response = await requestFn();
    } catch (e) {
      return { reachable: false, periods: [] }; // Netzwerkfehler o. Ä.
    }
    if (!response || !response.ok) return { reachable: false, periods: [] }; // HTTP-Fehler
    let json;
    try {
      json = await response.json();
    } catch (e) {
      return { reachable: true, periods: [] }; // Antwort kam an, kein gültiges JSON
    }
    if (!Array.isArray(json)) return { reachable: true, periods: [] }; // kein gültiges Array
    const periods = json.map(normalizeFn).filter(Boolean); // ungültige Einträge verwerfen
    return { reachable: true, periods };
  }

  // Orchestriert Primär- und Ersatzquelle gemäß der geforderten Strategie:
  // 1) OpenHolidays versuchen; liefert es Daten, werden diese verwendet.
  // 2) Sonst (nicht erreichbar, HTTP-Fehler, kein Array, nur ungültige
  //    Einträge oder schlicht keine Ferien) schulferien-api.de versuchen –
  //    ABER NUR für Deutschland: schulferien-api.de deckt ausschließlich
  //    deutsche Bundesländer ab, für AT/CH wird dieser Aufruf übersprungen.
  // 3) Liefert auch die Ersatzquelle nichts (bzw. entfällt sie mangels
  //    Abdeckung): "keine" (mind. eine Quelle war erreichbar) oder "fehler"
  //    (technisch nicht erreichbar).
  async function loadSchoolHolidays(year, st, country) {
    const c = country || "DE";
    const primary = await trySchoolHolidaySource(() => fetchOpenHolidaysResponse(year, st, c), normalizeOpenHolidaysPeriod);
    if (primary.periods.length > 0) return { status: "openholidays", periods: primary.periods };

    if (c !== "DE") {
      return { status: primary.reachable ? "keine" : "fehler", periods: [] };
    }

    const fallback = await trySchoolHolidaySource(() => fetchSchulferienApiResponse(year, st), normalizeSchulferienApiPeriod);
    if (fallback.periods.length > 0) return { status: "ersatz", periods: fallback.periods };

    if (primary.reachable || fallback.reachable) return { status: "keine", periods: [] };
    return { status: "fehler", periods: [] };
  }

  /* ------------------------------------------------------------------ */
  /* Land-Erkennung für die Vorauswahl (bestmöglich, wirft nie): zuerst per */
  /* IP-Geolocation über einen kostenlosen, schlüssellosen Dienst          */
  /* (CORS-fähig, funktioniert ohne Backend auf GitHub Pages); schlägt      */
  /* dieser Aufruf fehl (offline, durch Tracking-/Werbeblocker verhindert), */
  /* wird ersatzweise die Browsersprache ausgewertet (z. B. "de-AT"). Liefert */
  /* auch das nichts, gibt die Funktion null zurück – der Aufrufer behält   */
  /* dann seinen bisherigen Standard (Deutschland).                         */
  /* ------------------------------------------------------------------ */
  async function detectCountry(knownCountries) {
    try {
      const r = await fetch("https://get.geojs.io/v1/ip/country.json");
      if (r.ok) {
        const j = await r.json();
        if (j && typeof j.country === "string" && knownCountries.includes(j.country)) return j.country;
      }
    } catch (e) { /* nicht erreichbar/blockiert -> Sprach-Fallback unten */ }

    const langs = (typeof navigator !== "undefined" && Array.isArray(navigator.languages) && navigator.languages.length)
      ? navigator.languages
      : [(typeof navigator !== "undefined" && navigator.language) || ""];
    for (const l of langs) {
      const region = (String(l).split("-")[1] || "").toUpperCase();
      if (knownCountries.includes(region)) return region;
    }
    return null;
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.dataSources = {
    loadPublicHolidays,
    loadSchoolHolidays,
    normalizeOpenHolidaysPeriod,
    normalizeSchulferienApiPeriod,
    detectCountry,
  };
})();
