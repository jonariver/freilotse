# Autovervollständigung für Reiseziel-Felder – Design-Spezifikation

## Kontext

Die Trip-Links (Google Flights/Booking.com, siehe
`2026-08-07-per-period-destination-design.md`) hängen von einem frei
getippten Reiseziel ab – global (`tripDestination`) und optional pro
Zeitraum (`perPeriodDestination`). Tippfehler im Zielort führen dazu, dass
die externen Suchen kein sinnvolles Ergebnis liefern. Ziel dieser Spec:
Vorschläge während der Eingabe anzeigen, um Tippfehler zu vermeiden – ohne
neue externe Abhängigkeit oder Datenfluss.

## Entscheidung (mit Nutzer abgestimmt)

Gegen eine Geocoding-/Places-API (Google Places, Nominatim) entschieden:
Autocomplete-artige Anfragen würden bei jedem Tastendruck Teile der Eingabe
an einen Drittanbieter senden – ein neuer, spürbarerer Datenfluss als die
bisherigen API-Anbindungen (dort nur Land-/Bundesland-Codes) und bräuchte
eine eigene Datenschutz-Klausel; Nominatims öffentliche Instanz untersagt
zudem Autocomplete-artige Nutzung in ihren Nutzungsbedingungen.

Stattdessen: natives HTML5 `<datalist>` mit einer fest mitgelieferten,
kompakten Liste (~100–150 Ziele) – keine Netzwerkanfragen, kein
Datenschutz-Thema, passt zum Offline-first-Prinzip der App.

## Architektur / Datenfluss

- Ein einziges `<datalist id="destination-suggestions">` wird **einmal**
  gerendert (z. B. direkt neben dem globalen Reiseziel-Feld,
  `results.periodsHeading`-Bereich in `app.jsx`).
- Sowohl das globale Feld (`tripDestination`) als auch **jedes**
  Pro-Zeitraum-Feld (`perPeriodDestination[p.s]`) erhalten zusätzlich
  `list="destination-suggestions"`. Ein `<datalist>` kann von beliebig
  vielen Inputs gleichzeitig referenziert werden – kein Duplizieren nötig.
- Reines natives Browser-Verhalten: Filterung/Anzeige der Vorschläge macht
  der Browser selbst, kein JS-Matching. Felder bleiben Freitext – der
  Browser erzwingt keine Auswahl aus der Liste, Nutzer können weiterhin
  jeden beliebigen Text eingeben.

## Datenquelle

Neuer Schlüssel `results.destinationSuggestions` (Array aus Strings) in
`locales/de.js`, direkt neben den bestehenden `results.destination*`-
Schlüsseln. Liegt dort statt als rohes Array in `app.jsx`, analog zu
`states`/`countries`, die aus demselben Grund (anzeigte, grundsätzlich
lokalisierbare Namen) bereits in der Locale-Datei liegen.

Inhalt (~100–150 Einträge, keine Netzwerkabfrage, einmalig händisch
kuratiert):
- Große deutsche, österreichische und Schweizer Städte (z. B. Berlin,
  Hamburg, München, Köln, Wien, Salzburg, Zürich, Genf, Basel …).
- Gängige europäische Reiseziele mit deutschen Exonymen, wo üblich (Rom,
  Mailand, Venedig, Florenz, Paris, Lissabon, Barcelona, Madrid, Prag,
  Budapest, Amsterdam, Kopenhagen, Stockholm, Athen, Dubrovnik, Krakau …).
- Beliebte Insel-/Ferienziele (Mallorca, Ibiza, Kreta, Rhodos, Teneriffa,
  Gran Canaria, Sylt, Rügen …).
- Verbreitete internationale Fernziele (New York, Los Angeles, Dubai,
  Bangkok, Bali, Singapur, Tokio, Kapstadt, Sydney, Rio de Janeiro …).

## UI

- `<datalist>` selbst ist unsichtbar (Standardverhalten), keine eigene
  Styling-Arbeit nötig.
- Kein neuer sichtbarer Text außer den Listeneinträgen selbst (siehe
  Internationalisierung unten) – bestehende Labels/Placeholder der beiden
  Felder bleiben unverändert.

## Internationalisierung

Die Zielnamen sind nutzersichtbarer Text (erscheinen im Vorschlags-
Dropdown) und gehören deshalb – wie von CLAUDE.md gefordert – in
`locales/de.js`, nicht als String-Literale in `app.jsx`. `app.jsx` liest
nur `t("results.destinationSuggestions")` und rendert daraus die
`<option>`-Elemente der Datalist.

## Nebenarbeiten (laut CLAUDE.md verbindlich)

- Cache-Busting-Version (`?v=…`) für `app.jsx` und `locales/de.js` in
  `index.html` hochzählen.
- Neuer Eintrag in `changelog.entries` (`locales/de.js`), da
  nutzersichtbare Änderung: kurzer Hinweis auf die neuen Reiseziel-
  Vorschläge.

## Nicht-Ziele

- Keine Geocoding-/Places-API, keine Netzwerkanfragen beim Tippen.
- Keine Validierung/Einschränkung der Eingabe auf Listenwerte – die Liste
  ist nur eine Erleichterung, kein Zwang.
- Keine Änderung an `js/share-link.js`, `js/local-plans.js` oder
  `SHARE_VERSION` (Reiseziel-Felder sind ohnehin nicht persistiert).
