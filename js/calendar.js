/* ------------------------------------------------------------------ */
/* js/calendar.js – reine Kalender- und Normalisierungslogik (kein      */
/* React, kein DOM, kein fetch()). Übersetzte Feiertags-/Fallback-Namen  */
/* werden als Funktion `t` PARAMETER übergeben statt direkt auf          */
/* window.I18N zuzugreifen, damit dieses Modul unabhängig bleibt. Wird   */
/* unverändert per <script src="js/calendar.js"> geladen (kein           */
/* Modulsystem, siehe CLAUDE.md). Öffentliche Oberfläche:                */
/* window.FREILOTSE.calendar.                                            */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";

  const DAY = 86400000;

  // Gauß'sche Osterformel (gregorianisch) -> UTC-Timestamp des Ostersonntags
  function easterUTC(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return Date.UTC(y, month - 1, day);
  }

  // Verteilt auf holidayMapDE/AT/CH je nach `country` (Default "DE" für
  // Abwärtskompatibilität mit Aufrufern, die country weglassen). Reiner
  // lokaler Fallback, falls die OpenHolidays API nicht erreichbar ist (siehe
  // js/data-sources.js) – für AT/CH bewusst mit Live-Daten der API als
  // Grundlage kuratiert (siehe CLAUDE.md, Abschnitt „Regelmäßige
  // Arbeitstage"/PR-Beschreibung), nicht vollständig (z. B. rein
  // informative/sub-kantonale Schweizer Bräuche wie Sechseläuten fehlen
  // bewusst, analog zur bestehenden Augsburg-Ausnahme bei DE).
  function holidayMap(year, st, t, country) {
    const c = country || "DE";
    if (c === "AT") return holidayMapAT(year, t);
    if (c === "CH") return holidayMapCH(year, st, t);
    return holidayMapDE(year, st, t);
  }

  function holidayMapDE(year, st, t) {
    const H = {}; // key "m-d" (m: 0-basiert)
    const fix = (m, d, name, states) => {
      if (!states || states.includes(st)) H[`${m}-${d}`] = name;
    };
    const easter = easterUTC(year);
    const rel = (offset, name, states) => {
      if (states && !states.includes(st)) return;
      const dt = new Date(easter + offset * DAY);
      H[`${dt.getUTCMonth()}-${dt.getUTCDate()}`] = name;
    };

    fix(0, 1, t("holidays.newYear"));
    fix(0, 6, t("holidays.epiphany"), ["BW", "BY", "ST"]);
    fix(2, 8, t("holidays.womensDay"), ["BE", "MV"]);
    rel(-2, t("holidays.goodFriday"));
    rel(0, t("holidays.easterSunday"), ["BB"]);
    rel(1, t("holidays.easterMonday"));
    fix(4, 1, t("holidays.laborDay"));
    rel(39, t("holidays.ascensionDay"));
    rel(49, t("holidays.pentecostSunday"), ["BB"]);
    rel(50, t("holidays.pentecostMonday"));
    rel(60, t("holidays.corpusChristi"), ["BW", "BY", "HE", "NW", "RP", "SL"]);
    // In Saarland landesweit gültig. In Bayern gesetzlich NUR in Gemeinden mit
    // überwiegend katholischer Bevölkerung – mangels Gemeinde-Granularität wird
    // er hier dennoch für ganz BY angesetzt (wie auch externe Feiertags-APIs das
    // üblicherweise vereinfachen); ein Hinweis dazu erscheint stattdessen in der
    // Kalenderanzeige/Monatszusammenfassung und im Profi-Einstellungspanel
    // (siehe isBavarianPartialAssumptionDay/withAssumptionDayCaveat in app.jsx).
    fix(7, 15, t("holidays.assumptionDay"), ["SL", "BY"]);
    fix(8, 20, t("holidays.childrensDay"), ["TH"]);
    fix(9, 3, t("holidays.germanUnityDay"));
    fix(9, 31, t("holidays.reformationDay"), ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"]);
    fix(10, 1, t("holidays.allSaintsDay"), ["BW", "BY", "NW", "RP", "SL"]);
    fix(11, 25, t("holidays.christmasDay1"));
    fix(11, 26, t("holidays.christmasDay2"));
    if (st === "SN") {
      // Buß- und Bettag: Mittwoch vor dem 23.11.
      for (let d = 16; d <= 22; d++) {
        if (new Date(Date.UTC(year, 10, d)).getUTCDay() === 3) { H[`10-${d}`] = t("holidays.dayOfRepentance"); break; }
      }
    }
    return H;
  }

  // Österreich: alle 9 Bundesländer haben dieselben 13 gesetzlichen
  // Feiertage (bundesweit, keine landesspezifischen Ausnahmen wie in
  // Deutschland/der Schweiz – live über die OpenHolidays API geprüft).
  function holidayMapAT(year, t) {
    const H = {};
    const fix = (m, d, name) => { H[`${m}-${d}`] = name; };
    const easter = easterUTC(year);
    const rel = (offset, name) => {
      const dt = new Date(easter + offset * DAY);
      H[`${dt.getUTCMonth()}-${dt.getUTCDate()}`] = name;
    };

    fix(0, 1, t("holidays.newYear"));
    fix(0, 6, t("holidays.epiphany"));
    rel(1, t("holidays.easterMonday"));
    fix(4, 1, t("holidays.at.staatsfeiertag"));
    rel(39, t("holidays.ascensionDay"));
    rel(50, t("holidays.pentecostMonday"));
    rel(60, t("holidays.corpusChristi"));
    fix(7, 15, t("holidays.assumptionDay"));
    fix(9, 26, t("holidays.at.nationalfeiertag"));
    fix(10, 1, t("holidays.allSaintsDay"));
    fix(11, 8, t("holidays.at.mariaEmpfaengnis"));
    fix(11, 25, t("holidays.at.christtag"));
    fix(11, 26, t("holidays.at.stefanitag"));
    return H;
  }

  // Schweiz: nur 4 Feiertage sind gesamtschweizerisch, der Rest ist kantonal
  // unterschiedlich. Kantonslisten stammen aus einer Live-Abfrage der
  // OpenHolidays API (PublicHolidays, countryIsoCode=CH) für das Jahr 2026;
  // rein informative/sub-kantonale Einträge ohne eigene Kantons-Subdivision
  // (z. B. Sechseläuten/Knabenschiessen – nur Stadt Zürich) sind bewusst
  // ausgeschlossen. Näfelser Fahrt (GL) fehlt bewusst (seltener Einzelfall
  // mit unüblicher Datumsregel).
  function holidayMapCH(year, st, t) {
    const H = {};
    const fix = (m, d, name, cantons) => {
      if (!cantons || cantons.includes(st)) H[`${m}-${d}`] = name;
    };
    const easter = easterUTC(year);
    const rel = (offset, name, cantons) => {
      if (cantons && !cantons.includes(st)) return;
      const dt = new Date(easter + offset * DAY);
      H[`${dt.getUTCMonth()}-${dt.getUTCDate()}`] = name;
    };
    const ALL_CANTONS = ["AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU", "LU", "NE",
      "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH"];
    const withoutCantons = (...excluded) => ALL_CANTONS.filter((c) => !excluded.includes(c));

    // Gesamtschweizerisch
    fix(0, 1, t("holidays.ch.neujahrstag"));
    rel(39, t("holidays.ch.auffahrt"));
    fix(7, 1, t("holidays.ch.bundesfeiertag"));
    fix(11, 25, t("holidays.ch.weihnachten"));

    // Kantonal (Berchtoldstag: bewusst OHNE ZH – dort laut OpenHolidays API
    // nur "Optional"/Brauch, kein gesetzlicher Feiertag, siehe type="Optional")
    fix(0, 2, t("holidays.ch.berchtoldstag"), ["BE", "GL", "JU", "LU", "NW", "OW", "SG", "SH", "SO", "TG", "VD", "VS", "ZG"]);
    fix(0, 6, t("holidays.ch.dreikoenigstag"), ["SZ", "TI", "UR"]);
    fix(2, 1, t("holidays.ch.jahrestagRepublik"), ["NE"]);
    fix(2, 19, t("holidays.ch.josephstag"), ["NW", "SZ", "TI", "UR", "VS"]);
    rel(-2, t("holidays.goodFriday"), withoutCantons("TI", "VS"));
    rel(1, t("holidays.easterMonday"), withoutCantons("AG"));
    fix(4, 1, t("holidays.ch.tagDerArbeit"), ["AG", "BL", "BS", "JU", "NE", "SH", "TG", "TI", "ZH"]);
    rel(50, t("holidays.pentecostMonday"), withoutCantons("AG"));
    rel(60, t("holidays.corpusChristi"), ["AI", "FR", "JU", "LU", "NE", "NW", "OW", "SZ", "TI", "UR", "VS", "ZG"]);
    fix(5, 23, t("holidays.ch.festDerUnabhaengigkeit"), ["JU"]);
    fix(5, 29, t("holidays.ch.peterUndPaul"), ["TI"]);
    fix(7, 15, t("holidays.assumptionDay"), ["AI", "FR", "JU", "LU", "NW", "OW", "SZ", "TI", "UR", "VS", "ZG"]);
    fix(8, 10, t("holidays.ch.genferBettag"), ["GE"]);
    // Berechnete September-Termine: 3. Sonntag im September (Eidgenössischer
    // Dank-, Buss- und Bettag) sowie der darauffolgende Montag
    // (Bettagsmontag, nur Waadt/VD).
    let firstSunday = 1;
    for (let d = 1; d <= 7; d++) {
      if (new Date(Date.UTC(year, 8, d)).getUTCDay() === 0) { firstSunday = d; break; }
    }
    const thirdSunday = firstSunday + 14;
    fix(8, thirdSunday, t("holidays.ch.eidgBettag"), ["BE", "BL", "BS", "GL", "GR", "LU", "NE", "NW", "OW", "SG", "SH", "SZ", "TG", "UR", "VS", "ZG", "ZH"]);
    fix(8, thirdSunday + 1, t("holidays.ch.bettagsmontag"), ["VD"]);
    fix(10, 1, t("holidays.allSaintsDay"), ["AI", "FR", "GL", "GR", "JU", "LU", "NW", "OW", "SG", "SZ", "TI", "UR", "VS", "ZG"]);
    fix(11, 8, t("holidays.ch.mariaEmpfaengnis"), ["AI", "FR", "LU", "NW", "OW", "SZ", "TI", "UR", "VS", "ZG"]);
    fix(11, 26, t("holidays.ch.stephanstag"), ["AR", "BE", "BL", "BS", "FR", "GL", "GR", "LU", "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VS", "ZG", "ZH"]);
    fix(11, 31, t("holidays.ch.wiederherstellungRepublik"), ["GE"]);
    return H;
  }

  // Standard-Arbeitswoche (Montag bis Freitag), falls workingWeekdays fehlt
  // oder leer ist (z. B. ältere Aufrufer) – identisch zum bisherigen fest
  // codierten Montag-bis-Freitag-Verhalten.
  const DEFAULT_WORKING_WEEKDAYS = [1, 2, 3, 4, 5];

  // workingWeekdays: Array von Wochentags-Indizes wie Date.getUTCDay()
  // (0 = Sonntag … 6 = Samstag), z. B. [1,2,3,4,5] für Montag bis Freitag.
  // Bestimmt AUSSCHLIESSLICH, an welchen Wochentagen ein Urlaubstag benötigt
  // würde ("persönlicher regulärer Arbeitstag") – keine wechselnden
  // Schichtpläne, keine wochenabhängigen Muster, keine Stunden/Teilzeitquoten.
  function buildDays(year, st, xmasRule, extHolidays, t, workingWeekdays, country) {
    const ww = Array.isArray(workingWeekdays) && workingWeekdays.length > 0
      ? workingWeekdays : DEFAULT_WORKING_WEEKDAYS;
    // Externe Daten (API) haben Vorrang; sonst integrierte Berechnung als Fallback
    const H = extHolidays || holidayMap(year, st, t, country);
    const days = [];
    for (let ts = Date.UTC(year, 0, 1); ; ts += DAY) {
      const dt = new Date(ts);
      if (dt.getUTCFullYear() !== year) break;
      const m = dt.getUTCMonth(), d = dt.getUTCDate(), dow = dt.getUTCDay();
      const holiday = H[`${m}-${d}`] || null;
      const special = m === 11 && d === 24 ? t("special.christmasEve") : m === 11 && d === 31 ? t("special.newYearsEve") : null;
      // weekend: TATSÄCHLICHES Kalenderwochenende (Samstag/Sonntag) – bleibt für
      // Darstellung und echte Wochenend-Erkennung erhalten, ist aber NICHT mehr
      // die Grundlage für Kosten/Planbarkeit (siehe isWorkingDay).
      const weekend = dow === 0 || dow === 6;
      // isWorkingDay: persönlicher regulärer Arbeitstag laut workingWeekdays,
      // unabhängig davon, ob dieser Wochentag ein Kalenderwochenende ist.
      const isWorkingDay = ww.includes(dow);
      let cost = 1;
      // Ein nicht ausgewählter Wochentag ODER ein Feiertag kostet immer 0 -
      // dadurch greift die 24./31.12.-Sonderregel (nächste Zeile) automatisch
      // NUR an persönlichen Arbeitstagen ohne Feiertag, ganz ohne Sonderfall.
      if (!isWorkingDay || holiday) cost = 0;
      else if (special) cost = xmasRule === "0" ? 0 : xmasRule === "50" ? 0.5 : 1;
      days.push({ i: days.length, m, d, dow, holiday, special, weekend, isWorkingDay, cost });
    }
    return days;
  }

  // Wandelt die von der API gelieferten Ferien-Zeiträume in eine Map
  // "m-d" -> { name, start, end } um, begrenzt auf das sichtbare Kalenderjahr.
  // Reine Datenaufbereitung – getrennt von API-Aufruf und Darstellung.
  // Erwartet bereits NORMALISIERTE Zeiträume { start, end, name, source } (siehe
  // normalizeOpenHolidaysPeriod / normalizeSchulferienApiPeriod in
  // js/data-sources.js); die Felder start/end sind gültige, parsebare
  // Datumswerte, "end" ist inklusive.
  function vacationDayMap(periods, year, t) {
    const map = {};
    if (!Array.isArray(periods)) return map;
    for (const p of periods) {
      if (!p || !p.start || !p.end) continue; // ungültige Einträge überspringen
      const s = new Date(p.start), e = new Date(p.end);
      if (isNaN(s) || isNaN(e) || e < s) continue;
      // Auf die im Kalender sichtbaren Tage des gewählten Jahres begrenzen
      // (Ferien über den Jahreswechsel werden so korrekt beschnitten).
      let ts = Math.max(Date.UTC(year, 0, 1), Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate()));
      const end = Math.min(Date.UTC(year, 11, 31), Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()));
      for (; ts <= end; ts += DAY) {
        const dt = new Date(ts);
        const key = `${dt.getUTCMonth()}-${dt.getUTCDate()}`;
        if (!map[key]) map[key] = { name: p.name_cp || p.name || t("fallback.schoolHolidays"), start: s, end: e };
      }
    }
    return map;
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.calendar = { DAY, easterUTC, holidayMap, buildDays, vacationDayMap };
})();
