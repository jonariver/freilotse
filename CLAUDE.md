# CLAUDE.md

> Falls im Repo bereits eine `CLAUDE.md` existiert, den folgenden Abschnitt dort
> einfügen statt die Datei zu ersetzen.

## Projektüberblick

React-App über globale `React`/`ReactDOM`, JSX per Babel-Standalone im
Browser – **kein Build/Bundler, kein TypeScript, keine ES-Module**. Seit dem
Modul-Refactoring ist die Anwendung auf mehrere `<script>`-Dateien aufgeteilt
(siehe Abschnitt „Architektur/Module" weiter unten); `app.jsx` bleibt die
zentrale Komponentendatei (`Urlaubsplaner`, `App`) und lädt die übrigen Module
zuletzt.
Der gesamte Urlaubsplan ist eine **reine Ableitung**: `plan(days, cfg)` berechnet
alles aus den Eingaben. Es gibt **keine** separaten Listen manueller/automatischer
Tage.

- **Manuelle Tage** leben in `overrides`: Map `"JAHR:m-d" → "vac" | "ot" | "none"`
  (`vac` = Urlaub, `ot` = Überstundenabbau, `none` = entfernt/gesperrt, bleibt
  Arbeitstag und wird von der Automatik nicht belegt).
- **Automatische Tage** stammen aus `plan()` (`result.sel[]` + `origin[]`) und
  werden **nicht** persistiert, sondern deterministisch neu berechnet.
- **Halbe Tage** ergeben sich aus `xmasRule` (24./31.12.), nicht aus einer
  beliebigen Tagesdauer.
- Ein Datum kann **nicht** gleichzeitig Urlaub und Überstundenabbau sein
  (ein Map-Key → ein Wert).
- **Regelmäßige Arbeitstage** (`workingWeekdays`, Standard Montag–Freitag)
  bestimmen, an welchen Wochentagen überhaupt ein Urlaubstag benötigt würde –
  siehe eigener Abschnitt „Regelmäßige Arbeitstage" weiter unten.

## Architektur/Module

Kein Modulsystem (kein `import`/`export`, keine ES-Module) und kein Bundler –
jede Datei ist ein eigenes klassisches `<script>`-Tag. Da klassische
`<script>`-Tags sich dieselbe globale lexikalische Umgebung teilen, ist jede
Datei in eine **IIFE** gekapselt und hängt ihre öffentliche Oberfläche
explizit an einen `window.FREILOTSE.*`-Namespace, statt eigene `const`/`let`
auf oberster Ebene zu deklarieren (das würde bei mehrfacher Deklaration
desselben Namens in verschiedenen Dateien sonst zu einem `SyntaxError`
führen). `app.jsx` holt sich die benötigten Funktionen/Komponenten direkt zu
Beginn per Kurzschreibweise zurück, z. B. `const { plan, minimalBridgeBudget }
= window.FREILOTSE.planning;` – dadurch bleiben alle bestehenden Aufrufstellen
innerhalb von `app.jsx` unverändert (keine Umbenennungen).

### Dateien und Zuständigkeiten

| Datei | Namespace | Inhalt |
|---|---|---|
| `locales/de.js` | `window.I18N` | Übersetzungen/Fallback-Texte, `t(key, params)` (siehe Abschnitt „Internationalisierung" unten). Muss als Erstes geladen werden. |
| `js/planning.js` | `window.FREILOTSE.planning` | `plan()`, `minimalBridgeBudget()`. Rein deterministisch: kein React, kein DOM, kein `fetch()`, keine Abhängigkeit von `window.I18N`. |
| `js/calendar.js` | `window.FREILOTSE.calendar` | `DAY`, `easterUTC()`, `holidayMap()`, `buildDays()`, `vacationDayMap()`. Reine Kalenderlogik ohne Netzwerkzugriff. `holidayMap`/`buildDays`/`vacationDayMap` erhalten die Übersetzungsfunktion `t` als **Parameter** (z. B. `buildDays(year, st, xmasRule, extHolidays, t, workingWeekdays)`) statt selbst auf `window.I18N` zuzugreifen. `workingWeekdays` ist optional (Fallback Montag–Freitag) – siehe Abschnitt „Regelmäßige Arbeitstage". |
| `js/data-sources.js` | `window.FREILOTSE.dataSources` | Anbindung externer Quellen: `loadPublicHolidays(year, stateCode)` (OpenHolidays-API-Endpunkt `PublicHolidays`; liefert `{ status: "api"\|"lokal", holidays }` – bei `"lokal"` greift der Aufrufer auf die integrierte Berechnung `holidayMap()` zurück; nur landesweite bzw. exakt zum Bundesland passende Einträge, kommunale Sonderfälle wie das Augsburger Friedensfest mit Subdivision `DE-BY-AU` werden herausgefiltert), `loadSchoolHolidays()`, Normalisierer `normalizeOpenHolidaysPeriod`/`normalizeSchulferienApiPeriod`. Kein React, keine Abhängigkeit von `window.I18N`. |
| `js/share-link.js` | `window.FREILOTSE.shareLink` | Gesamte Share-Link-Logik (siehe Abschnitt „Share-Link-Funktion" unten). `validateSharePayload`/`decodeShare` erhalten bekannte Bundesland-Codes als Parameter (`knownStateCodes`) statt direkt auf `STATES` zuzugreifen. |
| `js/local-plans.js` | `window.FREILOTSE.localPlans` | Reine Speicherhülle für mehrere benannte, lokal gespeicherte Pläne (siehe Abschnitt „Lokales Speichern mehrerer Pläne" unten). `STORAGE_KEY`, `MAX_PLANS`, `makeId()`, `makePlan()`, `findPlan()`, `parseStore()`, `serializeStore()`, `addPlan()`, `updatePlanPayload()`, `renamePlan()`, `removePlan()`, `setActivePlanId()`. Kein `localStorage`-Zugriff im Modul selbst (bleibt in `app.jsx`). |
| `js/puzzle.js` | `window.FREILOTSE.puzzle` | Deterministische Erzeugung des täglichen Brückentage-Rätsels (siehe Abschnitt „Brückentage-Rätsel des Tages" unten). `generateDailyPuzzle()`, `longestFreeRun()`, `buildEmojiWindow()`, `puzzleNumber()`, `isFreeDay()` sowie die nach Veröffentlichung eingefrorenen Konstanten `STATE_CODES`, `LAUNCH_DATE_KEY`, `MAX_ATTEMPTS`, `QUALITY_MARGIN`, `EMOJI_WINDOW_SIZE`. **Einzige Ausnahme** von der sonst abhängigkeitsfreien Modul-Reihenfolge: setzt `window.FREILOTSE.calendar` und `window.FREILOTSE.planning` voraus. |
| `js/puzzle-stats.js` | `window.FREILOTSE.puzzleStats` | Reine Speicherhülle für die Rätsel-Statistik (Streak, Verlauf) – Muster identisch zu `js/local-plans.js`. `STORAGE_KEY`, `MAX_HISTORY`, `defaultStats()`, `parseStats()`, `serializeStats()`, `yesterdayKey()`, `hasPlayedToday()`, `getTodayResult()`, `recordResult()`. |
| `jsx/common-components.jsx` | `window.FREILOTSE.ui` | `CollapsibleCard`, `InfoHint`, `PortalChoiceDialog` (gemeinsame Hülle der Flug-/Unterkunfts-Portalauswahl, siehe Abschnitt „Trip-Links"). |
| `jsx/support-components.jsx` | `window.FREILOTSE.ui` | `internalNavigate`, `SiteLink`, `HeartIcon`, `SupportFooterLink`, `SupportFloatingButton`, `SiteFooter` (Site-Chrome + PayPal-Unterstützung, eng gekoppelt). |
| `jsx/landing-page.jsx` | `window.FREILOTSE.ui` | `ExplainerVideoSection`, `LandingPage`. Nutzt `SiteFooter` aus `support-components.jsx`. |
| `jsx/legal-pages.jsx` | `window.FREILOTSE.ui` | `LegalLayout`, `LegalSection`, `ExternalLegalLink`, `ProviderDetailsImage`, `ImpressumPage`, `DatenschutzPage`. Nutzt `SiteLink`/`SiteFooter` aus `support-components.jsx`. |
| `jsx/about-page.jsx` | `window.FREILOTSE.ui` | `AboutPage` (Seite „Über FREILOTSE" unter `/ueber-freilotse`). Nutzt `SiteLink`/`SiteFooter`/`PAYPAL_URL` aus `support-components.jsx`. Anders als `LegalLayout` bewusst **ohne** „noindex" (soll indexierbar sein) und mit eigenem, lokalem Dark/Light-State (kein Zugriff auf den Dark-State von `Urlaubsplaner`, da eigenständig über `App()` geroutet). |
| `jsx/changelog-page.jsx` | `window.FREILOTSE.ui` | `ChangelogPage` (Seite „Neuigkeiten" unter `/neuigkeiten`). Nutzt `SiteLink`/`SiteFooter` aus `support-components.jsx`. Analog zu `about-page.jsx` bewusst **ohne** „noindex" (soll indexierbar sein) und mit eigenem, lokalem Dark/Light-State. |
| `jsx/guide-page.jsx` | `window.FREILOTSE.ui` | `GuidePage` (Seite „Anleitung" unter `/anleitung`). Nutzt `SiteLink`/`SiteFooter` aus `support-components.jsx`. Analog zu `about-page.jsx`/`changelog-page.jsx` bewusst **ohne** „noindex" und mit eigenem, lokalem Dark/Light-State. Inhalt liegt vollständig in `locales/de.js` unter `guide.sections` (Array aus `{ heading, body[] }`), reines Datenobjekt ohne eigene Rendering-Logik in der Seite selbst. |
| `jsx/puzzle-page.jsx` | `window.FREILOTSE.ui` | `PuzzlePage` (Seite „Brückentage-Rätsel des Tages" unter `/raetsel`, siehe eigener Abschnitt unten). Nutzt `SiteLink`/`SiteFooter` aus `support-components.jsx` sowie `js/puzzle.js`/`js/puzzle-stats.js`. Analog zu `about-page.jsx` bewusst **ohne** „noindex" und mit eigenem, lokalem Dark/Light-State. |
| `app.jsx` | – (Wurzel) | `Urlaubsplaner` (zentrale Komponente, bewusst nicht weiter aufgeteilt – zu große/kritische Prop-Kette), `App` (Routing), Rendering-Helfer (`fmtNum`, `dayClass`, `dayTitle` u. Ä.), Mount (`ReactDOM.createRoot(...).render(...)`). |

### Erforderliche Ladereihenfolge (siehe `index.html`)
1. `locales/de.js`
2. `js/planning.js`, `js/calendar.js`, `js/data-sources.js`, `js/share-link.js`,
   `js/local-plans.js`, `js/puzzle.js`, `js/puzzle-stats.js` (Reihenfolge
   untereinander größtenteils unkritisch – **Ausnahme:** `js/puzzle.js` setzt
   `js/calendar.js` und `js/planning.js` voraus und muss deshalb nach beiden
   stehen)
3. `jsx/common-components.jsx`, dann `jsx/support-components.jsx` (wird von den
   folgenden genutzt), dann `jsx/landing-page.jsx`, `jsx/legal-pages.jsx`,
   `jsx/about-page.jsx`, `jsx/changelog-page.jsx`, `jsx/guide-page.jsx` und
   `jsx/puzzle-page.jsx` (Reihenfolge dieser sechs untereinander unkritisch;
   `jsx/puzzle-page.jsx` benötigt zusätzlich `js/puzzle.js`/`js/puzzle-stats.js`,
   die bereits in Schritt 2 geladen wurden)
4. `app.jsx` (mountet die Anwendung, muss zuletzt laden)

Bei Änderungen an einer dieser Dateien die Cache-Busting-Version in
`index.html` (`?v=…`) hochzählen. Weiterhin **kein** Bundler, **kein**
npm-basierter Build-Schritt – jede Datei bleibt ein direkt ladbares
`<script>` (JS-Dateien ohne JSX regulär, JSX-Dateien über
`type="text/babel" data-presets="react"`).

## Regelmäßige Arbeitstage

### Zweck und Abgrenzung
Nutzer können festlegen, an welchen Wochentagen sie regelmäßig arbeiten (z. B.
Montag–Freitag, Montag–Donnerstag, Dienstag–Samstag, einzelne Tage), damit
insbesondere regelmäßige Teilzeitmodelle korrekt berechnet werden.
**Ausdrücklich nicht** abgedeckt: wechselnde Schichten, rollierende
Dienstpläne, wochenabhängige Arbeitszeiten, konkrete Stunden pro Tag,
Teilzeitquoten oder halbe reguläre Arbeitstage. Für all das müsste
`workingWeekdays` durch ein grundsätzlich anderes, wochenbezogenes Modell
ersetzt werden – das aktuelle Format (ein einziges, dauerhaft gültiges Array
von Wochentagen) ist dafür bewusst **nicht** vorgesehen und sollte dafür auch
nicht zweckentfremdet werden.

### Zustand und Format
`workingWeekdays`: **ein** gemeinsamer State für Einfach- und Profi-Modus
(wie `vac`, `st`, `blocks` usw.) – Array von Wochentags-Indizes wie
`Date.getUTCDay()` (`0` = Sonntag … `6` = Samstag), z. B. `[1,2,3,4,5]` für
Montag–Freitag (Standard). Reihenfolge im Array ist beliebig, wird aber beim
Setzen/Teilen aufsteigend sortiert. Mindestens ein Eintrag ist Pflicht – die
UI verhindert das Abwählen des letzten verbleibenden Arbeitstags (kein
Fehlerzustand, kein leeres Array möglich). Ein Moduswechsel Einfach ↔ Profi
liest/schreibt denselben State, die Auswahl geht dabei nie verloren.

### Verwendung in `buildDays()`
`buildDays(year, st, xmasRule, extHolidays, t, workingWeekdays)`
(`js/calendar.js`) erzeugt pro Tag zusätzlich zu `weekend` (tatsächliches
Kalenderwochenende, bleibt für Darstellung/echte Wochenend-Erkennung
erhalten) das Feld `isWorkingDay` (persönlicher regulärer Arbeitstag laut
`workingWeekdays`, unabhängig davon, ob der Wochentag ein Kalenderwochenende
ist). Kostenregel (ersetzt die frühere feste Annahme Montag–Freitag):

```js
let cost = 1;
if (!isWorkingDay || holiday) cost = 0;
else if (special) cost = xmasRule === "0" ? 0 : xmasRule === "50" ? 0.5 : 1;
```

Daraus folgt automatisch – ohne separaten Sonderfall –, dass die
24./31.12.-Regel nur an persönlichen Arbeitstagen greift; an einem
persönlich freien 24.12./31.12. ist `cost` immer `0`. Fehlt `workingWeekdays`
oder ist es leer, fällt `buildDays()` auf Montag–Freitag zurück (identisches
Verhalten wie vor dieser Erweiterung). `plan()`/`minimalBridgeBudget()`
(`js/planning.js`) bleiben **unverändert** – sie arbeiten ausschließlich mit
den von `buildDays()` bereits korrekt berechneten `cost`-Werten und kennen
`workingWeekdays` selbst nicht.

Feiertagsbezogene Kennzahlen (`countHolidaysInPeriods()`,
`periodWorkingDayHolidayCount`, Feiertagsbeschreibungen in `blockReason()`)
zählen einen Feiertag nur dann als „gespart"/„genutzt", wenn er auf einen
Tag mit `isWorkingDay === true` fällt – unabhängig vom kalendarischen
Wochentag (auch ein Feiertag an einem persönlichen Arbeitssamstag/-sonntag
zählt). Die Anzeige eines Feiertags (z. B. in der Monatszusammenfassung)
bleibt davon getrennt: `monthSummary()` zeigt unabhängig vom persönlichen
Arbeitsstatus immer alle Feiertage des Monats (reine Kalenderinformation,
keine Erfolgskennzahl). Die frühere Einstellung „Feiertage an
Samstag/Sonntag einbeziehen" (State `showWeekendHolidays`) wurde ersatzlos
entfernt, da seit `workingWeekdays` ausschließlich `isWorkingDay` und nicht
mehr der kalendarische Wochentag über Darstellung und Kennzahl entscheidet.

### Share-Link (optional, rückwärtskompatibel)
Kompaktes, optionales Feld `ww` in `state` (z. B. `"ww": [1,2,3,4,5]`),
verarbeitet in `js/share-link.js`. `SHARE_VERSION` bleibt unverändert – das
Feld ist rein additiv. **Alte Links ohne `ww`** (vor dieser Erweiterung
erzeugt) laden weiterhin einwandfrei und verwenden automatisch
Montag–Freitag, **ohne** den bestehenden Warnhinweis auszulösen (kein
korrigierter Zustand, sondern erwartetes Verhalten für ältere Links). Ist
`ww` vorhanden, aber kein Array, enthält ungültige/doppelte Werte oder ist
nach Bereinigung leer, wird auf Montag–Freitag zurückgesetzt **und** der
bestehende Warnmechanismus (`warning: true`) ausgelöst.

## Share-Link-Funktion

### Zweck
Aktuellen Planungsstand über einen teilbaren Link weitergeben – ohne Backend,
lauffähig auf GitHub Pages.

### Speicherort der Logik
- Reine Helfer in `js/share-link.js` (Namespace `window.FREILOTSE.shareLink`,
  siehe Abschnitt „Architektur/Module" oben): `bytesToB64url` / `b64urlToBytes`,
  `isValidMd`, `buildSharePayload`, `encodePlain`, `decodeShare`,
  `validateSharePayload`, `readShareFragment`, `deflateToB64url`/
  `inflateFromB64url`, `getHashParam` sowie die Konstanten `SHARE_VERSION`,
  `SHARE_MAX_URL`, `SHARE_MAX_DECODED`, `SHARE_MAX_OVERRIDES`,
  `SHARE_MAX_BLOCKS`, `HAS_COMPRESSION`. `validateSharePayload`/`decodeShare`
  erhalten bekannte Bundesland-Codes als Parameter, statt selbst auf `STATES`
  zuzugreifen – `app.jsx` übergibt dafür sein eigenes `STATE_CODES`.
- In der Komponente (`app.jsx`, `Urlaubsplaner`): `buildShareUrl`,
  `handleShare`, `copyFromModal`, `showToast`, ein Mount-`useEffect`
  (Lade-Hinweis + Fragment-Bereinigung), Header-Button „Planung teilen",
  Fallback-Kopier-Dialog (`copyUrl`) und Toast (`toast`).

### Datenformat (Version 1)
Kodierung: `base64url(UTF-8(JSON))` im **URL-Fragment**: `…/#plan=<code>`.
Fragment, weil es auf GitHub Pages ohne Backend funktioniert und nicht an den
Server übertragen wird. Kodiert ≠ verschlüsselt.

Es werden **nur Eingaben** gespeichert (kompakte Kurzfelder):

```jsonc
{
  "version": 1,
  "state": {
    "y": 2027, "st": "BY", "vac": 30, "ot": 5, "x": "50",   // Jahr, Land, Kontingente, 24./31.12.-Regel
    "m": "profi", "g": "free", "ss": 0,                       // uiMode, simpleGoal, simpleStarted
    "sh": "avoid",                                            // Schulferien-Präferenz
    "av": "", "ao": "0", "sf": "vac", "af": 0,                // Auto-Budget/-Optionen
    "b": [["16","","" ],["9","",""]],                         // Wunschblöcke [len, month, ot]
    "ov": { "v": ["4-14"], "o": ["5-4"], "n": ["6-1"] },      // manuelle Tage: vac / ot / none (Keys "m-d")
    "ww": [1, 2, 3, 4, 5]                                     // optional: regelmäßige Arbeitstage, siehe unten
  }
}
```

`ww` (regelmäßige Arbeitstage) ist **optional** und rückwärtskompatibel –
siehe eigener Abschnitt „Regelmäßige Arbeitstage" oben für Format,
Validierung und das Verhalten bei alten Links ohne dieses Feld.

`wh` (ehemals „Feiertage an Samstag/Sonntag einbeziehen") wird seit Entfernen
dieser Einstellung **nicht mehr erzeugt**. Historische Links können `wh` noch
enthalten (Werte `0`/`1`/`false`/`true`); dieses Feld wird beim Laden
stillschweigend **ignoriert** – keine Warnung, kein Einfluss auf die übrige
Validierung, `SHARE_VERSION` bleibt unverändert. Seit der Umstellung
entscheidet für Feiertage ausschließlich `day.isWorkingDay` (siehe Abschnitt
„Regelmäßige Arbeitstage"), nicht mehr der kalendarische Wochentag.

Bewusst **nicht** gespeichert (weil ableitbar bzw. UI-lokal): Feiertage,
Schulferien, `days`, das Planungsergebnis, sowie `dark`, `panels`, `clickMode`,
`drag`, `dialogDay`, `vacTip`, `showSimpleCal`. Keine personenbezogenen Daten.

### Versionierungsstrategie (SHARE_VERSION)
`validateSharePayload()` lehnt jeden Payload mit abweichender `version` hart
ab (`if (payload.version !== SHARE_VERSION) return null;`, `js/share-link.js`)
– es gibt **keine** Versions-Dispatch-/Migrationslogik. Das ist eine bewusste,
dokumentierte Entscheidung (YAGNI), keine übersehene Lücke:

- **Grundregel: additiv-only für immer.** Jede neue Einstellung wird als
  optionales Feld mit einem Default ergänzt, der das Ergebnis für Links/
  Pläne **ohne** dieses Feld exakt auf das Verhalten **vor** Einführung der
  Einstellung zurückführt (Beispiel `ww`, siehe oben: fehlt es, gilt
  Montag–Freitag – identisch zum Verhalten vor der Funktion
  „Regelmäßige Arbeitstage"). Solange das gelingt, bleibt `SHARE_VERSION`
  unverändert, auch bei größeren neuen Features.
- **Für den (bislang nie eingetretenen) Fall einer echten Bedeutungsänderung**
  einer bestehenden Einstellung (nicht nur eines neuen Feldes) gilt die
  Selbstverpflichtung: `SHARE_VERSION` wird erhöht **und zum selben
  Zeitpunkt** eine Versions-Dispatch-Logik in `validateSharePayload()`/
  `decodeShare()` ergänzt, die Version 1 weiterhin korrekt interpretiert –
  kein ersatzloses Verwerfen alter Links. Diese Logik wird bewusst **nicht
  im Voraus** gebaut, da ihre konkrete Form vom tatsächlichen Bruch abhängt
  und sich vorher nicht sinnvoll entwerfen lässt.
- **Gilt identisch für lokal gespeicherte Pläne** (siehe Abschnitt „Lokales
  Speichern mehrerer Pläne" unten): `payload` dort ist strukturgleich zur
  Share-Link-Hülle und durchläuft dieselbe `validateSharePayload()`-Prüfung.
  Lokale Pläne sind potenziell noch länger im Umlauf als Share-Links – die
  additiv-only-Regel gilt für sie ohne Ausnahme genauso.
- Scheitert die Validierung heute schon (z. B. kaputter/fremder Payload):
  kein Absturz. Ein Share-Link zeigt einen Lade-Fehler-Toast; ein lokaler
  Plan bleibt in „Meine Pläne" sichtbar gelistet (nur die äußere Hülle wird
  von `local-plans.js` geprüft), scheitert aber beim Öffnen mit einem
  eigenen Fehler-Toast – kein stiller Datenverlust, auch ohne Migration.

### Urlaub vs. Überstunden, manuell vs. automatisch
- **Urlaub/Überstunden** werden über den Override-Wert unterschieden (`vac`/`ot`),
  in `ov.v` bzw. `ov.o` abgelegt; Datumsformat der Tage effektiv `YYYY-MM-DD`
  (im Link als kompaktes `"m-d"`, das Jahr steht in `y`).
- **Manuell** = alles in `ov` (wird gespeichert und beim Laden 1:1 gesetzt).
  **Automatisch** = wird aus denselben Eingaben deterministisch neu berechnet.
- Entfernte/gesperrte Tage = `ov.n` (Typ „none", gilt für Urlaub und Überstunden
  gleichermaßen; der Tag bleibt Arbeitstag).

### Konfliktregeln
- Dasselbe Datum in mehreren Kategorien (`v`/`o`/`n`) → **beide verworfen**, kein
  stillschweigendes Überschreiben, Hinweis-Flag (`warning=true`) → Toast
  „…teilweise geladen".
- Doppelte Datumswerte innerhalb einer Kategorie → dedupliziert.
- Manuell hat Vorrang: Ein Override belegt den Tag in Phase 0 von `plan()`; die
  Automatik kann ihn nicht überschreiben (weder Auto-Urlaub auf manuellem
  Überstundentag noch umgekehrt).

### Kontingent-Validierung
Urlaubs- und Überstundenkontingent bleiben getrennt (`budget.vac`/`budget.ot`)
und werden **nicht** verrechnet. `plan()` setzt manuelle Tage nur, solange das
jeweilige Budget reicht; nicht mehr passende manuelle Tage erhöhen `failedManual`
und lösen im UI den bestehenden roten Hinweis aus. Werte werden beim Dekodieren
auf `0…366` begrenzt.

### Verhalten beim Laden
`readSharedPlan(location.hash)` wird **einmal synchron als erster Hook** gelesen;
alle betroffenen `useState` werden direkt daraus initialisiert. Dadurch gibt es
**keinen Flash und keine Race Condition** – keine Standardwerte oder Effekte
überschreiben den geladenen Zustand. Feiertage/Schulferien werden über die
bestehenden Effekte (`year`, `st`) nachgeladen; der Plan wird deterministisch neu
berechnet. Nach dem Laden: Toast („Geteilte Planung wurde geladen." / „…teilweise
geladen." / bei kaputtem `#plan=`: „…konnte nicht vollständig geladen werden.")
und Entfernen des Fragments via `history.replaceState`.

Validierung: Version, Jahr (1970–2100), bekanntes Bundesland, Enums
(`xmasRule`/`uiMode`/`simpleGoal`/`schoolHolidayPreference`/`spendFirst`),
`autoFrom` 0–11, echte Kalenderprüfung jedes `"m-d"` fürs Jahr, Deckelung von
Blöcken (≤20) und Overrides (≤400), Payload-Größe (≤100 000 Zeichen). Teilweise
gültige Links laden die gültigen Teile + Hinweis; vollständig ungültige/veraltete
Links werden ignoriert und die App startet normal. Links ohne `#plan=` funktionieren
unverändert.

### Teilen (Button)
`handleShare`: baut die URL → `navigator.share()` (falls verfügbar,
`AbortError` still) → sonst Clipboard-API („Link wurde kopiert.") → sonst
Fallback-Dialog mit markierbarem Eingabefeld + Kopier-Button (`execCommand`).
Datenschutzhinweis im Dialog: „Der Link enthält deine Planungseinstellungen.
Jeder mit diesem Link kann die Planung öffnen." Button ist in beiden Modi im
Header sichtbar, mit `aria-label`, Fokusring und Teilen-Icon.

### Einschränkungen
- **Linklänge**: praktische Obergrenze `SHARE_MAX_URL = 8000`; darüber
  Hinweis „Planung zu umfangreich für einen Link." (typische Pläne bleiben
  deutlich darunter).
- **Determinismus**: Automatische Tage werden neu berechnet und stimmen exakt
  überein, solange Feiertage/Schulferien für (Jahr, Bundesland) identisch geladen
  werden. Fällt eine API aus, greift die integrierte Feiertagsberechnung; sehr
  seltene Randfälle bei abweichenden externen Daten sind möglich. Manuelle Tage
  sind davon nie betroffen (sie werden explizit gespeichert).
- **Datenschutz**: keine Übertragung an zusätzliche Server; kein externer
  Shortener/Speicherdienst.
- Ein geteiltes Jahr außerhalb der Dropdown-Spanne (aktuelles Jahr … +4) wird
  korrekt geladen und gerechnet; nur das Jahr-Auswahlfeld zeigt es evtl. nicht an.

## Schulferien-Datenquellen

### Zweck und Charakter
Schulferien sind ausschließlich ein **Planungshinweis** (Kalenderanzeige,
Monatszusammenfassung, optionale Gewichtung bei der automatischen
Brückentage-Verteilung über `schoolHolidayPreference`). Sie fließen an keiner
Stelle in `plan()`s Kernberechnung der Urlaubs-/Überstundentage ein und werden
**nicht** im Share-Link gespeichert (siehe Abschnitt „Share-Link-Funktion“ –
bewusst nicht persistiert, da ableitbar und rein UI-lokal).

### Primär- und Ersatzquelle
- **Primärquelle**: OpenHolidays API
  (`https://openholidaysapi.org/SchoolHolidays?countryIsoCode=DE&subdivisionCode=DE-{Code}&languageIsoCode=DE&validFrom={Jahr}-01-01&validTo={Jahr}-12-31`).
  Liefert ein JSON-**Array direkt** (kein Wrapper-Objekt); Felder u. a.
  `startDate`/`endDate` (reine `YYYY-MM-DD`-Werte, **`endDate` inklusiv** –
  belegt durch Einträge mit `startDate === endDate`, z. B. „Buß- und Bettag“)
  sowie `name` als `[{ language, text }]`. Deckt laut Live-Test auch Jahre wie
  2029/2030 ab. Interne Bundeslandcodes (`BY`, `NW`, …) bleiben unverändert;
  nur für diese eine Anfrage wird daraus `DE-BY` etc.
- **Ersatzquelle** (automatisch, falls Primärquelle nicht erreichbar, HTTP-
  Fehler, kein gültiges Array, nur ungültige Einträge oder keine Ferien
  liefert): `https://schulferien-api.de/api/v1/{Jahr}/{Bundeslandcode}/`
  (unverändert wie zuvor). Felder `start`/`end` (ISO-Zeitstempel mit `Z`,
  **`end` ebenfalls inklusiv** – letzter Ferientag um 23:59Z) sowie
  `name`/`name_cp`. Deckt laut Anbieter nur 2022–2028 ab; für spätere Jahre
  liefert sie planmäßig keine Daten, wodurch OpenHolidays dort automatisch
  greift.
- Beide Antworten werden **unmittelbar nach dem Abruf** auf ein gemeinsames
  internes Format normalisiert: `{ start, end, name, source }`
  (`normalizeOpenHolidaysPeriod` / `normalizeSchulferienApiPeriod` in
  `js/data-sources.js`, Namespace `window.FREILOTSE.dataSources`). Die
  bestehende `vacationDayMap()` (`js/calendar.js`) verarbeitet ausschließlich
  diese normalisierten Objekte und musste inhaltlich nicht geändert werden.

### Status, Cache und Race Conditions
`vacStatus` unterscheidet fünf Zustände: `"laedt"` (wird geladen),
`"openholidays"` (Primärquelle erfolgreich), `"ersatz"` (Ersatzquelle
erfolgreich), `"keine"` (beide Quellen erreichbar, aber ohne verwertbare
Daten für Jahr+Bundesland) und `"fehler"` (beide Quellen technisch nicht
erreichbar). Ein leeres, aber technisch erfolgreiches Ergebnis zählt
ausdrücklich **nicht** als „Daten vorhanden“ (`hasVacationData` prüft sowohl
den Status als auch `vacations.length > 0`).

Der Cache (`vacCache`, Schlüssel `"Jahr-Bundesland"`) speichert je Kombination
sowohl die normalisierten Zeiträume als auch den tatsächlich verwendeten
Status; beim Zurückwechseln zu einer bereits geladenen Kombination erfolgt
kein erneuter Netzwerkaufruf. Ein `ignore`-Flag im Cleanup des `useEffect`
verhindert, dass eine verspätete Antwort nach einem zwischenzeitlichen
Jahres-/Bundeslandwechsel den neueren Zustand überschreibt (gleiches Muster
wie bei der Feiertagsabfrage).

### Verhalten ohne verwertbare Daten
Ohne Daten – auch **während des Ladens** – darf die gewählte
Schulferienpräferenz keinen Einfluss auf die Berechnung haben. Die Auswahl
selbst (`schoolHolidayPreference`) bleibt dabei erhalten; für `plan()` wird
stattdessen die abgeleitete `effectiveSchoolHolidayPreference` verwendet, die
bei fehlenden Daten fest auf `"neutral"` steht. Die drei Auswahloptionen
werden in diesem Fall in **beiden Modi** sichtbar deaktiviert
(`schoolPrefOptionsDisabled`), und ein dynamischer Hinweistext mit Bundesland
und Jahr (`schoolHolidays.notice.noData` bzw. `.unreachable`) erscheint direkt
unter der Auswahl.

### Anzeige der Quelle (Profi-Modus)
Im Panel „Allgemein“ steht direkt unter der Feiertagsquelle eine zweite Zeile
mit der tatsächlich verwendeten Schulferienquelle (`vacStatus`-abhängig: grün
= OpenHolidays, orange = Ersatzquelle, rot = keine Daten/nicht erreichbar,
neutral = wird geladen). Der Einfachmodus zeigt keine dauerhafte Quellenzeile,
sondern nur den Hinweis bei fehlenden Daten.

## Internationalisierung und UI-Texte

### Grundprinzip
FREILOTSE ist **Deutsch und Englisch** verfügbar, umschaltbar über einen
sichtbaren Sprachumschalter im Header (siehe Abschnitt „Sprachumschalter
(Header)" unten). Deutsch bleibt die Standardsprache beim ersten Besuch;
Englisch wird nur aktiv, wenn die Nutzer:in explizit umschaltet (Wahl wird in
`localStorage` gemerkt, siehe unten). Neue oder geänderte nutzersichtbare
Texte müssen ab jetzt **in beiden** Sprachdateien gepflegt werden.

### Speicherort der Übersetzungen
- `locales/de.js`: deutsche Sprachdatei (weiterhin die Referenzstruktur für
  Schlüssel). Definiert das globale Objekt `window.I18N` (keine ES-Module,
  kein Bundler – reines Script, kompatibel mit Babel-Standalone/GitHub Pages)
  mit:
  - der zentralen Funktion `t(key, params)`,
  - `setLocale(loc)` / `getLocale()`,
  - `registerLocale(loc, dict)` zur Registrierung weiterer Sprachen,
  - `LOCALES` (Objekt mit den registrierten Sprachwörterbüchern: `de`, `en`).
- `locales/en.js`: vollständige, aktive englische Übersetzung (gleiche
  Schlüsselstruktur und Funktionssignaturen wie `locales/de.js`), ruft am
  Dateiende `window.I18N.registerLocale("en", EN)` auf.
- `index.html` lädt `locales/de.js`, dann `locales/en.js`, beide als normale,
  synchron ausgeführte `<script>`-Tags **vor** `app.jsx` – `window.I18N` ist
  beim Start von `app.jsx` garantiert vorhanden, keine Race Condition, kein
  Flackern. Direkt danach liest ein kleines Inline-Bootstrap-Script die
  gespeicherte Sprachpräferenz (`localStorage["freilotse.locale.v1"]`) und
  ruft bei `"en"` sofort `window.I18N.setLocale("en")` auf, **bevor** irgendein
  weiteres Skript (insbesondere die `js/*`- und `jsx/*`-Module) lädt – das ist
  Voraussetzung dafür, dass beim Modul-Laden berechnete Konstanten (z. B.
  `COUNTRIES`, `STATES`, `TRIP_CITY_IDS` in `app.jsx`) bereits in der
  richtigen Sprache entstehen. Dasselbe Bootstrap-Script setzt außerdem
  `document.documentElement.lang = window.I18N.getLocale()`.
- `app.jsx` definiert direkt zu Beginn `const t = window.I18N.t;` und nutzt ab
  dort ausschließlich `t(...)` für sichtbare Texte.

### Verbindliche Regel für alle künftigen Änderungen
- Neue oder geänderte **nutzersichtbare** Texte dürfen **nicht** direkt als
  String-Literal in `app.jsx` oder künftigen Komponenten stehen.
- Sämtliche UI-Texte müssen als **semantisch benannte** Schlüssel in
  `locales/de.js` gepflegt und ausschließlich über `t(key, params)` ausgegeben
  werden. Das gilt insbesondere für:
  - Buttons, Überschriften, Labels, Auswahloptionen,
  - Tooltips, `title`-Attribute, `aria-label` und sonstige Accessibility-Texte,
  - Toasts, Dialoge, Bestätigungs- und Fehlermeldungen,
  - Platzhalter (`placeholder`), sofern es sich um Text und nicht um reine
    Zahlenwerte handelt,
  - Hilfetexte (`InfoHint` u. Ä.) und Fußnoten,
  - dynamisch zusammengesetzte Begründungen (z. B. `blockReason`,
    `monthSummary`) sowie Singular-/Pluralformen.
- Dynamische Sätze werden als **Funktionen** in `locales/de.js` hinterlegt
  (z. B. `results.reason.namedExtends: (p) => ...`), die strukturierte Werte
  entgegennehmen. Die Komponenten in `app.jsx` übergeben nur den Schlüssel und
  die benötigten Werte – sie bauen selbst **keine** deutschen Satzfragmente
  mehr per String-Konkatenation zusammen.
- **Wichtig bei Zahlenwerten:** Wird ein Wert sowohl angezeigt (formatiert,
  z. B. über `fmtNum`, mit Komma statt Punkt) als auch für eine numerische
  Bedingung (Singular/Plural, `> 0`-Prüfungen) benötigt, müssen **beide**
  Formen an die Locale-Funktion übergeben werden (z. B. `vac` für die Anzeige
  und `vacRaw` für den Vergleich). Ein Vergleich darf nie gegen den bereits
  formatierten String erfolgen.
- Von externen APIs gelieferte Inhalte (z. B. Feiertagsnamen und
  Ferienbezeichnungen von der OpenHolidays API oder der Ersatzquelle
  `schulferien-api.de`) dürfen **unverändert** angezeigt werden
  und müssen nicht künstlich übersetzt werden.
- Von der Anwendung selbst definierte **Fallback-Texte** (z. B. „Schulferien",
  wenn die API keinen Namen liefert) sowie **intern berechnete Feiertagsnamen**
  (z. B. „Christi Himmelfahrt") gehören dagegen zwingend in `locales/de.js`.
- Interne, niemals für Nutzer sichtbare Inhalte dürfen weiterhin Deutsch
  bleiben, z. B. Code-Kommentare, ausschließlich über ein Debug-Flag aktivierte
  `console.log`-Ausgaben, sowie rein technische Metadaten ohne UI-Bezug (z. B.
  das `PRODID`-Feld einer erzeugten `.ics`-Datei).
- **Technisch notwendige Ausnahme:** Der `<noscript>`-Text in `index.html`
  („Bitte JavaScript aktivieren, um den Urlaubsplaner zu nutzen.") bleibt
  bewusst als deutsches String-Literal direkt in `index.html` bestehen. Er
  wird nur angezeigt, wenn JavaScript deaktiviert ist – in diesem Fall lädt
  weder `locales/de.js` noch `app.jsx`, sodass `t()` nicht zur Verfügung steht
  und dieser Text technisch nicht über die Locale-Struktur ausgegeben werden
  kann. Dasselbe gilt für den statischen `<title>Urlaubsplaner</title>` in
  `index.html`, der lediglich als Fallback dient, bis `app.jsx` geladen ist
  (siehe nächster Punkt).
- Der Browser-/Dokumenttitel wird zusätzlich zur Laufzeit über
  `document.title = t("common.documentTitle")` (in einem `useEffect` in
  `app.jsx`) aus der aktiven Locale gesetzt. Der statische Titel in
  `index.html` bleibt als initialer Fallback bestehen, bis dieser Effekt beim
  ersten Render greift.
- Bestehende Übersetzungsschlüssel sollen möglichst weiterverwendet und nicht
  ohne konkreten Grund umbenannt werden.
- Änderungen an Übersetzungsschlüsseln oder deren Werten dürfen **niemals**
  `plan()`, die Bewertungslogik, die Schulferienlogik, das Share-Link-Format
  oder gespeicherte Einstellungen beeinflussen. Bundesland-**Codes** (z. B.
  `"BY"`) sind von Übersetzungen ausdrücklich ausgenommen und bleiben
  sprachunabhängig (siehe `STATE_CODES` in `app.jsx`).
- Ein neuer oder geänderter Schlüssel wird **immer in `de.js` und `en.js`
  gemeinsam** gepflegt (gleiche Schlüsselstruktur, gleiche
  Funktionssignaturen) – nie nur in einer der beiden Dateien, sonst greift für
  die andere Sprache stillschweigend der Deutsch-Fallback (siehe „Fehlende
  Schlüssel" unten).
- `document.documentElement.lang` wird bereits beim Laden gesetzt (siehe
  Bootstrap-Script in `index.html` oben) und muss bei Änderungen an der
  Sprachumschaltung konsistent gehalten werden.
- Bei jeder künftigen Änderung an `app.jsx` ist zu prüfen, ob dabei neue
  sichtbare String-Literale außerhalb der Locale-Dateien entstanden sind
  (z. B. per Textsuche nach Umlauten oder typischen deutschen Wörtern in
  Anführungszeichen).

### Fehlende Schlüssel
Fehlt ein Schlüssel in der aktiven Sprache, fällt `t()` automatisch auf Deutsch
zurück; fehlt er auch dort, gibt `t()` sichtbar `⚠ <key>` zurück und schreibt
eine Warnung in die Browser-Konsole – ein fehlender Schlüssel führt also nie zu
einem stillen Absturz, sondern ist im Entwicklungsfall sofort erkennbar.

### Sprachumschalter (Header)
`LanguageSwitcher` (`jsx/support-components.jsx`, Namespace
`window.FREILOTSE.ui`) ist ein Header-Button, der zwischen `de`/`en` umschaltet
(zeigt jeweils die **Zielsprache** als Kürzel, z. B. „EN" während die Seite
Deutsch anzeigt). Eingebunden auf: Planer (`app.jsx`), Landing Page,
Anleitung, Neuigkeiten, Über FREILOTSE, Rätsel-Seite. **Nicht** auf
Impressum/Datenschutz (`jsx/legal-pages.jsx`) – bewusst ausgelassen, analog zu
deren generellem „noindex"/Sonderrolle als reine Rechtsseiten.

Die gewählte Sprache wird in `localStorage["freilotse.locale.v1"]` gemerkt
(Werte `"de"`/`"en"`, fehlender Eintrag = Deutsch) und wirkt seitenübergreifend.

### Zentrale technische Entscheidung: Reload statt Live-Umschaltung
Ein Klick auf `LanguageSwitcher` schaltet **nicht** live um, sondern
speichert die neue Sprache in `localStorage` und lädt die Seite per
`window.location.reload()` neu. Grund: mehrere Konstanten (u. a. `COUNTRIES`,
`STATES`, `TRIP_CITY_IDS` in `app.jsx`) werden bereits **beim Modul-Laden**
aus `t(...)` berechnet, nicht erst beim Rendern – eine Live-Umschaltung ohne
Reload würde diese Konstanten in der falschen Sprache stehen lassen. Das
Inline-Bootstrap-Script in `index.html` (siehe oben) sorgt dafür, dass
`window.I18N.setLocale("en")` bereits **vor** dem Laden dieser Module
ausgeführt wird, sodass sie nach dem Reload korrekt in der neuen Sprache
berechnet werden.

Damit ein Sprachwechsel dabei keine ungespeicherte Planung verwirft, ruft
`Urlaubsplaner` (`app.jsx`) dem `LanguageSwitcher` eine `onBeforeSwitch`-Prop
(`prepareLocaleSwitch`) mit: sie legt den aktuellen Eingabezustand (identisches
Format wie `buildSharePayload()`) **und** die aktuelle `view` synchron in
`sessionStorage` ab (Schlüssel `freilotse.localeSwitchRestore.v1` /
`freilotse.localeSwitchView.v1`), bevor die Seite neu lädt. Ein eigener
`useRef` (`localeSwitchRef`, analog zu `sharedRef`/`localStoreRef`) liest
diese Schlüssel synchron vor der State-Initialisierung, entfernt sie sofort
(kein erneutes Greifen bei einem späteren manuellen Reload) und hat beim
Laden **Vorrang vor Share-Link und lokalem Plan** – es ist exakt der Zustand,
der eine Sekunde zuvor auf dem Bildschirm stand, inklusive Landing Page (ein
Wechsel dort springt nach dem Reload **nicht** ungefragt in den Planer). Kein
Toast, da es sich um einen internen Kontinuitäts-Mechanismus handelt, kein
sichtbares „Planung geladen"-Ereignis wie beim echten Share-Link.

Zusätzlich an die aktive Sprache gekoppelt (kein eigener State, da ohnehin nur
per Reload wechselbar): `dateLocale` in `app.jsx` (`"en-GB"`/`"de-DE"` für die
wenigen `toLocaleDateString`/`toLocaleString`-Aufrufe) sowie die
Sprachparameter der Trip-Links (siehe Abschnitt „Trip-Links" weiter unten) –
`googleFlightsUrl()` (`hl=`), `skyscannerUrl()` (`locale=`), `bookingUrl()`
(`lang=`). **Ausnahme:** `tripUrl()` (Trip.com) bleibt unabhängig von der
FREILOTSE-Sprache immer Deutsch (siehe dortige Begründung).

## Neuigkeiten-Seite (Changelog)

### Zweck
Zeigt Nutzer:innen unter `/neuigkeiten` (`jsx/changelog-page.jsx`) in
umgekehrt-chronologischer Reihenfolge, was sich an FREILOTSE zuletzt getan
hat. Inhalt liegt vollständig in `locales/de.js` unter `changelog.entries`
(Array aus `{ date, title, items[] }`), reines Datenobjekt ohne eigene
Rendering-Logik in der Seite selbst.

### Verbindliche Pflege-Regel
Bei **jeder** nutzersichtbaren Änderung an FREILOTSE (neues Feature,
spürbare Verhaltensänderung, wichtiger Bugfix mit Nutzer-Auswirkung) wird
**automatisch, ohne gesonderte Nachfrage**, ein neuer Eintrag in
`changelog.entries` ergänzt (neuester Eintrag zuerst). Ausgenommen sind rein
interne/technische Änderungen ohne sichtbare Auswirkung (Refactorings,
Testanpassungen, reine Kommentar-/Dokupflege, CLAUDE.md-Änderungen wie diese
hier).

Anforderungen an einen neuen Eintrag:
- `date`: Datum der Änderung im Format `"D. Monat JJJJ"` (siehe bestehende
  Einträge), **kein** Platzhalter/TODO.
- `title`: kurzer, nutzerorientierter Titel (kein Commit-Titel, keine
  technische Formulierung).
- `items`: 1–3 kurze Stichpunkte, die erklären, was sich für Nutzer:innen
  konkret ändert/verbessert – in demselben knappen, freundlichen Ton wie die
  bestehenden Einträge. Rohe Git-Commit-Nachrichten werden **nicht** 1:1
  übernommen, sondern in verständliches Deutsch übersetzt.
- Bei mehreren zusammenhängenden Änderungen innerhalb derselben Anfrage/
  desselben Tages: ein gemeinsamer Eintrag statt mehrerer Mini-Einträge.

Diese Regel gilt unabhängig davon, ob der Nutzer die Neuigkeiten-Seite in der
jeweiligen Anfrage erwähnt – sie ist Teil des normalen Abschlusses einer
sichtbaren Änderung, genau wie das Hochzählen der Cache-Busting-Version.

## Lokales Speichern mehrerer Pläne

### Zweck
Speichert die aktuelle Planung direkt im Browser (`localStorage`), ohne
Konto und ohne Server – mehrere benannte Pläne parallel möglich (z. B.
„Urlaub 2027", „Sommerferien Familie"). Header-Button „Plan speichern"/
„Meine Pläne" (je nachdem, ob bereits Pläne existieren) öffnet einen
Verwaltungsdialog zum Öffnen/Umbenennen/Duplizieren/Löschen.

### Speicherformat
`js/local-plans.js`, `STORAGE_KEY = "freilotse.localPlans.v1"`:
`{ plans: [{ id, name, createdAt, updatedAt, payload }], activePlanId }`.
`payload` ist exakt die `{version, state}`-Hülle aus `buildSharePayload()`/
`validateSharePayload()` (`js/share-link.js`) – ein gespeicherter Plan ist
technisch identisch zu einem Share-Link-Payload, nur ohne Base64/
Kompression. `local-plans.js` prüft nur die Speicher-**Hülle** (ist der
Eintrag plan-förmig); die inhaltliche Validierung (Enums,
Bundesland-Gültigkeit) übernimmt weiterhin `validateSharePayload()` beim
tatsächlichen Laden – inklusive derselben `SHARE_VERSION`-Prüfung und
damit derselben additiv-only-Versionierungsstrategie wie bei Share-Links
(siehe Abschnitt „Versionierungsstrategie (SHARE_VERSION)" oben).

### Restore-on-Load und Autosave
`localStoreRef` (`app.jsx`) liest **synchron vor jedem `useState`**, analog
zu `sharedRef` für Share-Links. Ein Share-Link in der URL hat **immer
Vorrang** – die lokale Wiederherstellung greift nur, wenn kein Fragment
vorliegt. Bei vorhandenem aktivem Plan wird beim Laden direkt in die
Planer-Ansicht gesprungen (kein Picker, keine Landing Page).

Autosave beginnt ab dem ersten Speichern eines Plans, danach automatisch bei
jeder relevanten Eingabe-Änderung in denselben aktiven Plan – Teil des
bestehenden Prebuild-`useEffect`, der auch den vorab erzeugten Share-Link
baut (bewusst **ein** Effekt, damit die Dependency-Listen nicht
auseinanderlaufen können). Dieses erste Speichern ist entweder ein
expliziter Klick auf „Plan speichern" **oder** – existiert nach 3 Minuten
aktiver Nutzung im Planer (`view === "planner"`) immer noch kein einziger
lokaler Plan – ein automatisches Erst-Speichern (eigener `useEffect`,
Dependency `plansStore.plans.length`, damit ein zwischenzeitliches
manuelles Speichern den Timer via Cleanup abbricht statt einen zweiten Plan
anzulegen). Der Toast-Hinweis unterscheidet die beiden Auslöser bewusst mit
leicht abweichendem Text (`localPlans.toast.firstSaveNotice` bei manuellem
Klick vs. `localPlans.toast.autoFirstSaveNotice` bei automatischem
Erst-Speichern, per `auto`-Flag an `savePlanAsNew()`), damit klar bleibt,
dass hier ohne Zutun gespeichert wurde. Ab diesem ersten Plan ist das
Verhalten in beiden Fällen gleich: sofort/synchron bei jeder Änderung, ohne
Debounce und ohne Diff-Prüfung gegen den zuletzt gespeicherten Payload.

### Verfügbarkeit
Ist `localStorage` nicht verfügbar (z. B. Safaris privates Fenster), blendet
sich das Feature komplett aus (kein Button); alle Schreibzugriffe sind mit
try/catch abgesichert (z. B. Speicherplatz voll) – nie ein Absturz, gleiche
Devise wie bei den übrigen optionalen/externen Datenquellen. Löschen eines
Plans erfolgt **ohne** Bestätigungsdialog, konsistent mit dem Rest der App
(z. B. „Entfernen" bei Wunschblöcken – der Button-Text macht die Konsequenz
direkt klar statt eines separaten Bestätigungsschritts).

## Kollegen-/Partner-Überschneidungs-Check („Gemeinsam frei")

### Zweck
Findet gemeinsame freie Tage mit einer anderen Person: deren Share-Link
einfügen, FREILOTSE zeigt überlappende freie Zeiträume. Rein clientseitig,
der eingefügte Link wird nirgends gespeichert, nur für die aktuelle Sitzung
ausgewertet.

### Technik
`decodeShare()`/`validateSharePayload()` (`js/share-link.js`) sind rein
(kein Zugriff auf Session-/Fenster-Zustand) und daher sicher für das
Dekodieren eines fremden Links unabhängig vom eigenen Plan. Da ein
Share-Link nur Eingaben enthält, wird für die fremde Person komplett neu
gerechnet: `loadPublicHolidays()` für deren Land/Bundesland/Jahr,
`buildDays()`, dann `plan()` mit der dekodierten Konfiguration dieser
Person – exakt dieselbe Berechnung wie für den eigenen Plan, nur mit
anderen Eingaben.

Überschneidung: pro Tag `istFrei = day.cost === 0 || sel[i] === "vac" || sel[i] === "ot"`,
angewendet auf den eigenen Plan UND jede hinzugefügte Person gleichzeitig.
Zusammenhängende Läufe zählen (wie bei `plan()`s eigenen Perioden) nur,
wenn mindestens eine Seite tatsächlich Urlaub/Überstunden eingesetzt hat –
sonst würde jedes gewöhnliche gemeinsame Wochenende als eigener „Zeitraum"
auftauchen.

### Fehlerfälle
Ungültiger/kaputter Link → Inline-Fehlertext (analog zum Ton bestehender
Share-Link-Toasts). Abweichendes Jahr → Hinweistext statt stiller
Fehlberechnung, die Person wird nicht in die Überschneidung einbezogen.

## Jahreswechsel-Erweiterung (Profi-Modus)

### Zweck
Reicht der letzte Zeitraum des Jahres bis zum 31.12., werden kostenlose
Tage direkt danach im Folgejahr (Feiertage, Wochenenden) automatisch als
„sicher frei" an diesen Zeitraum angehängt. Eine kostenpflichtige
Verlängerung mit Urlaubstagen aus dem Folgejahr erscheint separat als
unverbindlicher, visuell abgesetzter Hinweis („Möglichkeit mit
Urlaubstagen aus {Folgejahr}") – niemals automatisch eingeplant, da das
Folgejahr-Kontingent unbekannt ist.

### Technik
`js/planning.js` bleibt unverändert. `plan()` wird ein zweites Mal
aufgerufen (gleiches Wiederverwendungs-Prinzip wie bei „Gemeinsam frei"),
aber mit `buildDays(year + 1, ...)` **gefiltert auf den relevanten
Zeitraum** übergeben. Der garantiert kostenlose Anteil wird davon
**unabhängig** ermittelt: ein einfacher Scan ab Neujahr, bei dem nur der
lückenlose kostenlose Präfix als sicher zählt – ein kostenloser Tag
**hinter** einer noch nicht genommenen Urlaubslücke gilt nicht als sicher.
Das macht die Berechnung robust auch für den Fall, dass der zweite
`plan()`-Aufruf für den Bereich gar keinen eigenen Zeitraum zurückgibt
(z. B. weil sich eine Brücke dort nicht lohnt).

### Bewusste Einschränkungen
Nur Urlaubstage (keine Überstunden) in der hypothetischen Verlängerung; nur
relevant, wenn bereits ein realer Zeitraum bis zum 31.12. reicht (ein für
sich genommen freier 31.12. ohne angrenzenden Zeitraum löst die Erweiterung
nicht aus); Kopf-Kennzahlen (freie Tage gesamt, Restbudget) bleiben
unverändert – die Erweiterung fließt ausschließlich in die Darstellung des
letzten Listeneintrags ein. Export (ICS/Google) dieses Zeitraums schließt
den sicheren Anhang mit ein, nicht die hypothetische Verlängerung.

## Trip-Links (Flüge/Unterkunft), Trip.com-Stadt-IDs und Skyscanner-Codes

### Zweck und Sichtbarkeit
Bei freien Zeiträumen ab `TRIP_LINKS_MIN_LEN = 3` zusammenhängenden Tagen
(`app.jsx`) zeigt die Zeitraum-Liste zusätzlich die Schaltflächen „Flüge" und
„Unterkunft". Ein optionales Reiseziel-Freitextfeld (`tripDestination`, pro
Zeitraum überschreibbar via `perPeriodDestination`, aufgelöst durch
`effectiveDestination(p)`) füllt die Ziel-Portale vor; daneben steht ein
optionales Abflughafen-Feld (`tripOrigin`), das **nur** Skyscanner betrifft.
Alle drei States sind bewusst **rein UI-lokal**: nicht im Share-Link, nicht in
gespeicherten Plänen.

`tripOrigin` gibt es bewusst **nur global** und ohne Per-Zeitraum-Überschreibung
(anders als das Reiseziel): der Abflughafen ändert sich übers Jahr in aller
Regel nicht, das Reiseziel schon.

### Vorbelegung des Abflughafens
`tripOrigin` startet **nicht leer**, sondern mit dem Vorschlag aus
`results.originByState` (`locales/de.js`), aufgelöst über `defaultOriginFor()`
in `app.jsx` – Schlüssel sind die sprachunabhängigen Bundesland-/Kantonscodes,
Werte IATA-Codes aus `originSuggestions`. Ins Feld geschrieben wird der
**Anzeigename** („Frankfurt am Main (FRA)"), nicht das nackte Kürzel; dafür
gibt es die Rückrichtung `ORIGIN_NAMES`.

Die Zuordnung ist bewusst **nicht** streng „geografisch nächster Flughafen",
sondern „nächster Flughafen mit nennenswertem Linienverkehr" – ein Vorschlag
ohne Flüge wäre für die Suche wertlos. Daher z. B. Mecklenburg-Vorpommern →
Hamburg (statt Rostock-Laage) und Thüringen → Leipzig/Halle (statt Erfurt).

Ein `useEffect` auf `[country, st]` zieht die Vorbelegung bei einem Wechsel
nach, **solange `originTouched` (ein `useRef`) false ist**. Sobald der Nutzer
das Feld selbst anfasst, wird nie wieder überschrieben – auch ein bewusst
geleertes Feld bleibt leer (und bedeutet dann: landesweite Suche). Ein `useRef`
statt eines States, weil die Information nur den Effekt steuert und kein
Re-Render auslösen soll.

### Beide Buttons führen zu einer Portal-Auswahl
Weder „Flüge" noch „Unterkunft" ist ein Link; beide öffnen einen Dialog
(States `flightsDialogIdx` bzw. `accDialogIdx` = Index in `result.periods`,
`null` = zu; Index statt Objekt, damit ein neu berechneter Plan keinen
veralteten Zeitraum festhält). Die Wahl wird **nicht** gespeichert – bei jedem
Klick wird neu gefragt.

Beide Dialoge rendern über dieselbe Komponente `PortalChoiceDialog`
(`jsx/common-components.jsx`, Namespace `window.FREILOTSE.ui`). Sie ist
absichtlich generisch: Optionen kommen als Liste `{ key, label, href }` herein,
alle Texte als fertige Strings – die Komponente kennt weder Portale noch
Zeiträume. Die Optionen **müssen** echte `<a target="_blank">`-Links bleiben,
damit Neuer-Tab/Mittelklick funktionieren. Den gemeinsamen Datumsbereich für
beide Dialoge liefert `dialogRange(idx)` in `app.jsx` (identische Darstellung
wie die Zeitraum-Listenzeile, inklusive Jahreswechsel-Erweiterung).

### Warum Trip.com eine ID-Tabelle braucht
Booking.com akzeptiert einen Freitext-Zielort (`&ss=<Ort>`). **Trip.com nicht:**
Eine Suche allein über `searchWord`/`searchType` zeigt zwar Ort und Zeitraum
korrekt im Formular an, liefert aber nachweislich „0 Unterkünfte gefunden".
Erst der Parameter `city=<numerische ID>` liefert Treffer (und genügt allein,
`searchWord` ist entbehrlich). Achtung auf die abweichende Schreibweise:
Trip.com erwartet **`checkIn`/`checkOut` in camelCase**, Booking.com
`checkin`/`checkout` klein.

Deshalb trägt jeder Eintrag in `results.destinationSuggestions`
(`locales/de.js`) neben `name` ein Feld `tripCityId`. `app.jsx` baut daraus
einmalig die Map `TRIP_CITY_IDS` (normalisiert auf `trim().toLowerCase()`);
`tripCityIdFor()` liefert die ID, `tripUrl()` baut den Link. Ohne bekannte ID
öffnet `tripUrl()` bewusst nur `https://de.trip.com/hotels/` **ohne**
Vorbefüllung – dasselbe Prinzip wie `googleFlightsUrl()` ohne Reiseziel, und
deutlich besser als eine garantiert leere Trefferliste. Der Dialog weist per
`results.accommodation.tripNoIdHint` sichtbar darauf hin.

`tripCityId: null` ist damit ein **gültiger, dokumentierter Zustand**, kein
Fehler (aktuell: Havanna – die ID 690 zeigt zwar korrekt „Havanna", liefert
aus dem deutschen Markt heraus aber 0 buchbare Unterkünfte).

### Verbindliche Regel für neue oder geänderte IDs
IDs werden **niemals geraten**, sondern zweistufig ermittelt:

1. **Finden:** `https://de.trip.com/hotels/star3/city/<ISO-Ländercode>/<englischer-slug>.html`
   laden und die Zahl aus einem Link `…/hotels/<slug>-hotels-list-<ID>/` lesen.
   Slug-Abweichungen sind häufig (`de/hannover` statt `de/hanover`,
   `ma/marrakech` statt `ma/marrakesh`, `il/tel-aviv-yafo`); notfalls per
   Websuche.
2. **Gegenprüfen (Pflicht):**
   `https://de.trip.com/hotels/list?city=<ID>&checkIn=<Datum>&checkOut=<Datum>`
   laden und bestätigen, dass der angezeigte Ortsname passt **und** die
   Trefferzahl > 0 ist. Andernfalls `null` eintragen.

Schritt 2 ist nicht optional – beim erstmaligen Aufbau der Tabelle hat er
mehrere falsche IDs entlarvt, die aus Schritt 1 plausibel aussahen (u. a.
lieferte eine vermeintliche „Kreta"-ID in Wahrheit Dalian/China, und eine per
Websuche gefundene „Goa"-ID zeigte Goa auf den **Philippinen** statt Indien).

### Inseln und Regionen ohne eigene Trip.com-Kennung
Manche Ziele der Vorschlagsliste sind Inseln oder Regionen, für die Trip.com
keine passende Kennung führt. Dort steht die ID des **touristischen Hauptorts**
(im Code als Kommentar hinter dem Eintrag vermerkt), z. B. Sylt → Westerland,
Rügen → Binz, Usedom → Heringsdorf, Mallorca → Palma de Mallorca, Kreta →
Heraklion, Sizilien → Palermo, Sardinien → Cagliari, Toskana → Florenz,
Algarve → Albufeira, Côte d'Azur → Nizza, Malediven → Malé, Fidschi → Nadi.
Das ist eine bewusste Abwägung: ein brauchbarer Startpunkt in der richtigen
Region schlägt „gar keine Vorbefüllung". Booking.com erhält in diesen Fällen
weiterhin den vollen Regionsnamen als Freitext und sucht daher regionsweit.

### Skyscanner: Ortscodes im URL-Pfad
Skyscanner verhält sich wie Trip.com, nur strenger – es versteht **keinen
Freitext** und verlangt zusätzlich einen **Abflugort**:

```
https://www.skyscanner.de/transport/fluge/<von>/<nach>/<JJMMTT>/<JJMMTT>/
```

- `<nach>`: IATA-Code aus `skyscannerCode` in `results.destinationSuggestions`.
  Ohne Code öffnet `skyscannerUrl()` bewusst nur
  `https://www.skyscanner.de/transport/fluge/` **ohne** Vorbefüllung – dasselbe
  dokumentierte Prinzip wie `tripUrl()` ohne Stadt-ID.
- `<von>`: `originCode()` in `app.jsx`, Reihenfolge **bekannter Vorschlag aus
  `results.originSuggestions` → direkt eingetipptes Kürzel (`/^[a-z]{3}$/`) →
  Länder-Code des gewählten Landes** (`de`/`at`/`ch`). Skyscanner akzeptiert
  Länder als Abflugort und zeigt dann eine Browse-Ansicht mit den günstigsten
  Abflugorten des Landes – **genau deshalb** darf das Abflughafen-Feld optional
  bleiben. Der Dialog weist per `results.flights.noOriginHint` darauf hin.
- Datumsformat **JJMMTT** (nicht JJJJMMTT). Der Rückreisetag ist der **letzte
  freie Tag**, nicht das exklusive `dtEnd` aus `exportInfo()`; deshalb bekommt
  `skyscannerUrl()` – wie `googleFlightsUrl()` – Tagesobjekte statt eines
  Zeitraums, plus ein `endYear` für die Jahreswechsel-Erweiterung
  (`ymdOf(day, yr)` hat dafür einen optionalen Jahresparameter).

`skyscannerCode: null` ist ein **gültiger, dokumentierter Zustand** für Ziele
ohne Linienflughafen (Rügen, Heidelberg, Zermatt, Brügge, Agra …) – aktuell 27
von 208 Einträgen.

### Verbindliche Regel für neue oder geänderte Skyscanner-Codes
Auch diese Codes werden **niemals geraten**. Der Trip.com-Weg (Code direkt auf
der Portalseite gegenprüfen) funktioniert hier jedoch **nicht zuverlässig**:
Skyscanner steht hinter einem aggressiven Bot-Schutz (PerimeterX). `curl`,
`WebFetch` und ein Headless-Browser bekommen ausschließlich die Captcha-Seite;
selbst ein sichtbarer Browser mit persistentem Profil kommt nur wenige Abrufe
weit, bevor die Session geflaggt wird. Ebenso gesperrt: die Autosuggest-API
`/g/autosuggest-search/api/v1/search-flight`.

Deshalb gilt ein zweistufiges Verfahren mit **anderer** Grundwahrheit:

1. **Zuordnen gegen einen autoritativen Datensatz (Pflicht):** IATA-Code über
   den frei verfügbaren OurAirports-Datensatz auflösen
   (`https://davidmegginson.github.io/ourairports-data/airports.csv`) und
   bestätigen, dass `municipality`/`name`, `iso_country` und `type`
   (`large_airport`/`medium_airport`) zum gemeinten Ort passen. Das fängt genau
   die Fehlerklasse ab, die bei den Trip.com-IDs auffiel (richtig aussehender
   Code, falscher Ort/falsches Land).
2. **Stichprobe gegen Skyscanner:** einige Codes über die Browse-Ansicht
   `…/transport/fluge/de/<code>/<JJMMTT>/<JJMMTT>/` in einem **sichtbaren**
   Browser prüfen und bestätigen, dass die Kopfzeile den erwarteten Ort zeigt
   („Deutschland (DE) – Palma de Mallorca (PMI)"). Flächendeckend ist das
   wegen des Bot-Schutzes nicht möglich und auch nicht nötig, da Schritt 1 die
   Zuordnung bereits belegt.

Veraltete Codes sind eine reale Fehlerquelle und fallen nur in Schritt 1 auf –
bei der erstmaligen Pflege betraf das Siem Reap (`rep` stillgelegt → `sai`) und
Yogyakarta (`jog` → neuer Großflughafen `yia`).

### Bewusst nur Einzelflughäfen, keine Metropol-Codes
Für Städte mit mehreren Flughäfen (London, Paris, New York, Tokio …) steht
bewusst **ein konkreter Flughafen** (`lhr`, `cdg`, `jfk`, `nrt`) und **kein**
Sammel-/Metropolcode. Sammelcodes ließen sich mit Schritt 1 nicht belegen
(OurAirports führt nur Flughäfen, keine IATA-Stadtcodes) und mit Schritt 2
wegen des Bot-Schutzes nicht flächendeckend prüfen. Bewusst in Kauf genommener
Nachteil: Abflüge ab Zweitflughäfen (z. B. London Stansted) tauchen in der
vorbefüllten Suche nicht auf. Wird der Bot-Schutz einmal umgehbar, können
Metropolcodes nach Schritt 2 nachgezogen werden.

Bei Inseln/Regionen ohne eigenen Flughafen steht der touristische
Hauptflughafen (Zeilenkommentar „Skyscanner: …"), z. B. Sardinien → Cagliari,
Sizilien → Palermo, Toskana → Pisa, Côte d'Azur → Nizza, Malediven → Malé,
Fidschi → Nadi, Kyoto → Osaka/Kansai. Gleiche Abwägung wie bei den
Trip.com-IDs: ein brauchbarer Startpunkt in der richtigen Region schlägt „gar
keine Vorbefüllung".

### Bewusst nicht enthalten
Keine Affiliate-/Partner-IDs in den erzeugten Links (weder Booking.com noch
Trip.com noch Skyscanner) – die Links sind reine, nicht monetarisierte
Deeplinks. Insbesondere wird **nicht** der Skyscanner-Referral-Endpunkt
(`/g/referrals/v1/flights/day-view` mit `mediaPartnerId`) verwendet, sondern
die normale Konsumenten-URL.

**Kein Gepäck (Handgepäck/Aufgabegepäck) in den Flug-Links.** Das ist keine
Lücke, sondern geprüft und verworfen – nicht erneut versuchen:

- **Google Flights: aktiv schädlich.** Der `?q=`-Freitextparser verwirft bei
  jeder Gepäck-Formulierung die **komplette** Anfrage und landet auf der leeren
  „Entdecken"-Seite. Getestet und reproduziert mit `… with carry-on bag and 1
  checked bag`, `… with carry-on` und `… with 1 bag`; ohne den Zusatz liefert
  dieselbe Anfrage einwandfrei Treffer. Gleiche Fehlerklasse wie die oben
  dokumentierte Jahresangabe. Ein Gepäck-Zusatz würde also die funktionierende
  Vorbefüllung zerstören, ohne selbst anzukommen.
- **Skyscanner: nicht vorgesehen.** Die dokumentierte Parameterliste
  (`developers.skyscanner.net/docs/referrals/flights-parameters`) umfasst
  `origin`, `destination`, `outboundDate`, `inboundDate`, `adultsv2`,
  `childrenv2`, `cabinclass`, `preferDirects`, `sortby`, `airlines`,
  `alliances` – **kein** Gepäck. Das separate „Baggage and Additional
  Attributes" beschreibt Gepäck als Attribut in *API-Antworten*, nicht als
  Filter im Link; der Gepäck-Filter existiert nur als Zustand in der
  Ergebnisliste.

Übergebbar wäre bei Skyscanner allenfalls `cabinclass`
(`economy`/`premiumeconomy`/`business`/`first`). Ob der Parameter auch auf der
**Konsumenten-URL** greift (und nicht nur auf dem Referral-Endpunkt), ist
**nicht belegt** und müsste vor einem Einbau wie die Ortscodes verifiziert
werden. Für Google Flights gibt es keine Entsprechung.

### Sprache der Zielseite (Google Flights, Skyscanner, Booking.com)
Seit Einführung der englischen Übersetzung (siehe Abschnitt
„Internationalisierung und UI-Texte") öffnen `googleFlightsUrl()`/
`skyscannerUrl()`/`bookingUrl()` (`app.jsx`) die Zielseite in derselben
Sprache wie die aktive FREILOTSE-Oberfläche, unabhängig von Konto-/Browser-
Spracheinstellungen des Besuchers – jeweils manuell im Browser verifiziert:
- **Google Flights**: zusätzlicher `hl=`-Parameter (`hl=de`/`hl=en`),
  getrennt vom `q=`-Freitextparameter. `…&hl=en`/`…&hl=de` liefern
  zuverlässig englische bzw. deutsche Oberfläche bei identischen
  Suchergebnissen (Flüge, Preise) – anders als die Gepäck-Zusätze oben ist
  das ein regulärer, dokumentierter Google-weiter UI-Parameter, kein Teil
  der fehleranfälligen Freitext-Erkennung.
- **Skyscanner**: zusätzlicher `?locale=`-Parameter (`?locale=de`/
  `?locale=en`) auf der bestehenden `skyscanner.de`-Konsumenten-URL – **keine**
  Domain-/Pfadänderung nötig. Ebenfalls manuell verifiziert: identische
  Ergebnisse/Preise, nur die Oberflächensprache wechselt. Gilt nur für die
  Oberfläche, nicht für den o. g. ungeklärten `cabinclass`-Parameter.
- **Booking.com**: zusätzliche Parameter `lang=en-gb&soz=1&lang_changed=1`
  (Englisch) bzw. `lang=de&soz=1&lang_changed=1` (Deutsch) – Muster stammt
  vom eigenen Sprachumschalter der Seite. Beide Richtungen manuell
  gegengeprüft: identische Suchergebnisse/Preise, nur Oberfläche und
  Sprachflagge wechseln.

**Trip.com: bewusst NICHT umgesetzt.** `tripUrl()` bleibt unverändert bei
`de.trip.com` und öffnet unabhängig von der FREILOTSE-Sprache immer Deutsch
– kein Sprachparameter gefunden, und nicht ohne Weiteres nachrüstbar:
- Auf `de.trip.com` blieb die Oberfläche mit jedem getesteten
  `locale=`-Wert (`en-us`, `en_us`, `en-DE`, sogar dem wörtlichen `en_xx`
  aus einem eigenen Nutzertest) unverändert Deutsch.
- Alternative „auf `www.trip.com` (ohne Länderpräfix) ausweichen, wenn
  FREILOTSE auf Englisch steht" wurde geprüft und verworfen: **nicht
  deterministisch**. Identischer Aufruf derselben `www.trip.com/hotels/
  list?city=…`-URL lieferte im selben Browser einmal korrekt englische
  Ergebnisse, ein zweites Mal einen Redirect auf die deutsche Startseite
  **unter Verlust von Reiseziel und Datum** – schlechter als der jetzige
  Zustand (immer Deutsch, aber immer korrekt vorausgefüllt). Wirkt session-/
  cookie-abhängig (`www.trip.com` als bloße Startseite leitet zudem anhand
  von `navigator.language`/Accept-Language automatisch auf die passende
  Landes-Subdomain um). Vor einem erneuten Versuch müsste dieses
  Redirect-Verhalten grundlegend verstanden sein, nicht nur stichprobenhaft
  getestet werden.

## Brückentage-Rätsel des Tages (`/raetsel`)

### Zweck
Tägliches, Wordle-artiges Minispiel: ein neuer, deterministisch gewählter
Kalenderausschnitt pro Tag, Nutzer setzen ihr Urlaubstage-Budget manuell per
Klick, das Ergebnis wird mit der objektiv besten Lösung verglichen und lässt
sich als spoiler-freies Emoji-Grid teilen (Kalenderstreifen: 🟩 frei, 🟨
selbst gesetzter Urlaubstag, ⬜ Arbeitstag).

### Erzeugung
`js/puzzle.js` (`window.FREILOTSE.puzzle`) seedet deterministisch aus dem
Datumsstring (`fnv1aHash` + `mulberry32`, kein externer RNG nötig) – dasselbe
Datum liefert weltweit exakt dasselbe Rätsel, ohne Backend. Feiertage werden
ausschließlich über die bestehende **offline** Berechnung bezogen
(`buildDays(year, st, xmasRule, null, t, ...)`, nutzt intern `holidayMap()`)
– das Rätsel hat **nie** eine Netzwerkabhängigkeit, im Unterschied zum
Hauptplaner. Aus 64 fest gezogenen Kandidaten (Bundesland/Monat/Budget,
**alle auf einmal** aus dem RNG-Strom gezogen, nicht "einer nach dem
anderen bei Bedarf" – das macht die Auswahl nachweislich terminierend) wird
der erste gewählt, dessen Musterlösung spürbar mehr freie Tage als
eingesetztes Budget ergibt (`QUALITY_MARGIN`).

**Wichtig:** `STATE_CODES`-Reihenfolge, `MAX_ATTEMPTS`, `QUALITY_MARGIN`,
`LAUNCH_DATE_KEY` und die Zug-Reihenfolge in `generateCandidates()` sind
nach Veröffentlichung **eingefroren** – jede spätere Änderung würde
rückwirkend ändern, welches Rätsel an welchem Kalendertag lag (gleiche
Vorsicht wie bei einer echten Wordle-Antwortliste).

### Musterlösung
`plan()` wird ein zweites Mal aufgerufen, aber beschränkt auf **nur** den
gezeigten Monat: `buildDays()` liefert immer ein volles Jahr, wird aber auf
den Zielmonat gefiltert (`fullYearDays.filter(d => d.m === month)`), bevor
dieses gefilterte Array an `plan()` übergeben wird – sonst könnte die
Automatik über mehrere Monate verteilen, was mit dem angezeigten Spielbrett
nicht mehr vergleichbar wäre. `longestFreeRun()` bewertet Musterlösung UND
Spieler-Ergebnis mit derselben Funktion.

### Ein Versuch pro Tag, Übungsmodus
`js/puzzle-stats.js` (`window.FREILOTSE.puzzleStats`, `STORAGE_KEY =
"freilotse.puzzleStats.v1"`, Muster identisch zu `js/local-plans.js`)
speichert Streak/Spielverlauf inklusive fertigem Emoji-Grid pro Tag (nicht
nur die Zahlen – so lässt sich auch nach einem Reload am selben Tag noch
ein teilbares Ergebnis anzeigen, ohne die exakte Klick-Auswahl des Spielers
persistieren zu müssen). Nach dem gewerteten Erstversuch kann beliebig oft
geübt werden („Erneut versuchen") – Übungsversuche zählen **nicht** für
Streak/Statistik und überschreiben das gewertete Ergebnis nicht;
„Ergebnis teilen" bezieht sich immer auf den gewerteten Erstversuch, nie
auf einen Übungsversuch (hält geteilte Ergebnisse zwischen Spielern fair
vergleichbar).
