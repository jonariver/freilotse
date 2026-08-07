/* ------------------------------------------------------------------ */
/* locales/de.js – Deutsche Übersetzungen des Urlaubsplaners           */
/* ------------------------------------------------------------------ */
/* Muss VOR app.jsx geladen werden (siehe index.html). Definiert das   */
/* globale Objekt window.I18N mit der Funktion t(key, params).         */
/* Kein Modulsystem (kein import/export) – reines globales Script,     */
/* damit es unverändert per <script src="locales/de.js"> im Browser    */
/* und auf GitHub Pages ohne Build-Schritt funktioniert.                */
/* ------------------------------------------------------------------ */

(function () {
  "use strict";

  const DE = {
    /* ---- Länder (Codes bleiben sprachunabhängig, nur Namen) ---- */
    countries: {
      DE: "Deutschland", AT: "Österreich", CH: "Schweiz",
    },

    /* ---- Bezeichnung der Region-Auswahl je Land ("Bundesland"/"Kanton") ---- */
    regionLabel: {
      DE: "Bundesland", AT: "Bundesland", CH: "Kanton",
    },

    /* ---- Vorbelegte Region beim Länderwechsel (bewusst kuratiert: größte/
       bekannteste Region, nicht alphabetisch – analog zum bisherigen DE-
       Standard "BY") ---- */
    defaultRegion: {
      DE: "BY", AT: "WI", CH: "ZH",
    },

    /* ---- Bundesländer/Kantone je Land (Codes bleiben sprachunabhängig, nur
       Namen; entsprechen den OpenHolidays-Subdivision-Kürzeln ohne
       Länderpräfix, z. B. "BY" für "DE-BY", "WI" für "AT-WI") ---- */
    states: {
      DE: {
        BW: "Baden-Württemberg", BY: "Bayern", BE: "Berlin", BB: "Brandenburg",
        HB: "Bremen", HH: "Hamburg", HE: "Hessen", MV: "Mecklenburg-Vorpommern",
        NI: "Niedersachsen", NW: "Nordrhein-Westfalen", RP: "Rheinland-Pfalz",
        SL: "Saarland", SN: "Sachsen", ST: "Sachsen-Anhalt",
        SH: "Schleswig-Holstein", TH: "Thüringen",
      },
      AT: {
        BL: "Burgenland", KÄ: "Kärnten", NÖ: "Niederösterreich", OÖ: "Oberösterreich",
        SB: "Salzburg", SM: "Steiermark", TI: "Tirol", VA: "Vorarlberg", WI: "Wien",
      },
      CH: {
        AG: "Aargau", AI: "Appenzell Innerrhoden", AR: "Appenzell Ausserrhoden",
        BE: "Bern", BL: "Basel-Landschaft", BS: "Basel-Stadt", FR: "Freiburg",
        GE: "Genf", GL: "Glarus", GR: "Graubünden", JU: "Jura", LU: "Luzern",
        NE: "Neuenburg", NW: "Nidwalden", OW: "Obwalden", SG: "St. Gallen",
        SH: "Schaffhausen", SO: "Solothurn", SZ: "Schwyz", TG: "Thurgau",
        TI: "Tessin", UR: "Uri", VD: "Waadt", VS: "Wallis", ZG: "Zug", ZH: "Zürich",
      },
    },

    /* ---- Monate (Index 0 = Januar) ---- */
    months: [
      "Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember",
    ],

    /* ---- Wochentags-Kürzel, wie von JS Date.getUTCDay() geliefert (0=So) ---- */
    weekdaysApiOrder: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    /* ---- Vollständige Wochentagsnamen, gleiche Reihenfolge/Index (0=So) ---- */
    weekdaysFullApiOrder: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],

    /* ---- Von der App selbst berechnete/definierte Feiertagsnamen ---- */
    holidays: {
      newYear: "Neujahr",
      epiphany: "Heilige Drei Könige",
      womensDay: "Internationaler Frauentag",
      goodFriday: "Karfreitag",
      easterSunday: "Ostersonntag",
      easterMonday: "Ostermontag",
      laborDay: "Tag der Arbeit",
      ascensionDay: "Christi Himmelfahrt",
      pentecostSunday: "Pfingstsonntag",
      pentecostMonday: "Pfingstmontag",
      corpusChristi: "Fronleichnam",
      assumptionDay: "Mariä Himmelfahrt",
      childrensDay: "Weltkindertag",
      germanUnityDay: "Tag der Deutschen Einheit",
      reformationDay: "Reformationstag",
      allSaintsDay: "Allerheiligen",
      christmasDay1: "1. Weihnachtstag",
      christmasDay2: "2. Weihnachtstag",
      dayOfRepentance: "Buß- und Bettag",

      /* ---- Österreich: eigene Bezeichnungen für Feiertage, die dort anders
         heißen als in Deutschland (Termine ohne eigenen Namen s. o., z. B.
         Ostermontag/Christi Himmelfahrt/Pfingstmontag/Fronleichnam/
         Allerheiligen/Mariä Himmelfahrt/Heilige Drei Könige) ---- */
      at: {
        staatsfeiertag: "Staatsfeiertag",
        nationalfeiertag: "Nationalfeiertag",
        mariaEmpfaengnis: "Mariä Empfängnis",
        christtag: "Christtag",
        stefanitag: "Stefanitag",
      },

      /* ---- Schweiz: eigene Bezeichnungen für kantonal unterschiedliche bzw.
         landesweite Feiertage (Termine ohne eigenen Namen s. o., z. B.
         Karfreitag/Ostermontag/Pfingstmontag/Fronleichnam/Allerheiligen/
         Mariä Himmelfahrt) ---- */
      ch: {
        neujahrstag: "Neujahrstag",
        berchtoldstag: "Berchtoldstag",
        dreikoenigstag: "Dreikönigstag",
        jahrestagRepublik: "Jahrestag der Ausrufung der Republik",
        josephstag: "Josephstag",
        tagDerArbeit: "Tag der Arbeit",
        auffahrt: "Auffahrt",
        festDerUnabhaengigkeit: "Fest der Unabhängigkeit",
        peterUndPaul: "Peter und Paul",
        bundesfeiertag: "Bundesfeiertag",
        genferBettag: "Genfer Bettag",
        bettagsmontag: "Bettagsmontag",
        eidgBettag: "Eidgenössischer Dank-, Buss- und Bettag",
        mariaEmpfaengnis: "Mariä Empfängnis",
        stephanstag: "Stephanstag",
        weihnachten: "Weihnachten",
        wiederherstellungRepublik: "Wiederherstellung der Republik",
      },
    },

    /* ---- Sondertage (24./31.12.) ---- */
    special: {
      christmasEve: "Heiligabend",
      newYearsEve: "Silvester",
    },

    /* ---- Hinweise zu Feiertagen mit rechtlichen Besonderheiten ---- */
    holidayCaveats: {
      // Mariä Himmelfahrt (15.8.) ist in Bayern gesetzlich nur in Gemeinden mit
      // überwiegend katholischer Bevölkerung ein Feiertag, nicht landesweit.
      // Weder die lokale Berechnung noch externe Feiertags-APIs bilden diese
      // Gemeinde-Granularität ab; der Hinweis macht die Vereinfachung sichtbar.
      assumptionDayInline: "(nicht landesweit)",
      assumptionDayNotice:
        "Hinweis: Mariä Himmelfahrt (15. August) gilt in Bayern gesetzlich nur in Gemeinden mit überwiegend katholischer Bevölkerung, nicht landesweit. Diese Planung berücksichtigt ihn dennoch einheitlich als Feiertag – das kann in nicht-katholisch geprägten Gemeinden abweichen.",
    },

    /* ---- Von der App selbst gesetzte Fallback-Texte ---- */
    fallback: {
      schoolHolidays: "Schulferien",
    },

    /* ---- Tagestyp (Kalender-Tooltip, Dialog) ---- */
    dayType: {
      vacation: "Urlaub",
      overtime: "Überstundenabbau",
    },

    common: {
      moreInfo: "Mehr erfahren",
      documentTitle: "FREILOTSE – Urlaubsplaner für Brückentage & Feiertage",
      metaDescription: "FREILOTSE plant deine Brückentage automatisch: Feiertage, Schulferien und Urlaubstage passend zu deinem Bundesland oder Kanton – kostenlos und ohne Anmeldung.",
      loadingSharedPlan: "Geteilte Planung wird geladen …",
    },

    /* ---- Kopfbereich ---- */
    header: {
      tagline: (p) => `Feiertage · Brückentage · ${p.state}`,
      title: (p) => `Urlaubsplaner ${p.year}`,
      // total/usedVacRaw/usedOtRaw sind die ungeformatierten Zahlenwerte (für den
      // Singular-Vergleich), usedVac/usedOt die ggf. mit Komma formatierten
      // Anzeigewerte (siehe fmtNum) – beide werden getrennt benötigt, da ein
      // Vergleich nie gegen den bereits formatierten String erfolgen darf.
      freeDaysSuffix: (p) => {
        const daysWord = p.total === 1 ? "freier Tag" : "freie Tage";
        const periodsWord = p.periods === 1 ? "Zeitraum" : "Zeiträumen";
        const vacWord = p.usedVacRaw === 1 ? "Urlaubstag" : "Urlaubstagen";
        const otPart = p.usedOtRaw > 0
          ? ` und ${p.usedOt} ${p.usedOtRaw === 1 ? "Überstundentag" : "Überstundentagen"}`
          : "";
        return `${daysWord} in ${p.periods} ${periodsWord} mit ${p.usedVac} ${vacWord}${otPart}`;
      },
    },

    nav: {
      simpleMode: "Einfach",
      proMode: "Profi",
      backToStart: "← Zur Startseite",
      backToStartAriaLabel: "Zurück zur Startseite",
    },

    /* ---- Landing Page (Startansicht vor dem Planer) ---- */
    landing: {
      hero: {
        heading: "Mach mehr aus deinen Urlaubstagen",
        description: "Berechne deine Brückentage 2026 und 2027 automatisch: FREILOTSE kombiniert Feiertage, Brückentage und Schulferien passend zu deinem Bundesland oder Kanton und zeigt dir, wie du mit wenigen Urlaubstagen möglichst viele freie Tage am Stück bekommst.",
        example: "4 Urlaubstage können bis zu 10 freie Tage ergeben.",
      },
      modes: {
        heading: "Wähle deinen Einstieg",
        simple: {
          badge: "Empfohlen",
          title: "Einfach planen",
          text: "Beantworte wenige kurze Fragen und erhalte automatisch passende Urlaubsvorschläge.",
          benefits: [
            "Geführte Planung",
            "Schnelles Ergebnis",
            "Schulferien bevorzugen oder meiden",
            "Anschließend im Kalender anpassbar",
          ],
          button: "Einfach starten",
        },
        pro: {
          title: "Individuell planen",
          text: "Lege verfügbare Kontingente, Zeiträume und Regeln selbst fest.",
          benefits: [
            "Urlaubstage manuell setzen oder entfernen",
            "Überstundentage in die Planung einbeziehen",
            "Wunschblöcke und Sperrzeiten festlegen",
            "Reihenfolge für Urlaub und Überstunden bestimmen",
          ],
          button: "Profi-Modus öffnen",
        },
      },
      video: {
        heading: "FREILOTSE in 30 Sekunden",
        description: "Sieh dir an, wie FREILOTSE deine Urlaubstage clever mit Feiertagen und Brückentagen kombiniert.",
        playButtonLabel: "Video abspielen",
        thumbnailAlt: "Vorschaubild des Erklärvideos",
        mobileIframeTitle: "FREILOTSE Erklärvideo (Hochformat)",
        desktopIframeTitle: "FREILOTSE Erklärvideo (Querformat)",
      },
      features: {
        heading: "Automatisch planen, flexibel anpassen",
        items: [
          { icon: "🎯", title: "Passende Vorschläge", text: "Feiertage und Brückentage werden möglichst effizient genutzt." },
          { icon: "🖊️", title: "Kalender selbst bearbeiten", text: "Setze Urlaubstage direkt im Kalender oder entferne vorgeschlagene Tage wieder." },
          { icon: "🔀", title: "Urlaub und Überstunden kombinieren", text: "Nutze im Profi-Modus Urlaubstage und verfügbare Überstundentage gemeinsam." },
        ],
      },
      steps: {
        heading: "So funktioniert es",
        items: [
          { title: "Angaben machen", text: "Land, Region und Urlaubstage festlegen." },
          { title: "Wünsche auswählen", text: "Ziel und Umgang mit Schulferien bestimmen." },
          { title: "Planung anpassen", text: "Vorschläge prüfen und direkt im Kalender verändern." },
        ],
      },
      trust: {
        items: [
          "Feiertage passend zu Bundesland oder Kanton",
          "Schulferien werden berücksichtigt",
          "Keine Anmeldung erforderlich",
          "Planung als Link teilbar",
        ],
      },
      // Dezenter Teaser unmittelbar vor den Vertrauenshinweisen, verlinkt auf /ueber-freilotse.
      aboutTeaser: {
        text: "FREILOTSE ist ein unabhängiges Projekt von Jonathan.",
        linkText: "Mehr über das Projekt",
      },
    },

    /* ---- Impressum/Datenschutz (/impressum, /datenschutz) ---- */
    legal: {
      impressum: {
        documentTitle: "Impressum – FREILOTSE",
        metaDescription: "Impressum von FREILOTSE – Anbieterkennzeichnung und Kontaktmöglichkeit.",
      },
      datenschutz: {
        documentTitle: "Datenschutzerklärung – FREILOTSE",
        metaDescription: "Datenschutzerklärung von FREILOTSE: Informationen zur Verarbeitung personenbezogener Daten, u. a. bei Hosting, Kalenderdaten und Land-Vorauswahl.",
      },
    },

    /* ---- Seite „Über FREILOTSE" (/ueber-freilotse) ---- */
    about: {
      documentTitle: "Über FREILOTSE – Urlaubsplaner",
      metaDescription: "Lerne die Person hinter FREILOTSE kennen und erfahre, wie du das unabhängige Projekt freiwillig unterstützen kannst.",
      footerLink: "Über FREILOTSE",
      backToPlanner: "Zum Urlaubsplaner",
      pageTitle: "Über FREILOTSE",
      portraitAlt: "Jonathan, Entwickler von FREILOTSE",
      intro: "Hallo, ich bin Jonathan.",
      body1: "Beruflich arbeite ich als Wirtschaftsinformatiker in der IT. FREILOTSE ist als persönliches Projekt entstanden, weil ich ausprobieren wollte, wie weit ich eine eigene Idee mithilfe moderner KI-Werkzeuge umsetzen kann.",
      body2: "Dabei wollte ich nicht bloß Feiertage auflisten, sondern konkrete Vorschläge machen: Wie lassen sich Urlaubstage so einsetzen, dass möglichst lange freie Zeiträume entstehen? Wichtig war mir außerdem, dass der Planer auch für Menschen funktioniert, die nicht klassisch von Montag bis Freitag arbeiten.",
      linkedin: {
        linkText: "LinkedIn-Profil ansehen ↗",
        ariaLabel: "LinkedIn-Profil von Jonathan ansehen (öffnet in neuem Tab)",
      },
      values: {
        heading: "Was mir bei FREILOTSE wichtig ist",
        items: [
          "Kostenlos nutzbar",
          "Keine Registrierung erforderlich",
          "Datensparsame und möglichst lokale Verarbeitung",
          "Verständliche Planung statt unnötig komplizierter Bedienung",
          "Weiterentwicklung anhand praktischer Anforderungen und Rückmeldungen",
        ],
      },
      support: {
        heading: "Freiwillig unterstützen",
        text: "Ich entwickle und betreibe FREILOTSE selbst. Die Weiterentwicklung sowie Domain und Betrieb kosten Zeit und Geld. Wenn dir FREILOTSE bei deiner Planung geholfen hat, kannst du das Projekt freiwillig über PayPal unterstützen. Das ist selbstverständlich kein Muss – FREILOTSE bleibt auch ohne Unterstützung vollständig nutzbar.",
        button: "💚 FREILOTSE freiwillig unterstützen",
        buttonAriaLabel: "FREILOTSE freiwillig über PayPal unterstützen (öffnet in neuem Tab)",
      },
      // prefix/suffix umschließen den eingebetteten mailto-Link (siehe jsx/about-page.jsx) -
      // Grund identisch zu jsx/legal-pages.jsx: locales/de.js kann kein JSX abbilden.
      contact: {
        prefix: "Du hast Feedback oder eine Idee für FREILOTSE? Schreib mir gerne an ",
        suffix: ".",
      },
    },

    /* ---- PayPal-Unterstützung (Footer-Link + schwebender Button,
       jsx/support-components.jsx) ---- */
    support: {
      footerLinkText: "FREILOTSE unterstützen",
      floatingAriaLabel: "FREILOTSE über PayPal unterstützen",
      floatingLabelText: "Supporte FREILOTSE über PayPal",
      floatingHintText: "Hat dir FREILOTSE geholfen? Unterstütze das Projekt 💚",
    },

    /* ---- Seite „Anleitung" (/anleitung) ---- */
    guide: {
      documentTitle: "Anleitung – FREILOTSE",
      metaDescription: "So funktioniert FREILOTSE: Einfach-Modus, Profi-Modus und alle Funktionen im Überblick.",
      footerLink: "Anleitung",
      backToPlanner: "Zum Urlaubsplaner",
      pageTitle: "Anleitung",
      intro: "Ein Überblick über die wichtigsten Funktionen von FREILOTSE – vom schnellen Einstieg bis zu den Profi-Funktionen.",
      sections: [
        {
          heading: "Einfach- und Profi-Modus",
          body: [
            "Im Einfach-Modus führt dich FREILOTSE mit wenigen kurzen Fragen zu einem fertigen Vorschlag.",
            "Der Profi-Modus zeigt alle Einstellungen gleichzeitig und erlaubt zusätzlich, Tage direkt im Kalender manuell anzupassen. Du kannst jederzeit zwischen beiden Modi wechseln, ohne dass dabei etwas verloren geht.",
          ],
        },
        {
          heading: "Automatische Planung",
          body: [
            "FREILOTSE setzt Urlaubstage und Überstundenabbau dort ein, wo sie die meisten zusätzlichen freien Tage ergeben, z. B. an Brückentagen rund um Feiertage.",
            "Über „Budget der Automatik\" legst du fest, wie viele Tage dafür verwendet werden, über „Ab Monat\", ab wann im Jahr die Automatik beginnt.",
          ],
        },
        {
          heading: "Manuell planen (Profi-Modus)",
          body: [
            "Ein Klick im Kalender setzt je nach Auswahl einen Urlaubstag oder Überstundenabbau. Ein Klick auf einen bereits geplanten Tag öffnet die Möglichkeit, ihn zu entfernen oder zu tauschen.",
          ],
        },
        {
          heading: "Wunschblöcke",
          body: [
            "Lege feste Zeiträume fest, z. B. „9 Tage am Stück im Juli\" – FREILOTSE plant diese bevorzugt vor der übrigen Automatik ein.",
          ],
        },
        {
          heading: "Regelmäßige Arbeitstage",
          body: [
            "Arbeitest du nicht Montag bis Freitag, etwa bei Teilzeit, stellst du das unter „Arbeitsregelung\" ein. Die gesamte Planung berücksichtigt danach ausschließlich deine tatsächlichen Arbeitstage.",
          ],
        },
        {
          heading: "Planung teilen",
          body: [
            "Der Button „Planung teilen\" erzeugt einen Link, der ausschließlich deine Eingaben enthält – keine Feiertage, Schulferien oder sonstige persönliche Daten. Jeder mit diesem Link kann die Planung öffnen.",
          ],
        },
        {
          heading: "Meine Pläne",
          body: [
            "Speichert deine Planung direkt auf diesem Gerät – ohne Konto, ohne Server. Mehrere benannte Pläne sind möglich, z. B. für unterschiedliche Jahre oder Anlässe.",
          ],
        },
        {
          heading: "Gemeinsam frei",
          body: [
            "Füge den Share-Link einer anderen Person hinzu, um gemeinsame freie Tage zu finden – praktisch für Paare, Familie oder Kolleg:innen. Auch das bleibt vollständig auf deinem Gerät, der Link wird nirgends gespeichert.",
          ],
        },
        {
          heading: "Jahreswechsel-Erweiterung (Profi-Modus)",
          body: [
            "Reicht dein letzter freier Zeitraum bis Silvester, zeigt FREILOTSE automatisch die kostenlosen Tage direkt danach im neuen Jahr an (Feiertage, Wochenenden).",
            "Zusätzlich siehst du unverbindlich, wie viele weitere Urlaubstage aus dem neuen Jahr eine noch längere Pause ermöglichen würden – das wird nirgends automatisch eingeplant oder von einem Kontingent abgezogen.",
          ],
        },
        {
          heading: "Kalender exportieren",
          body: [
            "Jeder freie Zeitraum lässt sich einzeln als .ics-Datei herunterladen oder direkt in Google Kalender öffnen. „Gesamten Plan exportieren\" bündelt alle Zeiträume in einer einzigen Datei.",
          ],
        },
      ],
    },

    /* ---- Seite „Brückentage-Rätsel des Tages" (/raetsel) ---- */
    puzzle: {
      documentTitle: "Brückentage-Rätsel des Tages – FREILOTSE",
      metaDescription: "Ein tägliches Rätsel: Setze deine Urlaubstage richtig und finde den längsten freien Zeitraum.",
      footerLink: "Rätsel",
      backToPlanner: "Zum Urlaubsplaner",
      pageTitle: "Brückentage-Rätsel des Tages",
      intro: {
        puzzleNumberLabel: (p) => `Rätsel #${p.number}`,
        stateAndMonth: (p) => `Heute: ${p.state}, ${p.month} ${p.year}`,
        rulesHint: (p) => `Setze bis zu ${p.budget} Urlaubstage und finde den längsten zusammenhängenden freien Zeitraum.`,
        rulesDetail: "Feiertage und Wochenenden sind bereits frei. Klicke auf Arbeitstage, um sie als Urlaub zu setzen – du hast nur einen Versuch pro Tag, danach zeigt FREILOTSE die bestmögliche Lösung im Vergleich zu deinem Ergebnis.",
      },
      calendar: {
        legendFree: "bereits frei",
        legendSelected: "dein Urlaub",
        legendWorking: "Arbeitstag",
        budgetCounter: (p) => `${p.used} von ${p.budget} ausgewählt`,
      },
      actions: {
        evaluateButton: "Auswerten",
        resetButton: "Zurücksetzen",
        shareButton: "Ergebnis teilen",
        retryButton: "Erneut versuchen",
        ctaButton: "Fange jetzt kostenlos deine individuelle Urlaubsplanung an",
      },
      result: {
        scoreLine: (p) => `${p.score} von ${p.optimal} möglichen Tagen am Stück`,
        perfectMessage: "Perfekt getroffen – das war die bestmögliche Lösung! 🎯",
        belowOptimalMessage: (p) => `Mit ${p.diff} ${p.diff === 1 ? "Tag" : "Tagen"} mehr wäre die bestmögliche Lösung noch drin gewesen.`,
        emojiGridLabel: "Dein Ergebnis",
        officialBadge: "Gewertet",
        practiceBadge: "Übungsversuch – nicht gewertet",
        officialReference: (p) => `Dein gewertetes Ergebnis heute: ${p.score}/${p.optimal}`,
      },
      share: {
        nativeTitle: (p) => `FREILOTSE Brückentage-Rätsel #${p.puzzleNumber}`,
        nativeText: (p) => `FREILOTSE Brückentage-Rätsel #${p.puzzleNumber}\n${p.score}/${p.optimal} Tage am Stück 🎯\n\n${p.emojiGrid}\n\n${p.url}`,
      },
      locked: {
        title: "Rätsel des Tages – bereits gespielt",
        description: "Du hast heute schon gespielt. Morgen gibt es ein neues Rätsel.",
      },
      countdown: {
        label: (p) => `Nächstes Rätsel in ${p.time}`,
      },
      stats: {
        title: "Deine Statistik",
        currentStreak: "Aktuelle Serie",
        maxStreak: "Beste Serie",
        gamesPlayed: "Gespielt",
        unavailableNotice: "Statistik nicht verfügbar (lokaler Speicher blockiert).",
      },
    },

    /* ---- Seite „Neuigkeiten" (/neuigkeiten) ---- */
    changelog: {
      documentTitle: "Neuigkeiten – FREILOTSE",
      metaDescription: "Alle Neuerungen und Updates von FREILOTSE im Überblick.",
      footerLink: "Neuigkeiten",
      backToPlanner: "Zum Urlaubsplaner",
      pageTitle: "Neuigkeiten",
      intro: "Hier findest du die wichtigsten Neuerungen und Updates von FREILOTSE – neueste zuerst.",
      entries: [
        {
          date: "7. August 2026",
          title: "Trip-Links bei langen freien Zeiträumen",
          items: [
            "Bei freien Zeiträumen ab 3 zusammenhängenden Tagen zeigt der Profi-Modus jetzt zusätzlich Schaltflächen für Google Flights und Booking.com mit dem passenden Datumsbereich – ein schneller Ausgangspunkt für die Reiseplanung. Trag optional ein Reiseziel ein, damit auch das direkt vorausgefüllt wird.",
            "Für einzelne Zeiträume mit abweichendem Reiseziel gibt es jetzt direkt unter den Schaltflächen ein eigenes kleines Eingabefeld, das für diesen Zeitraum das Reiseziel oben überschreibt.",
            "Die Reiseziel-Felder schlagen jetzt beim Tippen passende Ziele vor (z. B. große Städte und beliebte Urlaubsorte), um Tippfehler zu vermeiden.",
          ],
        },
        {
          date: "29. Juli 2026",
          title: "Bessere Vorschau beim Teilen von Links",
          items: [
            "Wenn du einen FREILOTSE-Link (z. B. zur Anleitung oder zum Rätsel) bei WhatsApp, LinkedIn oder anderen Diensten teilst, wird jetzt eine passende Vorschau mit Titel, Beschreibung und Bild angezeigt statt eines generischen Eintrags.",
            "Der Browser-Tab-Titel von Impressum und Datenschutzerklärung zeigt jetzt korrekt den Seitennamen an.",
          ],
        },
        {
          date: "29. Juli 2026",
          title: "Neues Erscheinungsbild: Freibad-Kachel",
          items: [
            "FREILOTSE hat ein komplett neues, wärmeres Design bekommen – inspiriert vom deutschen Freibad-Sommer statt vom generischen Software-Look.",
            "Der helle Modus ist jetzt Standard; der dunkle Modus bleibt über den bekannten Umschalter erhalten, nur wärmer gestaltet.",
            "Kalendertage erscheinen jetzt als runde Kacheln statt eckiger Kästchen.",
            "Feinschliff nach genauerem Hinsehen: Schulferien im Kalender haben jetzt eine eigene Farbe statt der Feiertagsfarbe, Warnhinweise im dunklen Modus sind besser lesbar, der schwebende Unterstützen-Button rutscht auf dem Smartphone wieder an den unteren Rand statt mittig zu schweben, und mehrere Buttons haben ihren Tastatur-Fokusring zurückbekommen.",
          ],
        },
        {
          date: "28. Juli 2026",
          title: "Unterstützung jetzt über PayPal",
          items: [
            "Der \"FREILOTSE unterstützen\"-Button im Footer sowie der schwebende Hinweis nach einer Planung führen jetzt zu PayPal statt Ko-fi.",
          ],
        },
        {
          date: "28. Juli 2026",
          title: "Brückentage-Rätsel des Tages",
          items: [
            "Neu im Footer: ein tägliches, Wordle-artiges Rätsel – setze deine Urlaubstage in einem Beispielmonat richtig und finde den längsten zusammenhängenden freien Zeitraum.",
            "Dein Ergebnis wird mit der objektiv besten Lösung verglichen und lässt sich als kompaktes Emoji-Grid teilen, ohne die Lösung zu verraten.",
            "Läuft komplett offline und ohne Konto – nur ein Versuch pro Tag, mit Serien-Statistik auf diesem Gerät.",
            "Nach dem gewerteten Versuch kannst du mit „Erneut versuchen“ beliebig oft weiterüben – deine Serie und Statistik bleiben dabei unverändert.",
          ],
        },
        {
          date: "28. Juli 2026",
          title: "Neue Anleitung",
          items: [
            "Eine neue Seite „Anleitung“ (verlinkt im Footer) erklärt kompakt alle Funktionen von FREILOTSE – vom Einfach-Modus bis zu Gemeinsam frei und der Jahreswechsel-Erweiterung.",
          ],
        },
        {
          date: "28. Juli 2026",
          title: "Freie Zeit über den Jahreswechsel erkennen",
          items: [
            "Im Profi-Modus werden kostenlose Feiertage, Wochenenden und regelmäßig freie Tage direkt nach Neujahr an einen Zeitraum bis Silvester angehängt.",
            "Mögliche Verlängerungen mit Urlaubstagen aus dem Folgejahr erscheinen separat als unverbindlicher Hinweis und verändern weder dein Kontingent noch die Jahreskennzahlen.",
            "ICS- und Google-Export dieses Zeitraums enthalten jetzt den kostenlosen Anhang aus dem Folgejahr.",
          ],
        },
        {
          date: "27. Juli 2026",
          title: "Gemeinsam freie Tage mit anderen finden",
          items: [
            "Neuer Bereich \"Gemeinsam frei\": Füge den Share-Link einer anderen Person hinzu und sieh direkt, an welchen Tagen ihr beide frei habt.",
            "Zeigt zu jedem gemeinsamen Zeitraum, wie viele Urlaubs- bzw. Überstundentage jede Person dafür einsetzt.",
            "Bleibt komplett clientseitig – der eingefügte Link wird nirgends gespeichert und nur für die aktuelle Sitzung ausgewertet.",
          ],
        },
        {
          date: "27. Juli 2026",
          title: "Gesamten Plan auf einmal exportieren",
          items: [
            "Ein neuer Button \"Gesamten Plan exportieren\" lädt alle freien Zeiträume gebündelt als eine .ics-Datei herunter, statt jeden Zeitraum einzeln exportieren zu müssen.",
            "Die Datei lässt sich in Apple Kalender, Outlook und iCal direkt öffnen sowie in Google Kalender über dessen \"Kalender importieren\"-Funktion einbinden.",
          ],
        },
        {
          date: "27. Juli 2026",
          title: "Pläne lokal speichern",
          items: [
            "Du kannst deine Planung jetzt direkt auf diesem Gerät speichern, damit sie beim nächsten Besuch automatisch wieder da ist.",
            "Mehrere benannte Pläne sind möglich, z. B. \"Urlaub 2027\" und \"Sommerferien Familie\" – über \"Meine Pläne\" im Kopfbereich verwaltbar (umbenennen, duplizieren, löschen).",
            "Es wird nichts an einen Server übertragen – die Pläne bleiben ausschließlich auf diesem Gerät.",
          ],
        },
        {
          date: "27. Juli 2026",
          title: "Österreich und Schweiz werden unterstützt",
          items: [
            "Neben Deutschland können jetzt auch Österreich und die Schweiz als Land ausgewählt werden, inklusive der jeweiligen Feiertage und Bundesländer/Kantone.",
            "FREILOTSE erkennt anhand deines Standorts automatisch ein passendes Land als Vorauswahl – du kannst sie jederzeit manuell ändern.",
            "Die automatische Standort-Erkennung reagiert jetzt zuverlässiger, auch wenn ein VPN oder eine Firewall die Abfrage blockiert.",
          ],
        },
        {
          date: "24. Juli 2026",
          title: "Umstellung auf eine neue Feiertagsquelle",
          items: [
            "Feiertage und Schulferien werden jetzt über die OpenHolidays-API bezogen – die Grundlage für die neue Mehrländer-Unterstützung.",
          ],
        },
        {
          date: "22. Juli 2026",
          title: "Regelmäßige Arbeitstage frei einstellbar",
          items: [
            "Du kannst jetzt festlegen, an welchen Wochentagen du regelmäßig arbeitest, z. B. bei Teilzeit nur Montag bis Donnerstag.",
            "Die Urlaubsplanung berücksichtigt deine persönlichen Arbeitstage statt automatisch von Montag bis Freitag auszugehen.",
          ],
        },
        {
          date: "20. Juli 2026",
          title: "Neue Startseite und Überstunden-Rechner",
          items: [
            "Eine neue Startseite lässt dich zwischen Einfach-Modus und Profi-Modus wählen, bevor es losgeht.",
            "Ein neuer Überstunden-Rechner rechnet vorhandene Überstunden direkt in freie Tage um.",
          ],
        },
      ],
    },

    share: {
      button: "Planung teilen",
      ariaLabel: "Aktuelle Planung als Link teilen",
      title: "Aktuelle Planung als Link teilen",
      nativeTitle: (p) => `Urlaubsplanung ${p.year}`,
      nativeText: (p) => `Meine Urlaubsplanung ${p.year} (${p.state}) – im Urlaubsplaner öffnen:`,
      toast: {
        linkCopied: "Link wurde kopiert.",
        copyManually: "Bitte den Link manuell markieren und kopieren.",
        tooLong: "Planung zu umfangreich für einen Link.",
        createFailed: "Link konnte nicht erstellt werden.",
        loadFailed: "Die geteilte Planung konnte nicht geladen werden.",
        loadedPartially: "Geteilte Planung wurde teilweise geladen.",
        loadedFully: "Geteilte Planung wurde geladen.",
      },
      modal: {
        title: "Planung teilen",
        privacyNote: "Der Link enthält deine Planungseinstellungen. Jeder mit diesem Link kann die Planung öffnen.",
        linkLabel: "Teilbarer Link",
        copyButton: "Link kopieren",
        closeButton: "Schließen",
      },
    },

    /* ---- Lokales Speichern mehrerer benannter Pläne (localStorage,
       kein Konto, kein Server) ---- */
    localPlans: {
      header: {
        saveButton: "Plan speichern",
        saveAriaLabel: "Aktuelle Planung als neuen Plan auf diesem Gerät speichern",
        manageButton: "Meine Pläne",
        manageAriaLabel: "Gespeicherte Pläne verwalten",
      },
      modal: {
        title: "Meine Pläne",
        privacyNote: "Deine Pläne werden ausschließlich auf diesem Gerät gespeichert – es wird nichts an einen Server übertragen.",
        newPlanNamePlaceholder: "Name für neuen Plan",
        newPlanButton: "Speichern",
        emptyHint: "Noch keine gespeicherten Pläne.",
        openButton: "Öffnen",
        activeBadge: "Aktiv",
        renameButton: "Umbenennen",
        renameSaveButton: "Speichern",
        renameCancelButton: "Abbrechen",
        duplicateButton: "Duplizieren",
        deleteButton: "Endgültig löschen",
        closeButton: "Schließen",
        updatedAtLabel: (p) => `Zuletzt bearbeitet: ${p.date}`,
      },
      defaultName: "Unbenannter Plan",
      copySuffix: " (Kopie)",
      toast: {
        firstSaveNotice: "Plan wurde auf diesem Gerät gespeichert. Es wird nichts an einen Server übertragen.",
        saveFailed: "Plan konnte nicht gespeichert werden (Speicherplatz voll?).",
        limitReached: (p) => `Maximal ${p.max} gespeicherte Pläne möglich.`,
        loadedFully: "Plan wurde geladen.",
        loadedPartially: "Plan wurde teilweise geladen.",
        loadFailed: "Plan konnte nicht geladen werden.",
        deleted: "Plan wurde gelöscht.",
        storeCorrupted: "Einige gespeicherte Pläne konnten nicht gelesen werden und wurden entfernt.",
      },
    },

    theme: {
      toLight: "\u2600\ufe0f Heller Modus",
      toDark: "\ud83c\udf19 Dark-Mode",
      toggleTitle: "Zwischen Dark-Mode und hellem Modus umschalten",
    },

    /* ---- Schulferien-Präferenz (gemeinsam für Einfach- und Profi-Modus) ---- */
    schoolHolidays: {
      question: "Wie sollen Schulferien bei deiner Planung berücksichtigt werden?",
      preference: {
        prefer: "In den Schulferien planen",
        avoid: "Schulferien möglichst meiden",
        neutral: "Keine Präferenz",
      },
      hint: "Bestimmt, ob automatisch erzeugte Urlaubsvorschläge bevorzugt innerhalb oder außerhalb der Schulferien liegen.",
      notice: {
        // "Keine Daten": beide Quellen waren erreichbar, lieferten aber keine
        // verwertbaren Ferien für Jahr+Bundesland.
        noData: (p) =>
          `Für ${p.state} sind für ${p.year} derzeit keine Schulferiendaten verfügbar. Deine Ferienpräferenz wird bei dieser Planung nicht berücksichtigt.`,
        // "Nicht erreichbar": beide Quellen sind technisch fehlgeschlagen.
        unreachable:
          "Die Schulferiendaten konnten derzeit nicht geladen werden. Deine Ferienpräferenz wird bei dieser Planung nicht berücksichtigt.",
      },
      optionsDisabledTitle: "Ohne verfügbare Schulferiendaten wirkungslos, bis Daten vorliegen.",
    },

    /* ---- Regelmäßige Arbeitstage (gemeinsam für Einfach- und Profi-Modus) ----
       Nur für dauerhaft gleichbleibende Wochenmuster (z. B. Teilzeit Mo–Do,
       Di–Sa) gedacht – KEINE wechselnden Schichten/rollierenden Dienstpläne,
       keine Stunden- oder Teilzeitquoten. */
    workingDays: {
      question: "An welchen Tagen arbeitest du normalerweise?",
      defaultSummary: "Montag bis Freitag",
      changeButton: "Ändern",
      closeButton: "Auswahl schließen",
      // from/to bereits vollständige, übersetzte Wochentagsnamen (siehe weekdaysFullApiOrder)
      summaryRange: (p) => `${p.from} bis ${p.to}`,
      // days: Array bereits vollständiger, übersetzter Wochentagsnamen
      summaryList: (p) => p.days.join(", "),
      resetButton: "Mo–Fr wiederherstellen",
      minOneRequired: "Mindestens ein Arbeitstag muss ausgewählt bleiben.",
      proPanelTitle: "Regelmäßige Arbeitstage",
      proHint: "Nicht ausgewählte Tage behandelt FREILOTSE wie regelmäßig freie Tage.",
    },

    /* ---- Einfach-Modus ---- */
    simple: {
      stepperTitle: "Deine Planung – Schritt für Schritt",
      step1Question: "1 · Wie viele Urlaubstage hast du?",
      step2Question: "2 · Für welches Jahr möchtest du planen?",
      // Neuer Schritt 3 (Land) vor der Region; nachfolgende Schritte deshalb um
      // eins verschoben (vormals 3->4, 4->5, 5->6, 6->7 wurde zu 4->5, 5->6,
      // 6->7, 7->8). Schlüsselnamen bewusst unverändert gelassen, nur die
      // sichtbaren Nummern in den Textwerten wurden angepasst.
      stepCountryQuestion: "3 · In welchem Land lebst du?",
      // region: "Bundesland" oder "Kanton" (siehe regionLabel), abhängig vom Land.
      step3Question: (p) => `4 · In welchem ${p.region} arbeitest du?`,
      stepWorkdaysQuestion: "5 · An welchen Tagen arbeitest du normalerweise?",
      step4Question: "6 · Wie gelten der 24.12. und 31.12. bei dir?",
      step4Options: {
        full: "Ich muss jeweils einen ganzen Urlaubstag nehmen.",
        half: "Sie zählen jeweils als halber Urlaubstag.",
        none: "Ich habe an beiden Tagen frei und benötige keinen Urlaub.",
      },
      step4Hint: "Viele Arbeitgeber behandeln Heiligabend und Silvester unterschiedlich. Wähle einfach die Regel aus, die für dich gilt.",
      step5Question: "7 · Wie sollen Schulferien berücksichtigt werden?",
      step6Question: "8 · Was ist dir wichtig?",
      goal: {
        free: "Möglichst viele freie Tage",
        blocks: "Lange Urlaubsblöcke",
        short: "Viele Kurzurlaube",
        custom: "Eigene Planung (Profi-Modus)",
      },
      calcButton: "Beste Planung berechnen",
      notStartedHint: "Wähle links deine Angaben und klicke auf „Beste Planung berechnen\".",
      resultHeading: "Deine optimale Urlaubsplanung",
      freeDaysLabel: "freie Tage",
      // count/periods sind stets ganzzahlig (keine fmtNum-Formatierung nötig),
      // daher genügt hier ein einfacher === 1-Vergleich für Singular/Plural.
      // Nominativ/Label-Kontext (eigenständige Kennzahl, kein Satzobjekt) -> "1 freier Tag".
      statTotalFree: (p) =>
        `Insgesamt ${p.count} ${p.count === 1 ? "freier Tag" : "freie Tage"} in ${p.periods} ${p.periods === 1 ? "Zeitraum" : "Zeiträumen"}`,
      // usedVac kann durch die 24./31.12.-Regelung halbe Tage enthalten, daher
      // getrennt formatierter Anzeigewert (count) und Rohwert (countRaw) für den
      // Singular-Vergleich (z. B. 1 vs. 1,5 Urlaubstage).
      statVacationDaysUsed: (p) => `Davon ${p.count} Urlaubstag${p.countRaw === 1 ? "" : "e"} eingeplant`,
      statHolidaysUsed: (p) =>
        p.count === 1 ? "1 Feiertag liegt innerhalb deiner Vorschläge" : `${p.count} Feiertage liegen innerhalb deiner Vorschläge`,
      statLongestStreak: (p) => `Längster zusammenhängender Zeitraum: ${p.count} Tag${p.count === 1 ? "" : "e"}`,
      // Akkusativ-Kontext (Satzobjekt von "erhältst") -> "1 freien Tag" (nicht
      // "freier Tag" wie bei statTotalFree/periodFreeDaysLabel, dort Nominativ).
      summarySentence: (p) =>
        `Mit ${p.usedVac} von ${p.totalVac} Urlaubstagen erhältst du insgesamt ${p.totalFree} ${p.totalFree === 1 ? "freien Tag" : "freie Tage"} in ${p.periods} ${p.periods === 1 ? "Zeitraum" : "Zeiträumen"}.`,
      recommendedBlocksHeading: "Empfohlene Urlaubsblöcke",
      noSuggestions: "Keine Vorschläge gefunden – erhöhe die Anzahl deiner Urlaubstage.",
      jumpToMonthTitle: "Zum Monat im Kalender springen",
      periodFreeDaysLabel: (p) => `${p.len} ${p.len === 1 ? "freier Tag" : "freie Tage"} · ${p.vac} Urlaubstag${p.vacRaw === 1 ? "" : "e"}`,
      showCalendar: "Kalender anzeigen",
      hideCalendar: "Kalender ausblenden",
    },

    /* ---- Profi-Modus: Panel „Allgemein“ ---- */
    settings: {
      panelTitle: "Allgemein",
      year: "Jahr",
      country: "Land",
      vacationDays: "Urlaubstage",
      overtimeDaysLabel: "Überstundenabbau (Tage)",
      holidaySource: "Feiertagsquelle:",
      holidaySourceApi: "OpenHolidays API (online)",
      holidaySourceLoading: "wird geladen …",
      holidaySourceLocal: "integrierte Berechnung (API nicht erreichbar)",
      schoolHolidaySourceLabel: "Schulferienquelle:",
      schoolHolidaySourceOpenHolidays: "OpenHolidays API (online)",
      schoolHolidaySourceErsatz: "schulferien-api.de (Ersatzquelle)",
      schoolHolidaySourceNone: "keine Daten verfügbar",
      schoolHolidaySourceUnreachable: "derzeit nicht erreichbar",
      otCalc: {
        toggleShow: "Überstunden aus Stunden berechnen",
        toggleHide: "Überstunden-Rechner ausblenden",
        hoursLabel: "Überstunden (Stunden)",
        hoursPerDayLabel: "Stunden pro Arbeitstag",
        result: (p) => `= ${p.value} ${p.valueRaw === 1 ? "Überstundentag" : "Überstundentage"}`,
        resultInvalid: "Bitte gültige Werte eingeben.",
        apply: "Überstundentage übernehmen",
        applyAriaLabel: "Berechnete Überstundentage in das Feld „Überstundenabbau (Tage)“ übernehmen",
      },
    },

    /* ---- Profi-Modus: Panel „Arbeitsregelung“ ---- */
    workRules: {
      panelTitle: "Arbeitsregelung",
      xmasLabel: "24.12. und 31.12. zählen als",
      xmasOptionFull: "voller Urlaubstag (100 %)",
      xmasOptionHalf: "halber Urlaubstag (50 %)",
      xmasOptionNone: "frei – kein Urlaubstag (0 %)",
    },

    /* ---- Profi-Modus: Panel „Automatische Planung“ ---- */
    auto: {
      panelTitle: "Automatische Planung",
      budgetLabel: "Budget der Automatik",
      toMinimum: "auf Minimum",
      useVacationDays: "Urlaubstage nutzen",
      useOvertimeDays: "Überstd.-Tage nutzen",
      fromMonth: "Ab Monat",
      spendFirst: "Zuerst aufbrauchen",
      spendFirstVac: "Urlaubstage",
      spendFirstOt: "Überstunden",
      minimumHintPrefix: (p) => `Start: Minimum von ${p.days} Tagen – nur 1-Tages-Brücken.`,
      minimumHintDetail:
        "Mit dem Minimum kauft die Automatik ausschließlich isolierte 1-Tages-Lücken – 1 eingesetzter Tag erzeugt 4 freie Tage am Stück. Mehr Budget schaltet schrittweise 2-, 3- und 4-Tages-Lücken frei. „Ab Monat“ begrenzt nur die Automatik; Wunschblöcke und manuelle Klicks sind davon unabhängig und nutzen das volle Budget. Die Regler sind auf deine Angaben begrenzt.",
    },

    /* ---- Profi-Modus: Panel „Wunschblöcke“ ---- */
    blocks: {
      panelTitle: "Wunschblöcke",
      prioritizedHint: "werden priorisiert",
      addButton: "+ Block",
      emptyHint: "Noch keine Blöcke – lege fest, wie viele Tage am Stück du frei haben willst.",
      freeDaysLabel: "Tage frei",
      monthLabel: "Monat",
      monthAny: "egal",
      overtimeDaysLabel: "Überstd.-Tage",
      placed: (p) => `${p.start} – ${p.end} · kostet ${p.cost} Tage`,
      notPlaced: "Keine Platzierung möglich (Budget oder Monat prüfen)",
      removeButton: "Entfernen",
    },

    /* ---- Kennzahlen-Kacheln ---- */
    metrics: {
      leverage: "freie Tage pro eingesetztem Tag",
      longestStreak: "Längster zusammenhängender Zeitraum (Tage)",
      // Bewusst ohne "Mo-Fr"/"Werktage"/"Wochenende": zählt ausschließlich nach
      // persönlichem Arbeitsstatus (day.isWorkingDay), unabhängig vom
      // kalendarischen Wochentag - gilt unverändert für individuelle
      // Arbeitswochen (siehe workingDays).
      holidaysWorkdaysOnly: "Feiertage an deinen Arbeitstagen in deinen Zeiträumen",
      remaining: "übrig: Urlaub / Überstunden",
    },

    /* ---- Freie Zeiträume (Profi-Modus) ---- */
    results: {
      periodsHeading: "Deine freien Zeiträume",
      periodsEmptyHint: "Gib Urlaubstage ein, um Vorschläge zu sehen.",
      jumpToMonthTitle: "Zum Monat im Kalender springen",
      badgeBlock: "Wunschblock",
      badgeManual: "manuell",
      badgeAuto: "automatisch",
      periodSummary: (p) => `${p.len} Tage frei · ${p.vac} Urlaub${p.otRaw > 0 ? ` · ${p.ot} Überstunden` : ""}`,
      icsButton: "ICS/iCal",
      icsTitle: "Als .ics-Datei herunterladen (Apple Kalender, Outlook, iCal)",
      googleButton: "Google",
      googleTitle: "In Google Kalender öffnen (vorausgefüllter Termin)",
      exportAllButton: "Gesamten Plan exportieren",
      exportAllTitle: "Alle freien Zeiträume als eine .ics-Datei herunterladen (Apple Kalender, Outlook, iCal; in Google Kalender über \"Kalender importieren\" einbindbar)",
      destinationLabel: "Reiseziel (optional)",
      destinationPlaceholder: "z. B. Paris, Mallorca …",
      destinationPeriodPlaceholder: (p) =>
        p.fallback ? `Abweichendes Ziel (Standard: ${p.fallback})` : "Abweichendes Reiseziel für diesen Zeitraum",
      destinationPeriodAriaLabel: "Reiseziel für diesen Zeitraum (überschreibt das Feld oben)",
      destinationSuggestions: [
        // Deutschland – große Städte
        "Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main", "Stuttgart",
        "Düsseldorf", "Leipzig", "Dresden", "Hannover", "Nürnberg", "Bremen",
        "Bonn", "Mannheim", "Augsburg", "Freiburg im Breisgau", "Rostock", "Kiel",
        "Heidelberg", "Potsdam",
        // Deutschland – beliebte Reiseziele
        "Trier", "Regensburg", "Würzburg", "Passau", "Konstanz", "Lindau",
        "Garmisch-Partenkirchen", "Sylt", "Rügen", "Usedom", "Norderney",
        "Berchtesgaden",
        // Österreich
        "Wien", "Salzburg", "Graz", "Innsbruck", "Linz", "Kitzbühel",
        "Zell am See", "Villach",
        // Schweiz
        "Zürich", "Genf", "Basel", "Bern", "Luzern", "Interlaken", "Zermatt",
        "St. Moritz",
        // Europa – Städte
        "Paris", "London", "Rom", "Mailand", "Venedig", "Florenz", "Neapel",
        "Turin", "Barcelona", "Madrid", "Sevilla", "Valencia", "Lissabon",
        "Porto", "Amsterdam", "Brüssel", "Kopenhagen", "Stockholm", "Oslo",
        "Helsinki", "Reykjavik", "Dublin", "Edinburgh", "Prag", "Budapest",
        "Warschau", "Krakau", "Athen", "Istanbul", "Ljubljana",
        // Europa – Inseln und Ferienziele
        "Mallorca", "Ibiza", "Menorca", "Gran Canaria", "Teneriffa",
        "Fuerteventura", "Lanzarote", "Kreta", "Rhodos", "Korfu", "Santorin",
        "Mykonos", "Sardinien", "Sizilien", "Malta", "Zypern", "Madeira",
        "Algarve", "Côte d'Azur", "Toskana",
        // Internationale Fernziele
        "New York", "Los Angeles", "San Francisco", "Las Vegas", "Miami",
        "Chicago", "Toronto", "Vancouver", "Mexiko-Stadt", "Cancún",
        "Rio de Janeiro", "Buenos Aires", "Kapstadt", "Marrakesch", "Kairo",
        "Dubai", "Abu Dhabi", "Tel Aviv", "Bangkok", "Phuket", "Bali",
        "Singapur", "Kuala Lumpur", "Hongkong", "Tokio", "Kyoto", "Seoul",
        "Sydney", "Melbourne", "Malediven",
      ],
      flightsButton: "Flüge",
      flightsTitle: "Flugsuche für diesen Zeitraum öffnen (Google Flights). Ohne Reiseziel oben öffnet sich nur die Startseite ohne Vorbefüllung.",
      bookingButton: "Unterkunft",
      bookingTitle: "Unterkunftssuche für diesen Zeitraum öffnen (Booking.com). Ohne Reiseziel oben öffnet sich nur die Startseite ohne Vorbefüllung.",
      reason: {
        xmasBoth: "Die Weihnachtsfeiertage sowie Heiligabend und Silvester werden verbunden.",
        xmasEveOnly: "Die Weihnachtsfeiertage und Heiligabend werden verbunden.",
        xmasNyeOnly: "Die Weihnachtsfeiertage und Silvester werden verbunden.",
        namedTwoWeekends: (p) => `${p.subject} ${p.plural ? "werden" : "wird"} mit zwei Wochenenden verbunden.`,
        namedExtends: (p) => `${p.subject} verlängert${p.plural ? "n" : ""} den freien Zeitraum.`,
        vacTwoWeekends: "Urlaubstage verbinden zwei Wochenenden zu einem längeren freien Zeitraum.",
        vacOneWeekend: "Urlaubstage verlängern ein Wochenende zu einem längeren freien Zeitraum.",
        vacOnly: "Urlaubstage ergeben einen längeren freien Zeitraum.",
      },
      warning: {
        schoolHolidayOverlap: (p) =>
          `Überschneidet sich an ${p.count} ${p.count === 1 ? "Tag" : "Tagen"} mit den Schulferien. Deine Auswahl wird als Präferenz und nicht als Ausschluss behandelt.`,
      },
      note: {
        schoolHolidayMatch: "Liegt wie gewünscht teilweise in den Schulferien.",
      },
      andSeparator: " und ",
    },

    /* ---- Manuell planen + Legende ---- */
    manual: {
      clickSetsLabel: "Klick im Kalender setzt",
      vacationDay: "Urlaubstag",
      overtimeReduction: "Überstundenabbau",
      resetButton: (p) => `Manuelle Änderungen zurücksetzen (${p.count})`,
      failedOne: "1 manuell gesetzter Tag konnte mangels Budget nicht übernommen werden.",
      failedMany: (p) => `${p.count} manuell gesetzte Tage konnten mangels Budget nicht übernommen werden.`,
      helpText: "Klick setzt Tage, Ziehen wählt mehrere aus, Klick auf geplante Tage öffnet Entfernen/Tauschen.",
      helpDetail:
        "Klick auf einen leeren Arbeitstag setzt den oben gewählten Tagestyp – mit der Maus kannst du gedrückt halten und ziehen, um mehrere Tage auf einmal auszuwählen, auch über Wochen- und Monatsgrenzen hinweg; Wochenenden, Feiertage und bereits geplante Tage werden übersprungen. Auf Touch-Geräten setzt du Tage einzeln per Tippen; Wischen scrollt wie gewohnt. Entfernte Tage bleiben Arbeitstage und werden von der Automatik nicht erneut belegt.",
    },

    legend: {
      vacation: "Urlaub",
      overtime: "Überstundenabbau",
      holiday: "Feiertag",
      xmasFree: "24./31.12. frei",
      xmasHalf: "24./31.12. halber Tag",
      weekend: "Wochenende",
      manualSet: "manuell gesetzt",
      schoolHolidays: "Schulferien",
      regularlyOff: "Regelmäßig frei",
      freePeriod: "Freier Zeitraum",
    },

    footerHint: {
      text: "Wunschblöcke zuerst, dann Brückentage streng nach Rendite.",
      // Länderspezifischer Hinweis (vorangestellt) + länderunabhängige
      // Erklärung der Optimierung. Nur der zum gewählten Land (p.country)
      // passende Hinweis wird angezeigt, damit z. B. beim Land Schweiz nicht
      // die deutschen Bundesland-Sonderfälle erscheinen und umgekehrt.
      // Österreich hat aktuell keinen Eintrag, da dort alle Feiertage
      // bundesweit gelten (keine Sonderfälle abzubilden).
      detail: (p) => {
        const regionalCaveats = {
          DE: "Mariä Himmelfahrt gilt in Bayern nur in Gemeinden mit überwiegend katholischer Bevölkerung; Fronleichnam gilt in Sachsen und Thüringen nur in einzelnen Regionen und ist hier nicht berücksichtigt. ",
          CH: "Es werden nur kantonsweite Feiertage berücksichtigt; Feiertage, die nur in einzelnen Bezirken oder Gemeinden eines Kantons gelten (z. B. Teile des Kantons Aargau), sowie rein lokale Bräuche wie Sechseläuten oder Knabenschiessen (Stadt Zürich) werden nicht berücksichtigt. ",
        };
        const intro = "Die Optimierung setzt Wunschblöcke zuerst; der 24.12. und der 31.12. werden bei 100%- oder 50%-Regelung immer fest eingeplant, damit sie die Feiertagsserie nicht unterbrechen. Die automatische Verteilung kauft mit dem Minimalbudget nur isolierte 1-Tages-Brücken (1 Tag → 4 freie Tage); mehr Budget schaltet 2-, 3- und 4-Tages-Lücken frei – verteilt über das Jahr, höchstens eine Lücke je Monat pro Runde. Reine Urlaubswochen ohne Feiertag werden nie automatisch verplant; nicht eingesetzte Tage bleiben als Rest übrig.";
        return `${regionalCaveats[p.country] || ""}${intro}`;
      },
    },

    /* ---- Kalender ---- */
    calendar: {
      weekdaysMonFirst: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      weekNumberAbbr: "KW",
      summary: {
        publicHolidays: "Feiertage:",
        schoolHolidays: "Schulferien:",
        oneMore: " + 1 weiterer",
        nMore: (p) => ` + ${p.count} weitere`,
        rangeUntil: (p) => `bis ${p.date}`,
        rangeFrom: (p) => `ab ${p.date}`,
        rangeBetween: (p) => `${p.from}–${p.to}`,
      },
      vacationTooltip: (p) => `${p.name} in ${p.state} · ${p.start} bis ${p.end}`,
      // Nur relevant, wenn ein tatsächliches Kalenderwochenende laut
      // workingDays trotzdem ein persönlicher regulärer Arbeitstag ist (z. B.
      // Dienstag–Samstag) – macht das im Tooltip explizit, weil die Zelle
      // selbst weiterhin das gewohnte Wochenend-Styling behält.
      personalWorkday: "regulärer Arbeitstag",
    },

    /* ---- Dialog: geplanten Tag entfernen/tauschen ---- */
    dayDialog: {
      vacationDayType: "Urlaubstag",
      currentLabel: (p) => `Aktuell: ${p.type}${p.half ? " (halber Tag)" : ""}`,
      swapButton: (p) => `In ${p.target} tauschen`,
      removeButton: "Tag entfernen (wieder Arbeitstag)",
      cancelButton: "Abbrechen",
    },

    /* ---- Export (ICS / Google Kalender) ---- */
    exportCal: {
      eventTitle: "Urlaub",
      icsDescription: (p) =>
        `${p.len} Tage frei – ${p.vac} Urlaubstage${p.otRaw > 0 ? `, ${p.ot} Überstundenabbau` : ""} (Urlaubsplaner)`,
      allEventsTitle: (p) => `Urlaubsplan ${p.year}`,
    },

    /* ---- Jahreswechsel-Erweiterung (nur Profi-Modus) ---- */
    yearTransition: {
      certainLabel: (p) => `${p.len} Tage sicher frei`,
      neededLabel: (p) =>
        `Benötigt ${p.vac} Urlaubstag${p.vacRaw === 1 ? "" : "e"} aus deinem Kontingent ${p.year}`,
      hypotheticalBadge: (p) => `Möglichkeit mit Urlaubstagen aus ${p.year}`,
      hypotheticalText: (p) =>
        `Mit ${p.extra} zusätzlichen Urlaubstag${p.extraRaw === 1 ? "" : "en"} aus ${p.year} wären ${p.total} Tage bis ${p.end} möglich.`,
    },

    /* ---- Kollegen-/Partner-Überschneidungs-Check ("Gemeinsam frei") ----
       Rein clientseitig: fremde Share-Links werden nur für die aktuelle
       Sitzung ausgewertet, nicht gespeichert. ---- */
    sharedFree: {
      heading: "Gemeinsam frei",
      linkPlaceholder: "Share-Link einfügen",
      addButton: "Hinzufügen",
      removeButton: "Entfernen",
      personLabel: (p) => `Person ${p.index}`,
      linkInvalid: "Dieser Link ist ungültig oder beschädigt.",
      differentYearWarning: (p) =>
        `Diese Planung bezieht sich auf ${p.year} – keine Überschneidung mit deinem Jahr ${p.ownYear} möglich.`,
      emptyNoPeople: "Füge den Share-Link einer anderen Person hinzu, um gemeinsame freie Tage zu finden.",
      emptyNoOverlap: "Mit den hinzugefügten Personen gibt es aktuell keine gemeinsamen freien Tage.",
      periodHeading: (p) => `${p.len} Tage gemeinsam frei`,
      myCost: (p) =>
        `Du: ${p.vac} Urlaubstag${p.vacRaw === 1 ? "" : "e"}${p.otRaw > 0 ? ` · ${p.ot} Überstunden` : ""}`,
      personCost: (p) =>
        `${p.label}: ${p.vac} Urlaubstag${p.vacRaw === 1 ? "" : "e"}${p.otRaw > 0 ? ` · ${p.ot} Überstunden` : ""}`,
    },
  };

  /* ------------------------------------------------------------------ */
  /* Übersetzungsfunktion                                                */
  /* ------------------------------------------------------------------ */

  // Strukturvorlage für spätere Sprachen. Aktuell nur "de" aktiv/registriert;
  // eine locales/en.js (falls später ergänzt) müsste sich hier zusätzlich
  // eintragen, z. B. über window.I18N.registerLocale("en", EN).
  const LOCALES = { de: DE };
  let currentLocale = "de"; // einzige aktuell aktive Sprache

  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  }

  // Ersetzt {platzhalter} in einem String durch params[platzhalter].
  function interpolate(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (match, key) => (params[key] !== undefined ? params[key] : match));
  }

  // t(key, params): zentrale Übersetzungsfunktion.
  // - key:    verschachtelter Schlüssel, z. B. "results.reason.vacOnly"
  // - params: optionale Werte für Platzhalter bzw. Argumente für
  //           Textfunktionen (Singular/Plural, zusammengesetzte Sätze).
  // Fehlt ein Schlüssel in der aktiven Sprache, wird auf Deutsch
  // zurückgefallen; fehlt er auch dort, wird das im Dev-Fall deutlich
  // sichtbar gemacht (Konsole + "⚠ key" statt eines stillen Absturzes).
  function t(key, params) {
    const dict = LOCALES[currentLocale] || LOCALES.de;
    let val = getPath(dict, key);
    if (val === undefined && currentLocale !== "de") val = getPath(LOCALES.de, key);
    if (val === undefined) {
      console.warn(`[i18n] Fehlender Übersetzungsschlüssel: "${key}"`);
      return `⚠ ${key}`;
    }
    if (typeof val === "function") return val(params || {});
    if (typeof val === "string") return interpolate(val, params);
    return val; // Arrays/Objekte (z. B. Monatsliste, Bundesländer) unverändert
  }

  function setLocale(loc) {
    if (LOCALES[loc]) currentLocale = loc;
    else console.warn(`[i18n] Unbekannte Sprache "${loc}" – bleibe bei "${currentLocale}".`);
  }
  function getLocale() {
    return currentLocale;
  }
  // Für eine spätere en.js: registriert eine weitere Sprache, ohne dass
  // app.jsx oder diese Datei sonst angepasst werden müssen.
  function registerLocale(loc, dict) {
    LOCALES[loc] = dict;
  }

  window.I18N = { t, setLocale, getLocale, registerLocale, LOCALES };
})();
