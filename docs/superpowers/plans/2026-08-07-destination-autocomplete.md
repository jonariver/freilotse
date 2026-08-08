# Autovervollständigung für Reiseziel-Felder – Implementierungsplan

> **Status: umgesetzt und ausgeliefert** (7. August 2026). Commits `cefe96f`
> (Vorschlagsliste), `0bc4511` (Feature), `9cdcb9c` (Changelog); Nachbesserung
> am 8. August 2026 in `ea79b59` (3-Zeichen-Schwelle, mehr Ziele,
> Hinweis-Icon). Changelog-Einträge „Trip-Links bei langen freien Zeiträumen"
> vom 7. August und „Verbesserungen bei den Reiseziel-Vorschlägen" vom
> 8. August 2026 (`locales/de.js`, `changelog.entries`).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Beim Tippen in das globale Reiseziel-Feld und in die
Pro-Zeitraum-Reiseziel-Felder sollen Vorschläge aus einer mitgelieferten
Liste gängiger Reiseziele erscheinen, um Tippfehler zu vermeiden.

**Architecture:** Ein natives HTML5 `<datalist id="destination-suggestions">`
wird einmal gerendert (im selben bedingten Block wie das globale
Reiseziel-Feld) und über das Attribut `list="destination-suggestions"` von
beiden bestehenden Input-Feldern referenziert. Die Vorschlagsliste selbst
ist ein neuer Locale-Schlüssel `t("results.destinationSuggestions")`
(Array aus Strings) in `locales/de.js`. Keine neue Netzwerkanfrage, keine
neue JS-Matching-Logik – der Browser übernimmt Filterung und Anzeige.

**Tech Stack:** Reines React über globale `React`/`ReactDOM`, JSX per
Babel-Standalone im Browser, kein Build/Bundler, kein Testrunner im Repo.
"Testen" bedeutet hier: `index.html` im Browser öffnen und das Feature
manuell prüfen (siehe CLAUDE.md, Abschnitt zu UI-Änderungen).

## Global Constraints

- Kein Bundler, kein Modulsystem, keine ES-Module – `app.jsx` bleibt ein
  klassisches `<script type="text/babel">`.
- Alle sichtbaren Texte ausschließlich über `t(key, params)` aus
  `locales/de.js`, keine deutschen String-Literale direkt in `app.jsx`.
- Nach jeder Änderung an `app.jsx` bzw. `locales/de.js` die zugehörige
  Cache-Busting-Version (`?v=…`) in `index.html` hochzählen.
- Jede nutzersichtbare Änderung bekommt automatisch einen Eintrag in
  `changelog.entries` (`locales/de.js`).
- Keine Geocoding-/Places-API, keine Netzwerkanfrage beim Tippen (siehe
  Spec `docs/superpowers/specs/2026-08-07-destination-autocomplete-design.md`).
- Felder bleiben reines Freitext-Input – keine Validierung/Einschränkung
  auf Listenwerte.
- Keine Änderung an `js/share-link.js`, `js/local-plans.js` oder
  `SHARE_VERSION`.

---

### Task 1: Vorschlagsliste in `locales/de.js` ergänzen

**Files:**
- Modify: `locales/de.js:843` (Block `results.*`, direkt nach
  `destinationPeriodAriaLabel`)

**Interfaces:**
- Produces: `t("results.destinationSuggestions")` → `string[]` (Array aus
  ca. 128 Reisezielnamen), wird in Task 2 aus `app.jsx` gelesen.

- [x] **Step 1: Neuen Schlüssel ergänzen**

In `locales/de.js` direkt nach Zeile 843
(`destinationPeriodAriaLabel: "Reiseziel für diesen Zeitraum (überschreibt das Feld oben)",`)
einfügen:

```js
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
```

- [x] **Step 2: Manuell prüfen**

`locales/de.js` im Editor öffnen, sicherstellen, dass die Datei weiterhin
gültiges JS ist (Kommas/Klammern rund um die neuen Zeilen korrekt, keine
doppelten Einträge). Ein vollständiger Ladecheck im Browser erfolgt in
Task 2, Step 5.

- [x] **Step 3: Commit**

```bash
git add locales/de.js
git commit -m "$(cat <<'EOF'
Vorschlagsliste für Reiseziel-Autovervollständigung ergänzen

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Datalist rendern und beide Reiseziel-Felder verbinden

**Files:**
- Modify: `app.jsx:2251-2257` (globaler Reiseziel-Feld-Block)
- Modify: `app.jsx:2343` (Pro-Zeitraum-Reiseziel-Input)
- Modify: `index.html:85` und `index.html:113` (Cache-Busting-Versionen)

**Interfaces:**
- Consumes: `t("results.destinationSuggestions")` (`string[]`, aus Task 1).
- Produces: keine neuen Funktionen/States – rein deklarative JSX-Änderung.

- [x] **Step 1: `<datalist>` direkt nach dem globalen Eingabefeld ergänzen**

In `app.jsx` den bestehenden Block (Zeilen 2251–2257):

```jsx
            {result.periods.length > 0 && (
              <div className="mb-3 max-w-xs">
                <label htmlFor="trip-destination" className={labelCls}>{t("results.destinationLabel")}</label>
                <input id="trip-destination" type="text" className={inputCls}
                  value={tripDestination} onChange={(e) => setTripDestination(e.target.value)}
                  placeholder={t("results.destinationPlaceholder")} />
              </div>
            )}
```

ersetzen durch:

```jsx
            {result.periods.length > 0 && (
              <div className="mb-3 max-w-xs">
                <label htmlFor="trip-destination" className={labelCls}>{t("results.destinationLabel")}</label>
                <input id="trip-destination" type="text" className={inputCls}
                  list="destination-suggestions"
                  value={tripDestination} onChange={(e) => setTripDestination(e.target.value)}
                  placeholder={t("results.destinationPlaceholder")} />
                <datalist id="destination-suggestions">
                  {t("results.destinationSuggestions").map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
            )}
```

(Einzige Änderungen: neues `list="destination-suggestions"`-Attribut auf
dem `<input>` sowie das neue `<datalist>`-Element direkt danach.)

- [x] **Step 2: Pro-Zeitraum-Feld mit derselben Datalist verbinden**

In `app.jsx` Zeile 2343 (`<input type="text" className={`${inputSmCls}
max-w-xs`}`) das `list`-Attribut ergänzen:

```jsx
                        <input type="text" className={`${inputSmCls} max-w-xs`}
                          list="destination-suggestions"
                          value={perPeriodDestination[p.s] ?? ""}
                          onChange={(e) => setPerPeriodDestination((prev) => ({ ...prev, [p.s]: e.target.value }))}
                          aria-label={t("results.destinationPeriodAriaLabel")}
                          placeholder={t("results.destinationPeriodPlaceholder", { fallback: tripDestination })} />
```

Ein `<datalist>` kann von beliebig vielen Inputs per `id` referenziert
werden – es muss hier keine zweite Datalist gerendert werden, solange die
aus Step 1 im DOM vorhanden ist (sie wird immer gemeinsam mit den
Trip-Link-Buttons sichtbar, also genau dann, wenn auch das Pro-Zeitraum-
Feld existiert).

- [x] **Step 3: Cache-Busting-Version hochzählen**

In `index.html` Zeile 113 `app.jsx?v=33` auf `app.jsx?v=34` ändern und
Zeile 85 `locales/de.js?v=25` auf `locales/de.js?v=26` ändern.

- [x] **Step 4: Manuell im Browser prüfen**

`index.html` im Browser öffnen (lokaler Static-Server, z. B. `python -m
http.server` im Repo-Root). Dann:

1. In den Profi-Modus wechseln, ein Bundesland/Jahr wählen, bei dem
   mindestens ein Zeitraum ≥ 3 Tage entsteht (Standardkonfiguration
   reicht meist).
2. Im globalen Reiseziel-Feld oben "Ro" eintippen → Browser-eigenes
   Vorschlags-Dropdown erscheint mit u. a. "Rom"; Auswahl per Klick oder
   Pfeiltasten+Enter übernimmt "Rom" ins Feld.
3. Im Pro-Zeitraum-Feld eines Zeitraums "Mai" eintippen → Vorschlag
   "Mailand" erscheint ebenfalls.
4. Freitext eingeben, der in keinem Vorschlag vorkommt (z. B.
   "Musterstadt") → Eingabe bleibt möglich, kein Fehler, kein
   erzwungenes Zurücksetzen.
5. Browser-Konsole während der gesamten Prüfung offen halten – keine
   Fehler/Warnungen (insbesondere keine `⚠ <key>`-Ausgabe für den neuen
   Locale-Schlüssel).

- [x] **Step 5: Commit**

```bash
git add app.jsx index.html
git commit -m "$(cat <<'EOF'
Autovervollständigung für Reiseziel-Felder ergänzen

Natives <datalist> mit mitgelieferter Vorschlagsliste, verbunden mit dem
globalen und den Pro-Zeitraum-Reiseziel-Feldern. Keine Netzwerkanfrage,
keine Validierungspflicht – reine Tippfehler-Erleichterung.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Changelog-Eintrag ergänzen

**Files:**
- Modify: `locales/de.js` (Eintrag `date: "7. August 2026"`, Array
  `items`)

**Interfaces:**
- Consumes: keine (reine Textänderung, kein Code-Interface betroffen).

- [x] **Step 1: Dritten Stichpunkt zum bestehenden Eintrag vom 7. August
  2026 ergänzen**

Den bestehenden Eintrag (aktuell mit zwei Stichpunkten zu Trip-Links und
Pro-Zeitraum-Reiseziel) um einen dritten Stichpunkt erweitern:

```js
            "Die Reiseziel-Felder schlagen jetzt beim Tippen passende Ziele vor (z. B. große Städte und beliebte Urlaubsorte), um Tippfehler zu vermeiden.",
```

- [x] **Step 2: Manuell prüfen**

Im Browser die Seite `/neuigkeiten` öffnen, den Eintrag vom 7. August 2026
mit allen drei Stichpunkten sichten, keine Konsolenfehler.

- [x] **Step 3: Commit**

```bash
git add locales/de.js
git commit -m "$(cat <<'EOF'
Changelog: Hinweis auf Reiseziel-Autovervollständigung ergänzen

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
