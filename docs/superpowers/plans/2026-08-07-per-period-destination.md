# Reiseziel pro Zeitraum – Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** In der Zeiträume-Liste im Profi-Modus soll jeder Zeitraum mit
Flüge/Unterkunft-Buttons ein optionales, kleines Zusatzfeld bekommen, das nur
für diesen Zeitraum das globale Reiseziel-Feld überschreibt.

**Architecture:** Neuer React-State `perPeriodDestination` (Objekt, Key =
`p.s`) in `Urlaubsplaner` (`app.jsx`). Eine kleine Hilfsfunktion
`effectiveDestination(p)` löst pro Zeitraum auf: eigener Wert falls gesetzt,
sonst Fallback auf das bestehende globale `tripDestination`. Die bestehenden
`googleFlightsUrl`/`bookingUrl`-Aufrufe bekommen diesen aufgelösten Wert statt
direkt `tripDestination`. Rein UI-lokaler State, keine Persistierung (kein
Share-Link, keine lokalen Pläne).

**Tech Stack:** Reines React über globale `React`/`ReactDOM`, JSX per
Babel-Standalone im Browser, kein Build/Bundler, kein Testrunner im Repo.
"Testen" bedeutet hier: `index.html` im Browser öffnen und das Feature manuell
prüfen (siehe CLAUDE.md, Abschnitt zu UI-Änderungen).

## Global Constraints

- Kein Bundler, kein Modulsystem, keine ES-Module – `app.jsx` bleibt ein
  klassisches `<script type="text/babel">`.
- Alle sichtbaren Texte ausschließlich über `t(key, params)` aus
  `locales/de.js`, keine deutschen String-Literale direkt in `app.jsx`.
- Nach jeder Änderung an `app.jsx` bzw. `locales/de.js` die zugehörige
  Cache-Busting-Version (`?v=…`) in `index.html` hochzählen.
- Jede nutzersichtbare Änderung bekommt automatisch einen Eintrag in
  `changelog.entries` (`locales/de.js`) – bei mehreren zusammenhängenden
  Änderungen am selben Tag als zusätzlicher Punkt im bestehenden Eintrag statt
  eines neuen Eintrags (hier gilt das: der 7. August 2026 hat bereits einen
  Eintrag „Trip-Links bei langen freien Zeiträumen").
- Keine Persistierung des neuen Felds (weder `js/share-link.js` noch
  `js/local-plans.js` werden angefasst).
- `googleFlightsUrl`/`bookingUrl`-Signaturen bleiben unverändert
  (`(startDay, endDay, destination)` bzw. `(p, destination)`).

---

### Task 1: Locale-Texte für das neue Feld

**Files:**
- Modify: `locales/de.js:838-843` (Block `results.*`, direkt nach
  `destinationPlaceholder`)

**Interfaces:**
- Produces: `t("results.destinationPeriodPlaceholder", { fallback })` (String,
  `fallback` = aktuell aufgelöster globaler Wert, kann leer sein) und
  `t("results.destinationPeriodAriaLabel")` (String, keine Params) – werden in
  Task 2 aus `app.jsx` aufgerufen.

- [ ] **Step 1: Neue Schlüssel ergänzen**

In `locales/de.js` direkt nach Zeile 839 (`destinationPlaceholder: "z. B.
Paris, Mallorca …",`) einfügen:

```js
      destinationPeriodPlaceholder: (p) =>
        p.fallback ? `Abweichendes Ziel (Standard: ${p.fallback})` : "Abweichendes Reiseziel für diesen Zeitraum",
      destinationPeriodAriaLabel: "Reiseziel für diesen Zeitraum (überschreibt das Feld oben)",
```

- [ ] **Step 2: Manuell prüfen**

`locales/de.js` im Editor öffnen, sicherstellen, dass die Datei weiterhin
gültiges JS ist (keine fehlenden Kommas/Klammern rund um die neuen Zeilen) und
dass `window.I18N` beim Laden von `index.html` im Browser keine Konsolenfehler
wirft (Browser-Konsole prüfen, siehe Task 3 für den vollständigen manuellen
Testlauf – an dieser Stelle reicht ein kurzer Ladecheck ohne Konsolenfehler).

- [ ] **Step 3: Commit**

```bash
git add locales/de.js
git commit -m "$(cat <<'EOF'
Locale-Texte für Pro-Zeitraum-Reiseziel ergänzen

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: State, Auflösung und UI-Feld in `app.jsx`

**Files:**
- Modify: `app.jsx:298` (State-Deklarationen neben `tripDestination`)
- Modify: `app.jsx:952-961` (nicht ändern, nur Aufrufstelle in Task betrifft
  Zeilen 2309/2318 unten – Funktionssignatur bleibt exakt wie sie ist)
- Modify: `app.jsx:2307-2327` (Button-Block der Zeiträume-Liste)

**Interfaces:**
- Consumes: `t` (aus `window.I18N.t`, bereits am Dateianfang von `app.jsx`
  destrukturiert), `inputCls` (String, `app.jsx:1167`), `tripDestination`
  (String State, `app.jsx:298`), `TRIP_LINKS_MIN_LEN` (`app.jsx:26`),
  `googleFlightsUrl(startDay, endDay, destination)` (`app.jsx:952`),
  `bookingUrl(p, destination)` (`app.jsx:935`).
- Produces: `perPeriodDestination` (State, `{ [dayIndex: number]: string }`),
  `setPerPeriodDestination` (Setter), `effectiveDestination(p)` (Funktion,
  gibt String zurück) – ausschließlich lokal in `Urlaubsplaner` genutzt, keine
  weiteren Konsumenten außerhalb dieser Komponente.

- [ ] **Step 1: State direkt neben `tripDestination` ergänzen**

In `app.jsx` Zeile 298 (`const [tripDestination, setTripDestination] =
useState("");`) direkt danach einfügen:

```js
  const [perPeriodDestination, setPerPeriodDestination] = useState({});
```

- [ ] **Step 2: Auflösungs-Helfer ergänzen**

Direkt vor der `googleUrl`-Definition (`app.jsx:925`, `const googleUrl = (p)
=> {`) einfügen:

```js
  // Reiseziel für einen einzelnen Zeitraum: eigener Wert (falls gesetzt)
  // überschreibt das globale Feld, sonst Fallback auf tripDestination.
  const effectiveDestination = (p) =>
    (perPeriodDestination[p.s] ?? "").trim() || tripDestination;
```

- [ ] **Step 3: Bestehende Aufrufstellen auf `effectiveDestination` umstellen
  und die Sichtbarkeits-Bedingung in eine Variable ziehen**

In `app.jsx` Zeile 2257 (`const certainLen = isTransitionPeriod ? p.len +
yearTransition.freeExtensionDays : p.len;`) direkt danach eine neue Variable
ergänzen, damit die Bedingung nicht doppelt (einmal für die Buttons, einmal
für das neue Feld in Step 4) im Code steht:

```js
                  const showTripLinks = certainLen >= TRIP_LINKS_MIN_LEN;
```

Danach im Block ab Zeile 2307 (`{certainLen >= TRIP_LINKS_MIN_LEN && (`) die
Bedingung auf `showTripLinks` umstellen und die beiden Vorkommen von
`tripDestination` als Funktionsargument durch `effectiveDestination(p)`
ersetzen:

```jsx
                        {showTripLinks && (
                          <>
                            <a href={googleFlightsUrl(days[p.s], isTransitionPeriod ? yearTransition.certainEndDate : days[p.e], effectiveDestination(p))}
                              target="_blank" rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title={t("results.flightsTitle")}
                              className={`rounded-xl border px-2 py-0.5 text-[11px] font-semibold ${
                                dark ? "border-tiefwasser-hell text-sonnencreme/80 hover:bg-tiefwasser-hell" : "border-beckenwasser/30 text-espresso/80 hover:bg-beckenwasser-hell/30"
                              }`}>
                              {t("results.flightsButton")}
                            </a>
                            <a href={bookingUrl(p, effectiveDestination(p))} target="_blank" rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title={t("results.bookingTitle")}
                              className={`rounded-xl border px-2 py-0.5 text-[11px] font-semibold ${
                                dark ? "border-tiefwasser-hell text-sonnencreme/80 hover:bg-tiefwasser-hell" : "border-beckenwasser/30 text-espresso/80 hover:bg-beckenwasser-hell/30"
                              }`}>
                              {t("results.bookingButton")}
                            </a>
                          </>
                        )}
```

- [ ] **Step 4: Neues Eingabefeld unterhalb der Button-Zeile ergänzen**

Das neue Feld gehört **nicht** in den Button-`<span>` selbst, sondern als
eigene `basis-full`-Zeile auf Höhe von `reasonLines(p)`. Direkt nach
`{reasonLines(p)}` (Zeile 2331) einfügen:

```jsx
                    {reasonLines(p)}
                    {showTripLinks && (
                      <div className="basis-full" onClick={(e) => e.stopPropagation()}>
                        <input type="text" className={`${inputCls} max-w-xs text-xs py-1`}
                          value={perPeriodDestination[p.s] ?? ""}
                          onChange={(e) => setPerPeriodDestination((prev) => ({ ...prev, [p.s]: e.target.value }))}
                          aria-label={t("results.destinationPeriodAriaLabel")}
                          placeholder={t("results.destinationPeriodPlaceholder", { fallback: tripDestination })} />
                      </div>
                    )}
```

(Die bestehende Zeile `{reasonLines(p)}` bleibt unverändert bestehen, der neue
Block wird direkt danach ergänzt.)

- [ ] **Step 5: Cache-Busting-Version hochzählen**

In `index.html` Zeile 113 `app.jsx?v=32` auf `app.jsx?v=33` ändern und Zeile
85 `locales/de.js?v=23` auf `locales/de.js?v=24` ändern (Task 1 hat
`locales/de.js` bereits verändert, die Version dafür wird hier mit erledigt,
da beide Dateien in derselben Feature-Auslieferung hängen).

- [ ] **Step 6: Manuell im Browser prüfen**

`index.html` im Browser öffnen (z. B. per lokalem Static-Server, falls
`file://` wegen `fetch()` in `data-sources.js` Probleme macht – ein einfacher
`npx serve .` oder `python -m http.server` im Repo-Root reicht). Dann:

1. In den Profi-Modus wechseln, ein Bundesland/Jahr wählen, bei dem mindestens
   ein Zeitraum ≥ 3 Tage entsteht (Standardkonfiguration reicht meist).
2. Prüfen: Buttons „Flüge"/„Unterkunft" erscheinen weiterhin wie zuvor, und
   direkt darunter erscheint das neue kleine Eingabefeld mit Platzhaltertext
   „Abweichendes Reiseziel für diesen Zeitraum" (globales Feld oben ist noch
   leer).
3. Oben im globalen Feld „Paris" eintragen → Platzhalter des neuen Felds
   wechselt zu „Abweichendes Ziel (Standard: Paris)"; Klick auf „Flüge" öffnet
   Google Flights mit „Paris" in der Suchanfrage.
4. Im neuen Feld eines Zeitraums „Rom" eintragen → Klick auf „Flüge"/
   „Unterkunft" **dieses** Zeitraums verwendet „Rom"; ein anderer Zeitraum
   (ohne eigene Eingabe) verwendet weiterhin „Paris".
5. Neues Feld wieder leeren → Zeitraum fällt zurück auf „Paris".
6. Klick in das neue Feld darf die Zeile **nicht** aufklappen/zum Kalender
   scrollen (bestehendes Zeilen-Klickverhalten).
7. Browser-Konsole während der gesamten Prüfung offen halten – keine Fehler/
   Warnungen (insbesondere keine `⚠ <key>`-Ausgabe, die auf einen fehlenden
   Locale-Schlüssel hindeuten würde).

- [ ] **Step 7: Commit**

```bash
git add app.jsx index.html
git commit -m "$(cat <<'EOF'
Optionales Reiseziel pro Zeitraum ergänzen

Überschreibt für Flüge/Unterkunft-Links gezielt das globale Reiseziel-Feld,
falls für einen einzelnen Zeitraum ein abweichendes Ziel gewünscht ist.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Changelog-Eintrag ergänzen

**Files:**
- Modify: `locales/de.js:462-464` (Eintrag `date: "7. August 2026"`, Array
  `items`)

**Interfaces:**
- Consumes: keine (reine Textänderung, kein Code-Interface betroffen).

- [ ] **Step 1: Zweiten Stichpunkt zum bestehenden Eintrag vom 7. August 2026
  ergänzen**

In `locales/de.js` den bestehenden Eintrag

```js
        {
          date: "7. August 2026",
          title: "Trip-Links bei langen freien Zeiträumen",
          items: [
            "Bei freien Zeiträumen ab 3 zusammenhängenden Tagen zeigt der Profi-Modus jetzt zusätzlich Schaltflächen für Google Flights und Booking.com mit dem passenden Datumsbereich – ein schneller Ausgangspunkt für die Reiseplanung. Trag optional ein Reiseziel ein, damit auch das direkt vorausgefüllt wird.",
          ],
        },
```

um einen zweiten Eintrag im `items`-Array erweitern:

```js
        {
          date: "7. August 2026",
          title: "Trip-Links bei langen freien Zeiträumen",
          items: [
            "Bei freien Zeiträumen ab 3 zusammenhängenden Tagen zeigt der Profi-Modus jetzt zusätzlich Schaltflächen für Google Flights und Booking.com mit dem passenden Datumsbereich – ein schneller Ausgangspunkt für die Reiseplanung. Trag optional ein Reiseziel ein, damit auch das direkt vorausgefüllt wird.",
            "Für einzelne Zeiträume mit abweichendem Reiseziel gibt es jetzt direkt unter den Schaltflächen ein eigenes kleines Eingabefeld, das für diesen Zeitraum das Reiseziel oben überschreibt.",
          ],
        },
```

- [ ] **Step 2: Manuell prüfen**

Im Browser die Seite `/neuigkeiten` öffnen, den Eintrag vom 7. August 2026
mit beiden Stichpunkten sichten, keine Konsolenfehler.

- [ ] **Step 3: Commit**

```bash
git add locales/de.js
git commit -m "$(cat <<'EOF'
Changelog: Hinweis auf Pro-Zeitraum-Reiseziel ergänzen

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
