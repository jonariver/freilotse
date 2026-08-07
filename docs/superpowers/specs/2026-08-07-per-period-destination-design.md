# Reiseziel pro Zeitraum – Design-Spezifikation

## Kontext

Im Profi-Modus zeigen freie Zeiträume ab `TRIP_LINKS_MIN_LEN` zusammenhängenden
Tagen Buttons für Google Flights und Booking.com (`app.jsx`, Abschnitt „Freie
Perioden"). Beide Links nutzen bisher ausschließlich das **eine globale**
Freitextfeld `tripDestination` oberhalb der Liste. Wer im selben Jahr mehrere
Zeiträume mit unterschiedlichen Reisezielen plant (z. B. Mai nach Paris, an
Weihnachten woanders hin), muss das globale Feld zwischen den Klicks manuell
umschreiben – das wurde als unpraktisch erkannt.

Ziel dieser Spec: ein optionales, kleines Zusatzfeld direkt unter den vier
Aktions-Buttons jedes Zeitraums, das nur für **diesen** Zeitraum das globale
Reiseziel überschreibt.

## Entscheidungen (mit Nutzer abgestimmt)

- **Override mit Fallback**, kein Ersatz des globalen Felds: Global bleibt der
  Standardwert/Startpunkt. Das neue Feld pro Zeitraum ist optional; leer =
  Verhalten wie bisher (globales Feld gilt).
- **Keine Persistierung.** Genau wie `tripDestination` selbst wird der
  Pro-Zeitraum-Wert **nicht** im Share-Link und **nicht** in lokal gespeicherten
  Plänen abgelegt (kein Einfluss auf `SHARE_VERSION`, `js/share-link.js` oder
  `js/local-plans.js`). Reiner UI-Zustand, geht bei Reload verloren.
- Betrifft ausschließlich Flüge/Unterkunft-Links, keinen ICS-/Google-Kalender-
  Export (die kennen kein Reiseziel).

## Architektur / Datenfluss

- Neuer State in `Urlaubsplaner` (`app.jsx`, neben `tripDestination`):
  ```js
  const [perPeriodDestination, setPerPeriodDestination] = useState({});
  ```
  Objekt `{ [dayIndex]: string }`. `dayIndex` ist `p.s` – der Index des
  Starttags im `days`-Array des aktuellen Jahres. Dieser Index ist innerhalb
  einer Berechnung für (Jahr, Konfiguration) stabil und bereits an anderer
  Stelle (Perioden-Rendering) als natürlicher Bezugspunkt in Gebrauch. Da der
  State ohnehin nicht persistiert wird, ist ein gelegentlich verwaister Key
  nach einer Neuberechnung (z. B. wenn sich Zeiträume verschieben) unschädlich
  – er wird schlicht nicht mehr angezeigt/verwendet.
- Effektives Ziel je Zeitraum (kleine Hilfsfunktion oder inline):
  ```js
  const effectiveDestination = (p) =>
    (perPeriodDestination[p.s] ?? "").trim() || tripDestination;
  ```
- `googleFlightsUrl(startDay, endDay, destination)` und `bookingUrl(p,
  destination)` bleiben in ihrer Signatur **unverändert** – es wird lediglich
  `effectiveDestination(p)` statt `tripDestination` übergeben.

## UI

- Neues Textfeld erscheint **nur**, wenn die Flüge/Unterkunft-Buttons ohnehin
  sichtbar sind (`certainLen >= TRIP_LINKS_MIN_LEN`), als eigene `basis-full`-
  Zeile direkt nach der Button-Zeile (gleiche Position/Musterung wie
  `reasonLines(p)` bzw. die Jahreswechsel-Hinweisbox).
- Kleines Eingabefeld (dezenter als das globale Feld, kein eigenes `<label>`,
  stattdessen `aria-label` – Platzierung macht den Bezug bereits visuell klar).
- Placeholder zeigt das aktuell aktive globale Ziel als Kontext, z. B. via
  `t("results.destinationPeriodPlaceholder", { fallback: tripDestination })`;
  ist das globale Feld leer, greift ein generischer Platzhaltertext.
- `onClick={(e) => e.stopPropagation()}` auf dem Feld (wie bei den
  bestehenden Buttons/Links in der Zeile), damit ein Klick nicht die Zeile
  aufklappt/scrollt. Kein zusätzlicher Tastatur-Fix nötig – `onRowKeyDown`
  reagiert bereits nur bei `e.target === e.currentTarget`.
- `onChange` aktualisiert `perPeriodDestination` unveränderlich:
  ```js
  setPerPeriodDestination((prev) => ({ ...prev, [p.s]: e.target.value }));
  ```

## Locale (`locales/de.js`)

Neue Schlüssel unter `results.*`, analog zu `destinationLabel`/
`destinationPlaceholder`:
- `destinationPeriodPlaceholder`: Funktion `(p) => …`, nimmt den aktuellen
  globalen Fallback-Wert entgegen und baut z. B.
  `"Abweichendes Ziel (Standard: Paris)"` bzw. bei leerem Fallback einen
  neutralen Text wie `"Abweichendes Reiseziel für diesen Zeitraum"`.
- `destinationPeriodAriaLabel`: statischer Text fürs `aria-label`.

## Nebenarbeiten (laut CLAUDE.md verbindlich)

- Cache-Busting-Version (`?v=…`) für `app.jsx` und `locales/de.js` in
  `index.html` hochzählen.
- Neuer Eintrag in `changelog.entries` (`locales/de.js`), da nutzersichtbare
  Änderung: kurzer, freundlicher Hinweis auf das neue Pro-Zeitraum-Reiseziel.

## Nicht-Ziele

- Keine Änderung an `js/share-link.js`, `js/local-plans.js` oder
  `SHARE_VERSION`.
- Kein Rückbau/Ersatz des globalen Felds.
- Keine Änderung an ICS-/Google-Kalender-Export.
