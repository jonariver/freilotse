/* ------------------------------------------------------------------ */
/* locales/en.js – English translation of the vacation planner         */
/* ------------------------------------------------------------------ */
/* Loaded AFTER locales/de.js and BEFORE app.jsx (see index.html).      */
/* Registers itself as an additional locale via window.I18N.            */
/* Mirrors locales/de.js exactly: same keys, same nesting, and for      */
/* every dynamic function the identical parameter shape (app.jsx calls  */
/* t(key, params) generically and passes the same params through to     */
/* whichever locale is active).                                         */
/* Not translated (language-independent per CLAUDE.md): state/canton    */
/* codes (object keys), originByState, tripCityId, skyscannerCode, the  */
/* "code" field in originSuggestions.                                   */
/* ------------------------------------------------------------------ */

(function () {
  "use strict";

  const EN = {
    countries: {
      DE: "Germany", AT: "Austria", CH: "Switzerland",
    },

    regionLabel: {
      DE: "state", AT: "state", CH: "canton",
    },

    defaultRegion: {
      DE: "BY", AT: "WI", CH: "ZH",
    },

    states: {
      DE: {
        BW: "Baden-Württemberg", BY: "Bavaria", BE: "Berlin", BB: "Brandenburg",
        HB: "Bremen", HH: "Hamburg", HE: "Hesse", MV: "Mecklenburg-Western Pomerania",
        NI: "Lower Saxony", NW: "North Rhine-Westphalia", RP: "Rhineland-Palatinate",
        SL: "Saarland", SN: "Saxony", ST: "Saxony-Anhalt",
        SH: "Schleswig-Holstein", TH: "Thuringia",
      },
      AT: {
        BL: "Burgenland", KÄ: "Carinthia", NÖ: "Lower Austria", OÖ: "Upper Austria",
        SB: "Salzburg", SM: "Styria", TI: "Tyrol", VA: "Vorarlberg", WI: "Vienna",
      },
      CH: {
        AG: "Aargau", AI: "Appenzell Innerrhoden", AR: "Appenzell Ausserrhoden",
        BE: "Bern", BL: "Basel-Landschaft", BS: "Basel-Stadt", FR: "Fribourg",
        GE: "Geneva", GL: "Glarus", GR: "Graubünden", JU: "Jura", LU: "Lucerne",
        NE: "Neuchâtel", NW: "Nidwalden", OW: "Obwalden", SG: "St. Gallen",
        SH: "Schaffhausen", SO: "Solothurn", SZ: "Schwyz", TG: "Thurgau",
        TI: "Ticino", UR: "Uri", VD: "Vaud", VS: "Valais", ZG: "Zug", ZH: "Zurich",
      },
    },

    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],

    weekdaysApiOrder: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdaysFullApiOrder: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    holidays: {
      newYear: "New Year's Day",
      epiphany: "Epiphany",
      womensDay: "International Women's Day",
      goodFriday: "Good Friday",
      easterSunday: "Easter Sunday",
      easterMonday: "Easter Monday",
      laborDay: "Labour Day",
      ascensionDay: "Ascension Day",
      pentecostSunday: "Whit Sunday",
      pentecostMonday: "Whit Monday",
      corpusChristi: "Corpus Christi",
      assumptionDay: "Assumption Day",
      childrensDay: "International Children's Day",
      germanUnityDay: "German Unity Day",
      reformationDay: "Reformation Day",
      allSaintsDay: "All Saints' Day",
      christmasDay1: "Christmas Day",
      christmasDay2: "Boxing Day",
      dayOfRepentance: "Repentance and Prayer Day",

      at: {
        staatsfeiertag: "State Holiday",
        nationalfeiertag: "National Day",
        mariaEmpfaengnis: "Immaculate Conception",
        christtag: "Christmas Day",
        stefanitag: "St. Stephen's Day",
      },

      ch: {
        neujahrstag: "New Year's Day",
        berchtoldstag: "St. Berchtold's Day",
        dreikoenigstag: "Epiphany",
        jahrestagRepublik: "Anniversary of the Restoration of the Republic",
        josephstag: "St. Joseph's Day",
        tagDerArbeit: "Labour Day",
        auffahrt: "Ascension Day",
        festDerUnabhaengigkeit: "Independence Day",
        peterUndPaul: "Saints Peter and Paul",
        bundesfeiertag: "Swiss National Day",
        genferBettag: "Genevan Fast",
        bettagsmontag: "Fast Monday",
        eidgBettag: "Federal Day of Thanksgiving, Repentance and Prayer",
        mariaEmpfaengnis: "Immaculate Conception",
        stephanstag: "St. Stephen's Day",
        weihnachten: "Christmas Day",
        wiederherstellungRepublik: "Restoration of the Republic",
      },
    },

    special: {
      christmasEve: "Christmas Eve",
      newYearsEve: "New Year's Eve",
    },

    holidayCaveats: {
      assumptionDayInline: "(not statewide)",
      assumptionDayNotice:
        "Note: Assumption Day (15 August) is by law a public holiday in Bavaria only in municipalities with a predominantly Catholic population, not statewide. This plan nevertheless treats it uniformly as a public holiday – this may not apply in municipalities that are not predominantly Catholic.",
    },

    fallback: {
      schoolHolidays: "School holidays",
    },

    dayType: {
      vacation: "Vacation",
      overtime: "Overtime reduction",
    },

    common: {
      moreInfo: "Learn more",
      documentTitle: "FREILOTSE – Vacation Planner for Bridge Days & Public Holidays",
      metaDescription: "FREILOTSE automatically plans your bridge days: public holidays, school holidays and vacation days tailored to your state or canton – free and without registration.",
      loadingSharedPlan: "Loading shared plan …",
      switchToEnglish: "Switch to English",
      switchToGerman: "Switch to German",
      legalNavAriaLabel: "Legal and support",
      resultsDisclaimer: "All information is provided without guarantee – the rules of your employer and your state apply.",
      resultsDisclaimerLink: "More in the terms of use",
    },

    header: {
      tagline: (p) => `Public holidays · Bridge days · ${p.state}`,
      title: (p) => `Vacation Planner ${p.year}`,
      freeDaysSuffix: (p) => {
        const daysWord = p.total === 1 ? "free day" : "free days";
        const periodsWord = p.periods === 1 ? "period" : "periods";
        const vacWord = p.usedVacRaw === 1 ? "vacation day" : "vacation days";
        const otPart = p.usedOtRaw > 0
          ? ` and ${p.usedOt} ${p.usedOtRaw === 1 ? "overtime day" : "overtime days"}`
          : "";
        return `${daysWord} in ${p.periods} ${periodsWord} with ${p.usedVac} ${vacWord}${otPart}`;
      },
    },

    nav: {
      simpleMode: "Simple",
      proMode: "Pro",
      backToStart: "← Back to start",
      backToStartAriaLabel: "Back to start page",
    },

    landing: {
      hero: {
        heading: "Get more out of your vacation days",
        description: "Calculate your bridge days for 2026 and 2027 automatically: FREILOTSE combines public holidays, bridge days and school holidays tailored to your state or canton, and shows you how to get the most consecutive days off with as few vacation days as possible.",
        example: "4 vacation days can turn into up to 10 days off.",
      },
      modes: {
        heading: "Choose how to start",
        simple: {
          badge: "Recommended",
          title: "Plan simply",
          text: "Answer a few short questions and get matching vacation suggestions automatically.",
          benefits: [
            "Guided planning",
            "Fast results",
            "Prefer or avoid school holidays",
            "Adjustable in the calendar afterwards",
          ],
          button: "Start simple",
        },
        pro: {
          title: "Plan individually",
          text: "Set your own available budgets, periods and rules.",
          benefits: [
            "Set or remove vacation days manually",
            "Include overtime days in your planning",
            "Define desired blocks and blocked periods",
            "Determine the order for vacation and overtime",
          ],
          button: "Open Pro mode",
        },
      },
      video: {
        heading: "FREILOTSE in 30 seconds",
        description: "See how FREILOTSE cleverly combines your vacation days with public holidays and bridge days.",
        playButtonLabel: "Play video",
        thumbnailAlt: "Thumbnail of the explainer video",
        mobileIframeTitle: "FREILOTSE explainer video (portrait)",
        desktopIframeTitle: "FREILOTSE explainer video (landscape)",
      },
      features: {
        heading: "Plan automatically, adjust flexibly",
        items: [
          { icon: "🎯", title: "Matching suggestions", text: "Public holidays and bridge days are used as efficiently as possible." },
          { icon: "🖊️", title: "Edit the calendar yourself", text: "Set vacation days directly in the calendar or remove suggested days again." },
          { icon: "🔀", title: "Combine vacation and overtime", text: "In Pro mode, use vacation days and available overtime days together." },
        ],
      },
      steps: {
        heading: "How it works",
        items: [
          { title: "Enter your details", text: "Set your country, region and vacation days." },
          { title: "Choose your preferences", text: "Decide your goal and how to handle school holidays." },
          { title: "Adjust your plan", text: "Review suggestions and change them directly in the calendar." },
        ],
      },
      trust: {
        items: [
          "Public holidays matching your state or canton",
          "School holidays are taken into account",
          "No registration required",
          "Plan shareable as a link",
        ],
      },
      aboutTeaser: {
        text: "FREILOTSE is an independent project by Jonathan.",
        linkText: "More about the project",
      },
    },

    legal: {
      impressum: {
        documentTitle: "Legal Notice – FREILOTSE",
        metaDescription: "Legal notice for FREILOTSE – provider identification and contact details.",
      },
      datenschutz: {
        documentTitle: "Privacy Policy – FREILOTSE",
        metaDescription: "Privacy policy for FREILOTSE: information on the processing of personal data, including hosting, calendar data and country pre-selection.",
      },
      nutzungsbedingungen: {
        documentTitle: "Terms of Use – FREILOTSE",
        metaDescription: "Terms of use for FREILOTSE: liability limitation, availability, and the boundary to legal advice for this free vacation planner.",
      },
      backToPlanner: "Back to planner",
      germanOnlyNotice: "This page is currently only available in German.",
      impressumLink: "Legal Notice",
      datenschutzLink: "Privacy Policy",
      nutzungsbedingungenLink: "Terms of Use",
    },

    about: {
      documentTitle: "About FREILOTSE – Vacation Planner",
      metaDescription: "Get to know the person behind FREILOTSE and learn how you can voluntarily support this independent project.",
      footerLink: "About FREILOTSE",
      backToPlanner: "Back to planner",
      pageTitle: "About FREILOTSE",
      portraitAlt: "Jonathan, developer of FREILOTSE",
      intro: "Hi, I'm Jonathan.",
      body1: "Professionally, I work as a business informatics specialist in IT. FREILOTSE started as a personal project because I wanted to try out how far I could take my own idea with the help of modern AI tools.",
      body2: "I didn't just want to list public holidays, but make concrete suggestions: how can vacation days be used to create the longest possible stretches of time off? It was also important to me that the planner works for people who don't work a classic Monday-to-Friday schedule.",
      linkedin: {
        linkText: "View LinkedIn profile ↗",
        ariaLabel: "View Jonathan's LinkedIn profile (opens in a new tab)",
      },
      values: {
        heading: "What matters to me with FREILOTSE",
        items: [
          "Free to use",
          "No registration required",
          "Data-sparing and as local processing as possible",
          "Understandable planning instead of unnecessarily complicated operation",
          "Ongoing development based on practical needs and feedback",
        ],
      },
      support: {
        heading: "Support voluntarily",
        text: "I develop and run FREILOTSE myself. Ongoing development as well as the domain and hosting cost time and money. If FREILOTSE helped with your planning, you can voluntarily support the project via PayPal. This is of course not required – FREILOTSE remains fully usable without any support.",
        button: "💚 Support FREILOTSE voluntarily",
        buttonAriaLabel: "Voluntarily support FREILOTSE via PayPal (opens in a new tab)",
      },
      contact: {
        prefix: "Got feedback or an idea for FREILOTSE? Feel free to write to me at ",
        suffix: ".",
      },
    },

    support: {
      footerLinkText: "Support FREILOTSE",
      floatingAriaLabel: "Support FREILOTSE via PayPal",
      floatingLabelText: "Support FREILOTSE via PayPal",
      floatingHintText: "Did FREILOTSE help you? Support the project 💚",
    },

    guide: {
      documentTitle: "Guide – FREILOTSE",
      metaDescription: "How FREILOTSE works: Simple mode, Pro mode and all features at a glance.",
      footerLink: "Guide",
      backToPlanner: "Back to planner",
      pageTitle: "Guide",
      intro: "An overview of FREILOTSE's key features – from a quick start to the Pro-mode functions.",
      sections: [
        {
          heading: "Simple and Pro mode",
          body: [
            "In Simple mode, FREILOTSE guides you to a finished suggestion with just a few short questions.",
            "Pro mode shows all settings at once and additionally lets you adjust days directly in the calendar by hand. You can switch between both modes at any time without losing anything.",
          ],
        },
        {
          heading: "Automatic planning",
          body: [
            "FREILOTSE places vacation days and overtime reduction wherever they create the most additional days off, e.g. on bridge days around public holidays.",
            "Use \"Automatic budget\" to set how many days are used for this, and \"From month\" to set when in the year the automatic planning starts.",
          ],
        },
        {
          heading: "Manual planning (Pro mode)",
          body: [
            "A click in the calendar sets a vacation day or overtime reduction, depending on your selection. Clicking an already planned day lets you remove or swap it.",
          ],
        },
        {
          heading: "Desired blocks",
          body: [
            "Set fixed periods, e.g. \"9 days in a row in July\" – FREILOTSE plans these with priority ahead of the rest of the automatic planning.",
          ],
        },
        {
          heading: "Regular working days",
          body: [
            "If you don't work Monday to Friday, e.g. with part-time hours, set this under \"Working schedule\". The whole plan then takes only your actual working days into account.",
          ],
        },
        {
          heading: "Sharing a plan",
          body: [
            "The \"Share plan\" button creates a link that contains only your inputs – no public holidays, school holidays or other personal data. Anyone with this link can open the plan.",
          ],
        },
        {
          heading: "My plans",
          body: [
            "Saves your plan directly on this device – no account, no server. Multiple named plans are possible, e.g. for different years or occasions.",
          ],
        },
        {
          heading: "Shared time off",
          body: [
            "Add another person's share link to find days off you both share – handy for couples, family or colleagues. This also stays entirely on your device; the link is never stored anywhere.",
          ],
        },
        {
          heading: "Year-end extension (Pro mode)",
          body: [
            "If your last free period runs until New Year's Eve, FREILOTSE automatically shows the free days right after it in the new year (public holidays, weekends).",
            "You'll also see, without any obligation, how many more vacation days from the new year would allow an even longer break – this is never planned in automatically or deducted from any budget.",
          ],
        },
        {
          heading: "Exporting your calendar",
          body: [
            "Every free period can be downloaded individually as an .ics file or opened directly in Google Calendar. \"Export entire plan\" bundles all periods into a single file.",
          ],
        },
      ],
    },

    puzzle: {
      documentTitle: "Daily Bridge Day Puzzle – FREILOTSE",
      metaDescription: "A daily puzzle: place your vacation days correctly and find the longest stretch of days off.",
      footerLink: "Puzzle",
      backToPlanner: "Back to planner",
      pageTitle: "Daily Bridge Day Puzzle",
      intro: {
        puzzleNumberLabel: (p) => `Puzzle #${p.number}`,
        stateAndMonth: (p) => `Today: ${p.state}, ${p.month} ${p.year}`,
        rulesHint: (p) => `Place up to ${p.budget} vacation days and find the longest consecutive stretch of days off.`,
        rulesDetail: "Public holidays and weekends are already free. Click working days to set them as vacation – you only have one attempt per day, after which FREILOTSE shows the best possible solution compared to your result.",
      },
      calendar: {
        legendFree: "already free",
        legendSelected: "your vacation",
        legendWorking: "working day",
        budgetCounter: (p) => `${p.used} of ${p.budget} selected`,
      },
      actions: {
        evaluateButton: "Evaluate",
        resetButton: "Reset",
        shareButton: "Share result",
        retryButton: "Try again",
        ctaButton: "Start your own free vacation planning now",
      },
      result: {
        scoreLine: (p) => `${p.score} of ${p.optimal} possible days in a row`,
        perfectMessage: "Perfect match – that was the best possible solution! 🎯",
        belowOptimalMessage: (p) => `With ${p.diff} more ${p.diff === 1 ? "day" : "days"}, the best possible solution would have been within reach.`,
        emojiGridLabel: "Your result",
        officialBadge: "Scored",
        practiceBadge: "Practice attempt – not scored",
        officialReference: (p) => `Your scored result today: ${p.score}/${p.optimal}`,
      },
      share: {
        nativeTitle: (p) => `FREILOTSE Bridge Day Puzzle #${p.puzzleNumber}`,
        nativeText: (p) => `FREILOTSE Bridge Day Puzzle #${p.puzzleNumber}\n${p.score}/${p.optimal} days in a row 🎯\n\n${p.emojiGrid}\n\n${p.url}`,
      },
      locked: {
        title: "Today's puzzle – already played",
        description: "You've already played today. A new puzzle awaits tomorrow.",
      },
      countdown: {
        label: (p) => `Next puzzle in ${p.time}`,
      },
      stats: {
        title: "Your stats",
        currentStreak: "Current streak",
        maxStreak: "Best streak",
        gamesPlayed: "Played",
        unavailableNotice: "Stats unavailable (local storage blocked).",
      },
    },

    changelog: {
      documentTitle: "News – FREILOTSE",
      metaDescription: "All updates and news from FREILOTSE at a glance.",
      footerLink: "News",
      backToPlanner: "Back to planner",
      pageTitle: "News",
      intro: "Here you'll find the latest updates and news from FREILOTSE – newest first.",
      entries: [
        {
          date: "23 August 2026",
          title: "English now works correctly when opening info pages directly",
          items: [
            "Opening a page like /raetsel or /anleitung directly (instead of navigating from the homepage) now correctly shows English if that was set previously – this didn't reliably work before.",
          ],
        },
        {
          date: "23 August 2026",
          title: "New terms of use and a notice on the results",
          items: [
            "A new \"Terms of Use\" page (linked in the footer) explains the liability limitation, availability, and that FREILOTSE does not replace legal or employment law advice.",
            "Your planning result now shows a short notice: all information is provided without guarantee – the rules of your employer and your state apply.",
          ],
        },
        {
          date: "22 August 2026",
          title: "\"Shared time off\" gets a privacy note and a clearer error message",
          items: [
            "A new hint (the \"i\" icon next to the heading) explains that a pasted share link is only evaluated locally in your browser and never stored anywhere.",
            "If a pasted link comes from an old, no-longer-supported version of FREILOTSE, you now get a matching error message instead of the generic \"invalid link\" notice.",
          ],
        },
        {
          date: "22 August 2026",
          title: "Public holiday source for the year-end extension is now visible",
          items: [
            "If your last free period runs until New Year's Eve, Pro mode now also shows whether the public holidays for the extension into the new year come from the OpenHolidays API or the built-in calculation – just like it already does for the main year.",
          ],
        },
        {
          date: "22 August 2026",
          title: "Added a note on the Augsburg Peace Festival",
          items: [
            "The hint text in Pro mode (the \"i\" icon below the calendar) now also makes clear that the Augsburg Peace Festival (8 August) – a public holiday only in the city of Augsburg – is not taken into account in planning, since FREILOTSE plans exclusively at the state/canton level.",
          ],
        },
        {
          date: "21 August 2026",
          title: "Flight and accommodation search now matches the interface language",
          items: [
            "The links to Google Flights and Skyscanner now open in English when FREILOTSE is set to English – instead of following the visitor's own account/browser settings.",
            "The \"Accommodation\" link to Booking.com now also opens in the matching language, English or German. Trip.com stays German, as no reliable language parameter exists there.",
          ],
        },
        {
          date: "20 August 2026",
          title: "FREILOTSE now available in English",
          items: [
            "A new language switcher in the header (\"EN\"/\"DE\") switches the entire interface between German and English – your choice is remembered on this device.",
            "Your current inputs are preserved when switching, even if not yet saved.",
            "The legal notice and privacy policy remain in German for legal reasons; a notice makes this clear in English mode.",
          ],
        },
        {
          date: "9 August 2026",
          title: "Flights now available via Google Flights or Skyscanner",
          items: [
            "Clicking \"Flights\" now first asks where you'd like to search – Google Flights or Skyscanner. Just like \"Accommodation\" already did.",
            "New \"Departure airport\" field: pre-filled with the nearest larger airport for your state or canton, but always editable. Clear it and Skyscanner will first show the cheapest departure points in your country.",
            "If Skyscanner doesn't know an airport for a typed destination, the dialog says so openly – the Google Flights link stays pre-filled regardless.",
          ],
        },
        {
          date: "8 August 2026",
          title: "41 new destinations in the suggestion list",
          items: [
            "The destination suggestions now cover 208 instead of 167 destinations – newly added are Bruges, Tallinn, Riga, Dubrovnik, Split, Kos, Zakynthos, Antalya, Bodrum, Hurghada and Sharm el-Sheikh, among others.",
            "Significantly more destinations in Asia, e.g. Busan, Hiroshima, Okinawa, Chengdu, Xi'an, Krabi, Pattaya, Phu Quoc, Langkawi, Penang, Jaipur and Agra.",
            "As before: the list is just a helper – you can still freely type in any destination of your own.",
          ],
        },
        {
          date: "8 August 2026",
          title: "Accommodation now available via Booking.com or Trip.com",
          items: [
            "Clicking \"Accommodation\" now first asks where you'd like to search – Booking.com or Trip.com.",
            "Both portals open with the matching travel period and, if entered, directly with your destination.",
            "If Trip.com doesn't know a typed destination, the dialog says so openly instead of opening an empty results list.",
          ],
        },
        {
          date: "8 August 2026",
          title: "Automatic first save after 3 minutes",
          items: [
            "If you haven't saved a plan yet, FREILOTSE now automatically backs up your inputs on this device after 3 minutes of active use – so nothing is lost if you close the tab without clicking \"Save plan\" yourself.",
            "A short notice makes clear that the plan was saved automatically – distinguishable from the notice shown on manual saving.",
          ],
        },
        {
          date: "8 August 2026",
          title: "Improvements to destination suggestions",
          items: [
            "The suggestion list on the destination fields now only opens once you've typed at least three characters, instead of already when clicking the empty field.",
            "Significantly more international destinations are now available, e.g. Osaka, Taipei, Shanghai, Dubai, Nairobi or Buenos Aires.",
            "A small hint (i icon) next to the destination field makes clear: the suggestions are just a helper, and you can enter your own destination outside the list at any time.",
          ],
        },
        {
          date: "7 August 2026",
          title: "Trip links for long free periods",
          items: [
            "For free periods of 3 or more consecutive days, Pro mode now also shows buttons for Google Flights and Booking.com with the matching date range – a quick starting point for trip planning. Optionally enter a destination so it's pre-filled directly too.",
            "For individual periods with a different destination, there's now a small input field right below the buttons that overrides the destination above for that period.",
            "The destination fields now suggest matching destinations as you type (e.g. major cities and popular vacation spots) to avoid typos.",
          ],
        },
        {
          date: "29 July 2026",
          title: "Better preview when sharing links",
          items: [
            "When you share a FREILOTSE link (e.g. to the guide or the puzzle) on WhatsApp, LinkedIn or other services, a matching preview with title, description and image is now shown instead of a generic entry.",
            "The browser tab title for the legal notice and privacy policy now correctly shows the page name.",
          ],
        },
        {
          date: "29 July 2026",
          title: "New look: Freibad tile",
          items: [
            "FREILOTSE has a completely new, warmer design – inspired by a German outdoor-pool summer instead of a generic software look.",
            "Light mode is now the default; dark mode remains available via the familiar toggle, just styled warmer.",
            "Calendar days now appear as round tiles instead of square boxes.",
            "Fine-tuning after a closer look: school holidays in the calendar now have their own colour instead of the public-holiday colour, warning notices in dark mode are more readable, the floating support button moves back to the bottom edge on smartphones instead of floating in the middle, and several buttons got their keyboard focus ring back.",
          ],
        },
        {
          date: "28 July 2026",
          title: "Support now via PayPal",
          items: [
            "The \"Support FREILOTSE\" button in the footer as well as the floating hint after planning now lead to PayPal instead of Ko-fi.",
          ],
        },
        {
          date: "28 July 2026",
          title: "Daily bridge day puzzle",
          items: [
            "New in the footer: a daily, Wordle-style puzzle – place your vacation days correctly in a sample month and find the longest consecutive stretch of days off.",
            "Your result is compared with the objectively best solution and can be shared as a compact emoji grid without giving away the solution.",
            "Runs entirely offline and without an account – one attempt per day, with a streak stat on this device.",
            "After your scored attempt, you can keep practising with \"Try again\" as often as you like – your streak and stats stay unchanged.",
          ],
        },
        {
          date: "28 July 2026",
          title: "New guide",
          items: [
            "A new \"Guide\" page (linked in the footer) compactly explains all of FREILOTSE's features – from Simple mode to Shared Time Off and the year-end extension.",
          ],
        },
        {
          date: "28 July 2026",
          title: "Recognising free time across the year-end",
          items: [
            "In Pro mode, free public holidays, weekends and regularly free days right after New Year's Day are now appended to a period that runs until New Year's Eve.",
            "Possible extensions using vacation days from the following year appear separately as a non-binding hint and change neither your budget nor the yearly figures.",
            "ICS and Google exports of this period now include the free extension from the following year.",
          ],
        },
        {
          date: "27 July 2026",
          title: "Find shared days off with others",
          items: [
            "New \"Shared Time Off\" section: add another person's share link and see directly on which days you're both off.",
            "Shows, for every shared period, how many vacation or overtime days each person uses for it.",
            "Stays entirely client-side – the pasted link is never stored anywhere and is only evaluated for the current session.",
          ],
        },
        {
          date: "27 July 2026",
          title: "Export your entire plan at once",
          items: [
            "A new \"Export entire plan\" button downloads all free periods bundled as a single .ics file, instead of having to export each period individually.",
            "The file can be opened directly in Apple Calendar, Outlook and iCal, and imported into Google Calendar via its \"Import calendar\" feature.",
          ],
        },
        {
          date: "27 July 2026",
          title: "Save plans locally",
          items: [
            "You can now save your plan directly on this device so it's automatically there again on your next visit.",
            "Multiple named plans are possible, e.g. \"Vacation 2027\" and \"Summer holidays with family\" – manageable via \"My plans\" in the header (rename, duplicate, delete).",
            "Nothing is transmitted to a server – plans stay exclusively on this device.",
          ],
        },
        {
          date: "27 July 2026",
          title: "Austria and Switzerland now supported",
          items: [
            "In addition to Germany, you can now also select Austria and Switzerland as your country, including their respective public holidays and states/cantons.",
            "FREILOTSE automatically detects a matching country as a default based on your location – you can always change it manually.",
            "Automatic location detection now responds more reliably, even when a VPN or firewall blocks the request.",
          ],
        },
        {
          date: "24 July 2026",
          title: "Switch to a new public-holiday source",
          items: [
            "Public holidays and school holidays are now sourced via the OpenHolidays API – the foundation for the new multi-country support.",
          ],
        },
        {
          date: "22 July 2026",
          title: "Regular working days now freely configurable",
          items: [
            "You can now set which weekdays you regularly work, e.g. only Monday to Thursday for part-time.",
            "Vacation planning now takes your personal working days into account instead of automatically assuming Monday to Friday.",
          ],
        },
        {
          date: "20 July 2026",
          title: "New start page and overtime calculator",
          items: [
            "A new start page lets you choose between Simple mode and Pro mode before you begin.",
            "A new overtime calculator converts existing overtime hours directly into days off.",
          ],
        },
      ],
    },

    share: {
      button: "Share plan",
      ariaLabel: "Share current plan as a link",
      title: "Share current plan as a link",
      nativeTitle: (p) => `Vacation plan ${p.year}`,
      nativeText: (p) => `My vacation plan for ${p.year} (${p.state}) – open in the vacation planner:`,
      toast: {
        linkCopied: "Link copied.",
        copyManually: "Please select and copy the link manually.",
        tooLong: "Plan too large for a link.",
        createFailed: "Could not create link.",
        loadFailed: "The shared plan could not be loaded.",
        loadedPartially: "Shared plan was partially loaded.",
        loadedFully: "Shared plan was loaded.",
      },
      modal: {
        title: "Share plan",
        privacyNote: "The link contains your plan settings. Anyone with this link can open the plan.",
        linkLabel: "Shareable link",
        copyButton: "Copy link",
        closeButton: "Close",
      },
    },

    localPlans: {
      header: {
        saveButton: "Save plan",
        saveAriaLabel: "Save current plan as a new plan on this device",
        manageButton: "My plans",
        manageAriaLabel: "Manage saved plans",
      },
      modal: {
        title: "My plans",
        privacyNote: "Your plans are stored exclusively on this device – nothing is transmitted to a server.",
        newPlanNamePlaceholder: "Name for new plan",
        newPlanButton: "Save",
        emptyHint: "No saved plans yet.",
        openButton: "Open",
        activeBadge: "Active",
        renameButton: "Rename",
        renameSaveButton: "Save",
        renameCancelButton: "Cancel",
        duplicateButton: "Duplicate",
        deleteButton: "Delete permanently",
        closeButton: "Close",
        updatedAtLabel: (p) => `Last edited: ${p.date}`,
      },
      defaultName: "Untitled plan",
      copySuffix: " (copy)",
      toast: {
        firstSaveNotice: "Plan saved on this device. Nothing is transmitted to a server.",
        autoFirstSaveNotice: "Your plan was automatically saved on this device. Nothing is transmitted to a server.",
        saveFailed: "Plan could not be saved (storage full?).",
        limitReached: (p) => `Maximum of ${p.max} saved plans allowed.`,
        loadedFully: "Plan was loaded.",
        loadedPartially: "Plan was partially loaded.",
        loadFailed: "Plan could not be loaded.",
        deleted: "Plan was deleted.",
        storeCorrupted: "Some saved plans could not be read and were removed.",
      },
    },

    theme: {
      toLight: "☀️ Light mode",
      toDark: "🌙 Dark mode",
      toggleTitle: "Switch between dark mode and light mode",
    },

    schoolHolidays: {
      question: "How should school holidays be taken into account in your plan?",
      preference: {
        prefer: "Plan within school holidays",
        avoid: "Avoid school holidays where possible",
        neutral: "No preference",
      },
      hint: "Determines whether automatically generated vacation suggestions preferably fall within or outside school holidays.",
      notice: {
        noData: (p) =>
          `No school holiday data is currently available for ${p.state} in ${p.year}. Your holiday preference is not taken into account for this plan.`,
        unreachable:
          "School holiday data could not be loaded at this time. Your holiday preference is not taken into account for this plan.",
      },
      optionsDisabledTitle: "Has no effect without available school holiday data, until data becomes available.",
    },

    workingDays: {
      question: "On which days do you normally work?",
      defaultSummary: "Monday to Friday",
      changeButton: "Change",
      closeButton: "Close selection",
      summaryRange: (p) => `${p.from} to ${p.to}`,
      summaryList: (p) => p.days.join(", "),
      resetButton: "Restore Mon–Fri",
      minOneRequired: "At least one working day must remain selected.",
      proPanelTitle: "Regular working days",
      proHint: "FREILOTSE treats unselected days as regularly free days.",
    },

    simple: {
      stepperTitle: "Your plan – step by step",
      step1Question: "1 · How many vacation days do you have?",
      step2Question: "2 · Which year would you like to plan for?",
      stepCountryQuestion: "3 · Which country do you live in?",
      step3Question: (p) => `4 · Which ${p.region} do you work in?`,
      stepWorkdaysQuestion: "5 · On which days do you normally work?",
      step4Question: "6 · How do 24 and 31 December work for you?",
      step4Options: {
        full: "I have to take a full vacation day for each.",
        half: "They each count as half a vacation day.",
        none: "I have both days off and don't need any vacation for them.",
      },
      step4Hint: "Many employers treat Christmas Eve and New Year's Eve differently. Just choose the rule that applies to you.",
      step5Question: "7 · How should school holidays be taken into account?",
      step6Question: "8 · What matters most to you?",
      goal: {
        free: "As many free days as possible",
        blocks: "Long vacation blocks",
        short: "Many short breaks",
        custom: "Custom planning (Pro mode)",
      },
      calcButton: "Calculate best plan",
      notStartedHint: "Choose your details on the left and click \"Calculate best plan\".",
      resultHeading: "Your optimal vacation plan",
      freeDaysLabel: "free days",
      statTotalFree: (p) =>
        `A total of ${p.count} ${p.count === 1 ? "free day" : "free days"} in ${p.periods} ${p.periods === 1 ? "period" : "periods"}`,
      statVacationDaysUsed: (p) => `Of which ${p.count} vacation day${p.countRaw === 1 ? "" : "s"} planned`,
      statHolidaysUsed: (p) =>
        p.count === 1 ? "1 public holiday falls within your suggestions" : `${p.count} public holidays fall within your suggestions`,
      statLongestStreak: (p) => `Longest consecutive period: ${p.count} day${p.count === 1 ? "" : "s"}`,
      summarySentence: (p) =>
        `With ${p.usedVac} of ${p.totalVac} vacation days, you get a total of ${p.totalFree} ${p.totalFree === 1 ? "free day" : "free days"} in ${p.periods} ${p.periods === 1 ? "period" : "periods"}.`,
      recommendedBlocksHeading: "Recommended vacation blocks",
      noSuggestions: "No suggestions found – increase your number of vacation days.",
      jumpToMonthTitle: "Jump to this month in the calendar",
      periodFreeDaysLabel: (p) => `${p.len} ${p.len === 1 ? "free day" : "free days"} · ${p.vac} vacation day${p.vacRaw === 1 ? "" : "s"}`,
      showCalendar: "Show calendar",
      hideCalendar: "Hide calendar",
    },

    settings: {
      panelTitle: "General",
      year: "Year",
      country: "Country",
      vacationDays: "Vacation days",
      overtimeDaysLabel: "Overtime reduction (days)",
      holidaySource: "Public holiday source:",
      holidaySourceApi: "OpenHolidays API (online)",
      holidaySourceLoading: "loading …",
      holidaySourceLocal: "built-in calculation (API not reachable)",
      schoolHolidaySourceLabel: "School holiday source:",
      schoolHolidaySourceOpenHolidays: "OpenHolidays API (online)",
      schoolHolidaySourceErsatz: "schulferien-api.de (fallback source)",
      schoolHolidaySourceNone: "no data available",
      schoolHolidaySourceUnreachable: "currently unreachable",
      otCalc: {
        toggleShow: "Calculate overtime from hours",
        toggleHide: "Hide overtime calculator",
        hoursLabel: "Overtime (hours)",
        hoursPerDayLabel: "Hours per working day",
        result: (p) => `= ${p.value} ${p.valueRaw === 1 ? "overtime day" : "overtime days"}`,
        resultInvalid: "Please enter valid values.",
        apply: "Apply overtime days",
        applyAriaLabel: "Apply calculated overtime days to the \"Overtime reduction (days)\" field",
      },
    },

    workRules: {
      panelTitle: "Working schedule",
      xmasLabel: "24 and 31 December count as",
      xmasOptionFull: "full vacation day (100%)",
      xmasOptionHalf: "half vacation day (50%)",
      xmasOptionNone: "free – no vacation day (0%)",
    },

    auto: {
      panelTitle: "Automatic planning",
      budgetLabel: "Automatic budget",
      toMinimum: "to minimum",
      useVacationDays: "Use vacation days",
      useOvertimeDays: "Use overtime days",
      fromMonth: "From month",
      spendFirst: "Use up first",
      spendFirstVac: "Vacation days",
      spendFirstOt: "Overtime",
      minimumHintPrefix: (p) => `Start: minimum of ${p.days} days – only 1-day bridges.`,
      minimumHintDetail:
        "At the minimum, the automatic planning only buys isolated 1-day gaps – 1 day used creates 4 consecutive days off. More budget gradually unlocks 2-, 3- and 4-day gaps. \"From month\" only limits the automatic planning; desired blocks and manual clicks are independent of it and use the full budget. The sliders are limited to your entered values.",
    },

    blocks: {
      panelTitle: "Desired blocks",
      prioritizedHint: "are prioritised",
      addButton: "+ Block",
      emptyHint: "No blocks yet – set how many days in a row you'd like off.",
      freeDaysLabel: "Days off",
      monthLabel: "Month",
      monthAny: "any",
      overtimeDaysLabel: "Overtime days",
      placed: (p) => `${p.start} – ${p.end} · costs ${p.cost} days`,
      notPlaced: "No placement possible (check budget or month)",
      removeButton: "Remove",
    },

    metrics: {
      leverage: "free days per day used",
      longestStreak: "Longest consecutive period (days)",
      holidaysWorkdaysOnly: "Public holidays on your working days within your periods",
      remaining: "remaining: vacation / overtime",
    },

    results: {
      periodsHeading: "Your free periods",
      periodsEmptyHint: "Enter vacation days to see suggestions.",
      jumpToMonthTitle: "Jump to this month in the calendar",
      badgeBlock: "Desired block",
      badgeManual: "manual",
      badgeAuto: "automatic",
      periodSummary: (p) => `${p.len} days off · ${p.vac} vacation${p.otRaw > 0 ? ` · ${p.ot} overtime` : ""}`,
      icsButton: "ICS/iCal",
      icsTitle: "Download as .ics file (Apple Calendar, Outlook, iCal)",
      googleButton: "Google",
      googleTitle: "Open in Google Calendar (pre-filled event)",
      exportAllButton: "Export entire plan",
      exportAllTitle: "Download all free periods as a single .ics file (Apple Calendar, Outlook, iCal; importable into Google Calendar via \"Import calendar\")",
      destinationLabel: "Destination (optional)",
      destinationHint:
        "The suggestion list appears once you've typed at least three characters and is only a helper – you can just as easily enter any destination of your own that isn't in the list.",
      destinationPlaceholder: "e.g. Paris, Mallorca …",
      destinationPeriodPlaceholder: (p) =>
        p.fallback ? `Different destination (default: ${p.fallback})` : "Different destination for this period",
      destinationPeriodAriaLabel: "Destination for this period (overrides the field above)",
      destinationSuggestions: [
        // Germany – major cities
        { name: "Berlin", tripCityId: 193, skyscannerCode: "ber" },
        { name: "Hamburg", tripCityId: 763, skyscannerCode: "ham" },
        { name: "Munich", tripCityId: 363, skyscannerCode: "muc" },
        { name: "Cologne", tripCityId: 709, skyscannerCode: "cgn" },
        { name: "Frankfurt am Main", tripCityId: 250, skyscannerCode: "fra" },
        { name: "Stuttgart", tripCityId: 765, skyscannerCode: "str" },
        { name: "Düsseldorf", tripCityId: 762, skyscannerCode: "dus" },
        { name: "Leipzig", tripCityId: 3463, skyscannerCode: "lej" }, // Skyscanner: Leipzig/Halle
        { name: "Dresden", tripCityId: 1412, skyscannerCode: "drs" },
        { name: "Hanover", tripCityId: 1248, skyscannerCode: "haj" },
        { name: "Nuremberg", tripCityId: 31120, skyscannerCode: "nue" },
        { name: "Bremen", tripCityId: 1359, skyscannerCode: "bre" },
        { name: "Bonn", tripCityId: 1450, skyscannerCode: null },
        { name: "Mannheim", tripCityId: 3464, skyscannerCode: null },
        { name: "Augsburg", tripCityId: 1415, skyscannerCode: null },
        { name: "Freiburg im Breisgau", tripCityId: 3466, skyscannerCode: null },
        { name: "Rostock", tripCityId: 5768, skyscannerCode: "rlg" }, // Skyscanner: Rostock-Laage
        { name: "Kiel", tripCityId: 1408, skyscannerCode: null },
        { name: "Heidelberg", tripCityId: 3333, skyscannerCode: null },
        { name: "Potsdam", tripCityId: 30044, skyscannerCode: null },
        // Germany – popular destinations
        { name: "Trier", tripCityId: 3469, skyscannerCode: null },
        { name: "Regensburg", tripCityId: 3132, skyscannerCode: null },
        { name: "Würzburg", tripCityId: 9242, skyscannerCode: null },
        { name: "Passau", tripCityId: 10082, skyscannerCode: null },
        { name: "Konstanz", tripCityId: 9805, skyscannerCode: null },
        { name: "Lindau", tripCityId: 30872, skyscannerCode: null },
        { name: "Garmisch-Partenkirchen", tripCityId: 3134, skyscannerCode: null },
        { name: "Sylt", tripCityId: 6863, skyscannerCode: "gwt" }, // Westerland
        { name: "Rügen", tripCityId: 29825, skyscannerCode: null }, // Binz
        { name: "Usedom", tripCityId: 121764, skyscannerCode: null }, // Heringsdorf
        { name: "Norderney", tripCityId: 5444, skyscannerCode: null },
        { name: "Berchtesgaden", tripCityId: 3870, skyscannerCode: null },
        // Austria
        { name: "Vienna", tripCityId: 651, skyscannerCode: "vie" },
        { name: "Salzburg", tripCityId: 739, skyscannerCode: "szg" },
        { name: "Graz", tripCityId: 805, skyscannerCode: "grz" },
        { name: "Innsbruck", tripCityId: 1451, skyscannerCode: "inn" },
        { name: "Linz", tripCityId: 815, skyscannerCode: "lnz" },
        { name: "Kitzbühel", tripCityId: 9800, skyscannerCode: null },
        { name: "Zell am See", tripCityId: 3403, skyscannerCode: null },
        { name: "Villach", tripCityId: 9203, skyscannerCode: null },
        // Switzerland
        { name: "Zurich", tripCityId: 434, skyscannerCode: "zrh" },
        { name: "Geneva", tripCityId: 666, skyscannerCode: "gva" },
        { name: "Basel", tripCityId: 806, skyscannerCode: "bsl" }, // Skyscanner: EuroAirport
        { name: "Bern", tripCityId: 834, skyscannerCode: "brn" },
        { name: "Lucerne", tripCityId: 40039, skyscannerCode: null },
        { name: "Interlaken", tripCityId: 3167, skyscannerCode: null },
        { name: "Zermatt", tripCityId: 3157, skyscannerCode: null },
        { name: "St. Moritz", tripCityId: 3144, skyscannerCode: null },
        // Europe – cities
        { name: "Paris", tripCityId: 192, skyscannerCode: "cdg" },
        { name: "London", tripCityId: 338, skyscannerCode: "lhr" },
        { name: "Rome", tripCityId: 343, skyscannerCode: "fco" },
        { name: "Milan", tripCityId: 361, skyscannerCode: "mxp" },
        { name: "Venice", tripCityId: 688, skyscannerCode: "vce" },
        { name: "Florence", tripCityId: 687, skyscannerCode: "flr" },
        { name: "Naples", tripCityId: 1262, skyscannerCode: "nap" },
        { name: "Turin", tripCityId: 32159, skyscannerCode: "trn" },
        { name: "Barcelona", tripCityId: 40795, skyscannerCode: "bcn" },
        { name: "Madrid", tripCityId: 357, skyscannerCode: "mad" },
        { name: "Seville", tripCityId: 1350, skyscannerCode: "svq" },
        { name: "Valencia", tripCityId: 1351, skyscannerCode: "vlc" },
        { name: "Lisbon", tripCityId: 1231, skyscannerCode: "lis" },
        { name: "Porto", tripCityId: 826, skyscannerCode: "opo" },
        { name: "Amsterdam", tripCityId: 176, skyscannerCode: "ams" },
        { name: "Brussels", tripCityId: 196, skyscannerCode: "bru" },
        { name: "Copenhagen", tripCityId: 260, skyscannerCode: "cph" },
        { name: "Stockholm", tripCityId: 420, skyscannerCode: "arn" },
        { name: "Oslo", tripCityId: 827, skyscannerCode: "osl" },
        { name: "Helsinki", tripCityId: 277, skyscannerCode: "hel" },
        { name: "Reykjavik", tripCityId: 831, skyscannerCode: "kef" },
        { name: "Dublin", tripCityId: 803, skyscannerCode: "dub" },
        { name: "Edinburgh", tripCityId: 706, skyscannerCode: "edi" },
        { name: "Prague", tripCityId: 1288, skyscannerCode: "prg" },
        { name: "Budapest", tripCityId: 637, skyscannerCode: "bud" },
        { name: "Warsaw", tripCityId: 293, skyscannerCode: "waw" },
        { name: "Krakow", tripCityId: 1343, skyscannerCode: "krk" },
        { name: "Athens", tripCityId: 710, skyscannerCode: "ath" },
        { name: "Istanbul", tripCityId: 532, skyscannerCode: "ist" },
        { name: "Ljubljana", tripCityId: 1266, skyscannerCode: "lju" },
        { name: "Bruges", tripCityId: 3128, skyscannerCode: null },
        { name: "Tallinn", tripCityId: 1737, skyscannerCode: "tll" },
        { name: "Riga", tripCityId: 4079, skyscannerCode: "rix" },
        { name: "Vilnius", tripCityId: 786, skyscannerCode: "vno" },
        { name: "Bucharest", tripCityId: 674, skyscannerCode: "otp" },
        { name: "Sofia", tripCityId: 792, skyscannerCode: "sof" },
        { name: "Dubrovnik", tripCityId: 3901, skyscannerCode: "dbv" },
        { name: "Split", tripCityId: 3264, skyscannerCode: "spu" },
        { name: "Zadar", tripCityId: 6531, skyscannerCode: "zad" },
        // Europe – islands and holiday destinations
        { name: "Mallorca", tripCityId: 1267, skyscannerCode: "pmi" }, // Palma de Mallorca
        { name: "Ibiza", tripCityId: 1768, skyscannerCode: "ibz" },
        { name: "Menorca", tripCityId: 1772, skyscannerCode: "mah" },
        { name: "Gran Canaria", tripCityId: 1269, skyscannerCode: "lpa" },
        { name: "Tenerife", tripCityId: 3508, skyscannerCode: "tfs" }, // Santa Cruz de Tenerife, Skyscanner: Tenerife South
        { name: "Fuerteventura", tripCityId: 9513, skyscannerCode: "fue" }, // Corralejo
        { name: "Lanzarote", tripCityId: 1766, skyscannerCode: "ace" },
        { name: "Crete", tripCityId: 6890, skyscannerCode: "her" }, // Heraklion
        { name: "Rhodes", tripCityId: 3570, skyscannerCode: "rho" },
        { name: "Corfu", tripCityId: 5046, skyscannerCode: "cfu" },
        { name: "Santorini", tripCityId: 3576, skyscannerCode: "jtr" },
        { name: "Mykonos", tripCityId: 42294, skyscannerCode: "jmk" },
        { name: "Sardinia", tripCityId: 1432, skyscannerCode: "cag" }, // Cagliari
        { name: "Sicily", tripCityId: 3640, skyscannerCode: "pmo" }, // Palermo
        { name: "Malta", tripCityId: 1214, skyscannerCode: "mla" }, // Valletta
        { name: "Cyprus", tripCityId: 3291, skyscannerCode: "lca" }, // Paphos, Skyscanner: Larnaca
        { name: "Madeira", tripCityId: 3298, skyscannerCode: "fnc" }, // Funchal
        { name: "Algarve", tripCityId: 3725, skyscannerCode: "fao" }, // Albufeira, Skyscanner: Faro
        { name: "Côte d'Azur", tripCityId: 775, skyscannerCode: "nce" }, // Nice
        { name: "Tuscany", tripCityId: 687, skyscannerCode: "psa" }, // Florence, Skyscanner: Pisa
        { name: "Larnaca", tripCityId: 40316, skyscannerCode: "lca" },
        { name: "Paphos", tripCityId: 3291, skyscannerCode: "pfo" }, // same ID as "Cyprus"
        { name: "Kos", tripCityId: 7159, skyscannerCode: "kgs" },
        { name: "Zakynthos", tripCityId: 6565, skyscannerCode: "zth" },
        // Turkish Mediterranean destinations
        { name: "Antalya", tripCityId: 1217, skyscannerCode: "ayt" },
        { name: "Bodrum", tripCityId: 1761, skyscannerCode: "bjv" },
        // International long-haul – North America
        { name: "New York", tripCityId: 633, skyscannerCode: "jfk" },
        { name: "Los Angeles", tripCityId: 347, skyscannerCode: "lax" },
        { name: "San Francisco", tripCityId: 313, skyscannerCode: "sfo" },
        { name: "Las Vegas", tripCityId: 26282, skyscannerCode: "las" },
        { name: "Miami", tripCityId: 25773, skyscannerCode: "mia" },
        { name: "Chicago", tripCityId: 549, skyscannerCode: "ord" },
        { name: "Boston", tripCityId: 26848, skyscannerCode: "bos" },
        { name: "Washington, D.C.", tripCityId: 26363, skyscannerCode: "iad" },
        { name: "Seattle", tripCityId: 511, skyscannerCode: "sea" },
        { name: "Orlando", tripCityId: 1187, skyscannerCode: "mco" },
        { name: "Honolulu", tripCityId: 757, skyscannerCode: "hnl" },
        { name: "Toronto", tripCityId: 461, skyscannerCode: "yyz" },
        { name: "Vancouver", tripCityId: 476, skyscannerCode: "yvr" },
        { name: "Montreal", tripCityId: 759, skyscannerCode: "yul" },
        // International long-haul – Central and South America
        { name: "Mexico City", tripCityId: 691, skyscannerCode: "mex" },
        { name: "Cancún", tripCityId: 812, skyscannerCode: "cun" },
        // Havana: ID 690 correctly shows "Havana" but returns 0 bookable
        // accommodations from the German market – hence null.
        { name: "Havana", tripCityId: null, skyscannerCode: "hav" },
        { name: "Punta Cana", tripCityId: 5677, skyscannerCode: "puj" },
        { name: "Rio de Janeiro", tripCityId: 769, skyscannerCode: "gig" },
        { name: "São Paulo", tripCityId: 415, skyscannerCode: "gru" },
        { name: "Buenos Aires", tripCityId: 807, skyscannerCode: "eze" },
        { name: "Santiago de Chile", tripCityId: 852, skyscannerCode: "scl" },
        { name: "Lima", tripCityId: 837, skyscannerCode: "lim" },
        { name: "Bogotá", tripCityId: 824, skyscannerCode: "bog" },
        { name: "Cartagena", tripCityId: 5123, skyscannerCode: "ctg" },
        // International long-haul – Middle East and Africa
        { name: "Dubai", tripCityId: 220, skyscannerCode: "dxb" },
        { name: "Abu Dhabi", tripCityId: 766, skyscannerCode: "auh" },
        { name: "Doha", tripCityId: 1401, skyscannerCode: "doh" },
        { name: "Muscat", tripCityId: 853, skyscannerCode: "mct" },
        { name: "Tel Aviv", tripCityId: 462, skyscannerCode: "tlv" },
        { name: "Amman", tripCityId: 1282, skyscannerCode: "amm" },
        { name: "Beirut", tripCityId: 835, skyscannerCode: "bey" },
        { name: "Cairo", tripCityId: 332, skyscannerCode: "cai" },
        { name: "Marrakesh", tripCityId: 1360, skyscannerCode: "rak" },
        { name: "Cape Town", tripCityId: 683, skyscannerCode: "cpt" },
        { name: "Nairobi", tripCityId: 825, skyscannerCode: "nbo" },
        { name: "Zanzibar", tripCityId: 316972, skyscannerCode: "znz" }, // Zanzibar Town
        { name: "Hurghada", tripCityId: 3471, skyscannerCode: "hrg" },
        { name: "Sharm el-Sheikh", tripCityId: 36242, skyscannerCode: "ssh" },
        // International long-haul – Asia
        { name: "Bangkok", tripCityId: 359, skyscannerCode: "bkk" },
        { name: "Phuket", tripCityId: 725, skyscannerCode: "hkt" },
        { name: "Koh Samui", tripCityId: 1229, skyscannerCode: "usm" },
        { name: "Chiang Mai", tripCityId: 623, skyscannerCode: "cnx" },
        { name: "Bali", tripCityId: 723, skyscannerCode: "dps" },
        { name: "Singapore", tripCityId: 73, skyscannerCode: "sin" },
        { name: "Kuala Lumpur", tripCityId: 315, skyscannerCode: "kul" },
        { name: "Hong Kong", tripCityId: 58, skyscannerCode: "hkg" },
        { name: "Shanghai", tripCityId: 2, skyscannerCode: "pvg" },
        { name: "Beijing", tripCityId: 1, skyscannerCode: "pek" },
        { name: "Taipei", tripCityId: 617, skyscannerCode: "tpe" },
        { name: "Tokyo", tripCityId: 228, skyscannerCode: "nrt" },
        { name: "Kyoto", tripCityId: 734, skyscannerCode: "kix" }, // Skyscanner: Osaka/Kansai
        { name: "Osaka", tripCityId: 219, skyscannerCode: "kix" },
        { name: "Seoul", tripCityId: 274, skyscannerCode: "icn" },
        { name: "Hanoi", tripCityId: 286, skyscannerCode: "han" },
        { name: "Ho Chi Minh City", tripCityId: 301, skyscannerCode: "sgn" },
        { name: "Hoi An", tripCityId: 1775, skyscannerCode: "dad" }, // Skyscanner: Da Nang
        { name: "Da Nang", tripCityId: 1356, skyscannerCode: "dad" },
        { name: "Siem Reap", tripCityId: 1369, skyscannerCode: "sai" }, // Skyscanner: Siem Reap-Angkor
        { name: "Manila", tripCityId: 364, skyscannerCode: "mnl" },
        { name: "Jakarta", tripCityId: 524, skyscannerCode: "cgk" },
        { name: "Delhi", tripCityId: 495, skyscannerCode: "del" }, // New Delhi
        { name: "Mumbai", tripCityId: 724, skyscannerCode: "bom" },
        { name: "Goa", tripCityId: 36125, skyscannerCode: "goi" }, // Panaji
        { name: "Colombo", tripCityId: 810, skyscannerCode: "cmb" },
        { name: "Kathmandu", tripCityId: 304, skyscannerCode: "ktm" },
        { name: "Maldives", tripCityId: 1207, skyscannerCode: "mle" }, // Malé
        { name: "Busan", tripCityId: 253, skyscannerCode: "pus" },
        { name: "Hiroshima", tripCityId: 262, skyscannerCode: "hij" },
        { name: "Okinawa", tripCityId: 207, skyscannerCode: "oka" },
        { name: "Fukuoka", tripCityId: 248, skyscannerCode: "fuk" },
        { name: "Kaohsiung", tripCityId: 720, skyscannerCode: "khh" },
        { name: "Chengdu", tripCityId: 28, skyscannerCode: "ctu" },
        { name: "Xi'an", tripCityId: 10, skyscannerCode: "xiy" },
        { name: "Shenzhen", tripCityId: 30, skyscannerCode: "szx" },
        { name: "Guangzhou", tripCityId: 32, skyscannerCode: "can" },
        { name: "Cebu", tripCityId: 1239, skyscannerCode: "ceb" },
        { name: "Boracay", tripCityId: 1391, skyscannerCode: "mph" }, // Skyscanner: Caticlan
        { name: "Palawan", tripCityId: 4089, skyscannerCode: "pps" }, // Skyscanner: Puerto Princesa
        { name: "Krabi", tripCityId: 1405, skyscannerCode: "kbv" },
        { name: "Pattaya", tripCityId: 622, skyscannerCode: "utp" }, // Skyscanner: U-Tapao
        { name: "Phu Quoc", tripCityId: 5649, skyscannerCode: "pqc" },
        { name: "Nha Trang", tripCityId: 1777, skyscannerCode: "cxr" }, // Skyscanner: Cam Ranh
        { name: "Langkawi", tripCityId: 1225, skyscannerCode: "lgk" },
        { name: "Penang", tripCityId: 35926, skyscannerCode: "pen" }, // George Town
        { name: "Lombok", tripCityId: 1392, skyscannerCode: "lop" }, // Skyscanner: Praya
        { name: "Yogyakarta", tripCityId: 741, skyscannerCode: "yia" }, // Skyscanner: Yogyakarta International
        { name: "Luang Prabang", tripCityId: 3677, skyscannerCode: "lpq" },
        { name: "Phnom Penh", tripCityId: 303, skyscannerCode: "pnh" },
        { name: "Jaipur", tripCityId: 3288, skyscannerCode: "jai" },
        { name: "Agra", tripCityId: 3318, skyscannerCode: null },
        // International long-haul – Oceania
        { name: "Sydney", tripCityId: 501, skyscannerCode: "syd" },
        { name: "Melbourne", tripCityId: 358, skyscannerCode: "mel" },
        { name: "Auckland", tripCityId: 678, skyscannerCode: "akl" },
        { name: "Fiji", tripCityId: 791, skyscannerCode: "nan" }, // Nadi
      ],
      originLabel: "Departure airport (optional)",
      originHint:
        "Only used for the Skyscanner search. Pre-filled with the nearest larger airport for your state or canton – you can always overwrite it, also with a code like FRA or VIE. If you clear the field, Skyscanner searches from all airports in your country and shows the cheapest departure points first.",
      originPlaceholder: "e.g. Frankfurt, Munich …",
      originSuggestions: [
        // Germany
        { name: "Berlin (BER)", code: "ber" },
        { name: "Bremen (BRE)", code: "bre" },
        { name: "Dresden (DRS)", code: "drs" },
        { name: "Düsseldorf (DUS)", code: "dus" },
        { name: "Frankfurt am Main (FRA)", code: "fra" },
        { name: "Hamburg (HAM)", code: "ham" },
        { name: "Hanover (HAJ)", code: "haj" },
        { name: "Cologne/Bonn (CGN)", code: "cgn" },
        { name: "Leipzig/Halle (LEJ)", code: "lej" },
        { name: "Munich (MUC)", code: "muc" },
        { name: "Nuremberg (NUE)", code: "nue" },
        { name: "Stuttgart (STR)", code: "str" },
        // Austria
        { name: "Vienna (VIE)", code: "vie" },
        { name: "Salzburg (SZG)", code: "szg" },
        { name: "Innsbruck (INN)", code: "inn" },
        { name: "Graz (GRZ)", code: "grz" },
        { name: "Linz (LNZ)", code: "lnz" },
        { name: "Klagenfurt (KLU)", code: "klu" },
        // Switzerland
        { name: "Zurich (ZRH)", code: "zrh" },
        { name: "Geneva (GVA)", code: "gva" },
        { name: "Basel (BSL)", code: "bsl" },
        { name: "Bern (BRN)", code: "brn" },
      ],
      originByState: {
        DE: {
          BW: "str", BY: "muc", BE: "ber", BB: "ber", HB: "bre", HH: "ham",
          HE: "fra", MV: "ham", NI: "haj", NW: "dus", RP: "fra", SL: "fra",
          SN: "lej", ST: "lej", SH: "ham", TH: "lej",
        },
        AT: {
          BL: "vie", "KÄ": "klu", "NÖ": "vie", "OÖ": "lnz", SB: "szg",
          SM: "grz", TI: "inn", VA: "zrh", WI: "vie",
        },
        CH: {
          AG: "zrh", AI: "zrh", AR: "zrh", BE: "zrh", BL: "bsl", BS: "bsl",
          FR: "gva", GE: "gva", GL: "zrh", GR: "zrh", JU: "bsl", LU: "zrh",
          NE: "gva", NW: "zrh", OW: "zrh", SG: "zrh", SH: "zrh", SO: "bsl",
          SZ: "zrh", TG: "zrh", TI: "zrh", UR: "zrh", VD: "gva", VS: "gva",
          ZG: "zrh", ZH: "zrh",
        },
      },
      flightsButton: "Flights",
      flightsTitle: "Open flight search for this period – choose Google Flights or Skyscanner.",
      flights: {
        dialogTitle: "Search flights",
        dialogAriaLabel: "Choose a portal for flight search",
        subtitle: (p) => (p.destination ? `${p.range} · ${p.destination}` : p.range),
        googleOption: "Google Flights",
        skyscannerOption: "Skyscanner",
        noDestinationHint:
          "Without a destination, only the portal's homepage opens without pre-filling.",
        skyscannerNoCodeHint:
          "Skyscanner doesn't know an airport for this destination – only its homepage opens without pre-filling. The Google Flights link stays pre-filled.",
        noOriginHint:
          "Without a departure airport, Skyscanner first shows the cheapest departure points in your country to choose from.",
        cancelButton: "Cancel",
      },
      bookingButton: "Accommodation",
      bookingTitle: "Open accommodation search for this period – choose Booking.com or Trip.com.",
      accommodation: {
        dialogTitle: "Search accommodation",
        dialogAriaLabel: "Choose a portal for accommodation search",
        subtitle: (p) => (p.destination ? `${p.range} · ${p.destination}` : p.range),
        bookingOption: "Booking.com",
        tripOption: "Trip.com",
        noDestinationHint:
          "Without a destination, only the portal's homepage opens without pre-filling.",
        tripNoIdHint:
          "Trip.com doesn't know a matching place for this destination – only its homepage opens without pre-filling. The Booking.com link stays pre-filled.",
        cancelButton: "Cancel",
      },
      reason: {
        xmasBoth: "The Christmas holidays as well as Christmas Eve and New Year's Eve are joined together.",
        xmasEveOnly: "The Christmas holidays and Christmas Eve are joined together.",
        xmasNyeOnly: "The Christmas holidays and New Year's Eve are joined together.",
        namedTwoWeekends: (p) => `${p.subject} ${p.plural ? "are" : "is"} joined with two weekends.`,
        namedExtends: (p) => `${p.subject} extend${p.plural ? "" : "s"} the free period.`,
        vacTwoWeekends: "Vacation days join two weekends into one longer free period.",
        vacOneWeekend: "Vacation days extend a weekend into a longer free period.",
        vacOnly: "Vacation days create a longer free period.",
      },
      warning: {
        schoolHolidayOverlap: (p) =>
          `Overlaps with school holidays on ${p.count} ${p.count === 1 ? "day" : "days"}. Your selection is treated as a preference, not an exclusion.`,
      },
      note: {
        schoolHolidayMatch: "Falls partly within school holidays, as requested.",
      },
      andSeparator: " and ",
    },

    manual: {
      clickSetsLabel: "Click in calendar sets",
      vacationDay: "Vacation day",
      overtimeReduction: "Overtime reduction",
      resetButton: (p) => `Reset manual changes (${p.count})`,
      failedOne: "1 manually set day could not be applied due to insufficient budget.",
      failedMany: (p) => `${p.count} manually set days could not be applied due to insufficient budget.`,
      helpText: "Click sets days, dragging selects several, clicking a planned day opens remove/swap.",
      helpDetail:
        "Clicking an empty working day sets the day type selected above – with the mouse, you can hold and drag to select several days at once, even across week and month boundaries; weekends, public holidays and already planned days are skipped. On touch devices, tap to set days one at a time; swiping scrolls as usual. Removed days remain working days and are not filled in again by the automatic planning.",
    },

    legend: {
      vacation: "Vacation",
      overtime: "Overtime reduction",
      holiday: "Public holiday",
      xmasFree: "24/31 Dec free",
      xmasHalf: "24/31 Dec half day",
      weekend: "Weekend",
      manualSet: "manually set",
      schoolHolidays: "School holidays",
      regularlyOff: "Regularly off",
      freePeriod: "Free period",
    },

    footerHint: {
      text: "Desired blocks first, then bridge days strictly by return.",
      detail: (p) => {
        const regionalCaveats = {
          DE: "Assumption Day is a public holiday in Bavaria only in municipalities with a predominantly Catholic population; Corpus Christi is a public holiday in Saxony and Thuringia only in certain regions, and the Augsburg Peace Festival (8 August) only in the city of Augsburg – neither special case is accounted for here. ",
          CH: "Only cantonwide public holidays are taken into account; holidays that apply only in individual districts or municipalities of a canton (e.g. parts of the canton of Aargau), as well as purely local customs such as Sechseläuten or Knabenschiessen (city of Zurich), are not taken into account. ",
        };
        const intro = "The optimisation places desired blocks first; 24 and 31 December are always fixed under the 100% or 50% rule so they don't break the run of public holidays. With the minimum budget, the automatic distribution only buys isolated 1-day bridges (1 day → 4 days off); more budget unlocks 2-, 3- and 4-day gaps – spread across the year, at most one gap per month per round. Vacation weeks with no public holiday are never planned automatically; unused days remain as budget left over.";
        return `${regionalCaveats[p.country] || ""}${intro}`;
      },
    },

    calendar: {
      weekdaysMonFirst: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weekNumberAbbr: "Wk",
      summary: {
        publicHolidays: "Public holidays:",
        schoolHolidays: "School holidays:",
        oneMore: " + 1 more",
        nMore: (p) => ` + ${p.count} more`,
        rangeUntil: (p) => `until ${p.date}`,
        rangeFrom: (p) => `from ${p.date}`,
        rangeBetween: (p) => `${p.from}–${p.to}`,
      },
      vacationTooltip: (p) => `${p.name} in ${p.state} · ${p.start} to ${p.end}`,
      personalWorkday: "regular working day",
    },

    dayDialog: {
      vacationDayType: "vacation day",
      currentLabel: (p) => `Currently: ${p.type}${p.half ? " (half day)" : ""}`,
      swapButton: (p) => `Swap to ${p.target}`,
      removeButton: "Remove day (working day again)",
      cancelButton: "Cancel",
    },

    exportCal: {
      eventTitle: "Vacation",
      icsDescription: (p) =>
        `${p.len} days off – ${p.vac} vacation days${p.otRaw > 0 ? `, ${p.ot} overtime reduction` : ""} (Vacation Planner)`,
      allEventsTitle: (p) => `Vacation plan ${p.year}`,
    },

    yearTransition: {
      certainLabel: (p) => `${p.len} days certainly free`,
      neededLabel: (p) =>
        `Requires ${p.vac} vacation day${p.vacRaw === 1 ? "" : "s"} from your ${p.year} budget`,
      sourceLabel: (p) => `Public holiday source for ${p.year}:`,
      hypotheticalBadge: (p) => `Possibility with vacation days from ${p.year}`,
      hypotheticalText: (p) =>
        `With ${p.extra} extra vacation day${p.extraRaw === 1 ? "" : "s"} from ${p.year}, ${p.total} days until ${p.end} would be possible.`,
    },

    sharedFree: {
      heading: "Shared time off",
      linkPlaceholder: "Paste share link",
      addButton: "Add",
      removeButton: "Remove",
      personLabel: (p) => `Person ${p.index}`,
      linkInvalid: "This link is invalid or corrupted.",
      linkVersionMismatch: "This link was created with a version of FREILOTSE that is no longer supported and can't be read.",
      privacyHint: "The link you paste in is only evaluated locally in your browser, never stored, and never sent to any server. It contains the other person's planning settings – only paste links that were deliberately shared with you for comparison.",
      differentYearWarning: (p) =>
        `This plan refers to ${p.year} – no overlap possible with your year ${p.ownYear}.`,
      emptyNoPeople: "Add another person's share link to find shared days off.",
      emptyNoOverlap: "There are currently no shared days off with the people you've added.",
      periodHeading: (p) => `${p.len} days off together`,
      myCost: (p) =>
        `You: ${p.vac} vacation day${p.vacRaw === 1 ? "" : "s"}${p.otRaw > 0 ? ` · ${p.ot} overtime` : ""}`,
      personCost: (p) =>
        `${p.label}: ${p.vac} vacation day${p.vacRaw === 1 ? "" : "s"}${p.otRaw > 0 ? ` · ${p.ot} overtime` : ""}`,
    },
  };

  window.I18N.registerLocale("en", EN);
})();
