# FREILOTSE Redesign "Freibad-Kachel" – Design-Spezifikation

## Kontext

FREILOTSE wirkt aktuell visuell generisch: reiner Tailwind-Standardlook
(`bg-slate-950`, `rounded-md`, ein einziger `emerald`-Akzent, kein eigenes
Typografie-Konzept, Systemschrift überall). Das entspricht fast eins zu eins
einem der drei bekannten "KI-generiertes Design"-Standardmuster (naher-schwarzer
Hintergrund + einzelner knalliger Akzent).

Ziel dieser Spec: eine eigenständige, zum Thema passende visuelle Identität für
die **gesamte App** (nicht nur Marketing-Seiten, explizit inklusive des dichten
Planer-Bildschirms in Einfach- und Profi-Modus), die sich als "warmes
Urlaubsgefühl" anfühlt statt als generisches Dashboard-Tool.

## Rahmenbedingungen (verbindlich)

- **Reiner visueller Neuanstrich.** Informationsarchitektur, Bedienablauf,
  Panel-Struktur, Kalender-Grid-Logik, Routing – alles bleibt exakt wie es ist.
  Es werden ausschließlich Farben, Typografie, Formen/Radien, Icons und
  Abstände verändert.
- **Logo bleibt exakt wie es ist** (`assets/logo/*.svg`, Navy `#0B1E36` +
  Smaragdgrün `#12B886`/`#0E9A70` + Manrope ExtraBold). Keine Änderung an den
  Logo-Dateien selbst; die neue Palette wird bewusst aus diesen bestehenden
  Logo-Farben abgeleitet, damit UI und Marke zusammenpassen.
- **Hell wird der neue Standard-Modus** (aktuell ist Dunkel Standard). Der
  bestehende Hell/Dunkel-Umschalter bleibt erhalten; Dunkel wird keine simple
  Graustufen-Umkehr, sondern eine eigene, wärmere Spiegelung derselben Palette
  (Navy als Basis statt kühlem Slate-950).
- **Gilt für die gesamte App**: Landing Page, Planer (Einfach- und
  Profi-Modus), Anleitung, Neuigkeiten, Über FREILOTSE, Impressum/Datenschutz,
  Brückentage-Rätsel-Seite. Überall dieselbe Farb-/Typo-/Formsprache.
- **Keine Textänderungen** außerhalb dessen, was für neue/geänderte
  UI-Elemente zwingend nötig ist (z. B. falls ein neues visuelles Element ein
  `aria-label` braucht) – bestehende i18n-Struktur (`locales/de.js`, `t()`)
  bleibt unverändert und wird bei Bedarf exakt nach den bestehenden Regeln
  erweitert (siehe CLAUDE.md, Abschnitt „Internationalisierung").
- **Architektur unverändert**: kein Bundler, kein Modulsystem, IIFE +
  `window.FREILOTSE.*`-Namespace, bestehende Ladereihenfolge in `index.html`,
  Cache-Busting-Version (`?v=`) wird bei jeder geänderten Datei hochgezählt.

## Design-Richtung: "Freibad-Kachel"

Bildwelt: **deutscher Sommer/Freibad-Nostalgie** – Mittagssonne am Becken,
Beckenrand-Fliesen, Eis, Kleingarten – bewusst bodenständig-deutsch statt
mediterran, passend zum genuin deutschen Konzept "Brückentage". Navy und Grün
aus dem Logo werden dabei nicht als "nautisch", sondern als "Beckenwasser"
uminterpretiert – kein Widerspruch zur bestehenden Marke, sondern eine
Weiterentwicklung derselben Farb-DNA.

### Farbe

| Name | Hex | Rolle |
|---|---|---|
| Sonnencreme | `#F7F1E4` | Haupt-Hintergrund (Light, neuer Standard) |
| Kalkstein | `#FFFDF8` | Karten/Flächen über dem Hintergrund (Layering) |
| Beckenwasser | `#0E9A70` | Primärfarbe/Interaktion – aus dem Logo-Grün abgeleitet |
| Beckenwasser hell | `#BFE8DC` | Sanfte Fill-Farbe: Tags, ausgewählte Tage, Badges |
| Tiefes Wasser (Navy) | `#0B1E36` | Aus dem Logo – Dark-Mode-Basis + kräftiger Kontrasttext |
| Sonnenkoralle | `#FF8A5B` | Warmer Akzent, sehr sparsam: primäre CTAs, Hervorhebungen |
| Espresso | `#4A3F35` | Fließtext – warmer Braunton statt kühlem Slate-Grau |

Koralle ist die einzige "laute" Farbe und wird rationiert (primäre CTA-Buttons,
wichtigste Kennzahl im Kopfbereich), damit sie nicht verwässert. Dark Mode ist
dieselbe Palette gespiegelt (Navy als Basis, Beckenwasser als Akzent,
Sonnencreme-Ton für Text) – kein nachträglicher Graustufen-Dark-Mode.

### Typografie

Aktuell lädt die App keine eigene Schrift (reiner Systemfont); nur das
Logo-SVG hat "Manrope" hart codiert.

| Rolle | Schrift | Einsatz |
|---|---|---|
| Display | Manrope (ExtraBold/Bold) | Große Überschriften, H1, wichtigste Kennzahl im Kopfbereich – dieselbe Schrift wie im Logo-Schriftzug |
| Body | Figtree (Regular/Medium) | Fließtext, Labels, Buttons, Formulare – humanistisch-rund, warm, gut lesbar auch in dichten Profi-Ansichten |
| Zahlen/Daten | Space Mono (tabular) | Kalendertage, Budget-Zähler, große Kennzahlen – feste Ziffernbreite, leicht eigenwilliger Charakter statt sterilem Code-Mono |

Beispiel-Skala: H1 2.5rem Manrope ExtraBold · Abschnittstitel 1.25rem Manrope
Bold · Fließtext 1rem Figtree Regular · Kleingedrucktes/Labels 0.8125rem
Figtree Medium (Versalien, Buchstabenabstand) · Zahlen in Space Mono, Größe je
Kontext.

### Layout/Formsprache

- Weg von `rounded-md` hin zu großzügig gerundeten Karten/Buttons
  (`rounded-2xl`/`3xl`), Kalendertage werden runde Kacheln statt scharfer
  Quadrate.
- Kalkstein-Karten auf Sonnencreme-Hintergrund mit warmem, weichem Schatten
  (bräunlicher statt kühlgrauer Schattenton).
- Ein wiederkehrender, dezenter Wellen-/Beckenrand-Schwung als Trenner (z. B.
  unter dem Kopfbereich, am oberen Kartenrand) – einzige grafische
  Zusatzformsprache neben den runden Kacheln, bewusst sparsam eingesetzt.
- Primär-Buttons in Sonnenkoralle, eher pillenförmig (`rounded-full`/
  `rounded-xl`); Sekundär-Buttons ruhig in Beckenwasser-Ton mit dünnem Rand.
- Großzügigerer Weißraum im Einfachmodus/auf Marketing-Flächen; im dichten
  Profi-Modus/Kalenderraster bleibt der Abstand kompakt (Funktionalität geht
  vor), bekommt aber durch Farbe/Rundung trotzdem Wärme statt karger Enge.

### Signature-Element: "Beckenrand-Kachel"

Jeder Kalendertag wird als runde Medaillon-Kachel dargestellt statt als
flaches Farbquadrat – die Zahl in Space Mono, umgeben von einem Ring, dessen
Farbe den Status zeigt:

- **normaler Arbeitstag**: ruhig, nur Espresso-Ziffer auf Kalkstein, kein Ring
- **ohnehin frei** (Wochenende/Feiertag): sanfte Beckenwasser-hell-Füllung
- **Urlaubstag** (manuell/automatisch): kräftiger Beckenwasser-Ring
- **Überstundenabbau**: derselbe Ring, aber in Sonnenkoralle – bleibt wie
  bisher klar vom Urlaubstag unterscheidbar

Dies ist die einzige "laute" grafische Idee der gesamten App – Farbe,
Typografie (Space Mono) und Formsprache (rund) laufen hier zusammen. Alles
andere bleibt ruhig und funktional. Das Element taucht überall auf, wo ein
Kalender gezeigt wird (Planer, Brückentage-Rätsel, Teilen-Vorschau/Export) und
wird so zum durchgängigen Wiedererkennungsmerkmal.

## Betroffene Bereiche

Alle bestehenden Seiten/Komponenten laut CLAUDE.md-Modulübersicht:
`app.jsx` (Urlaubsplaner, Einfach- und Profi-Modus, Kalenderdarstellung),
`jsx/landing-page.jsx`, `jsx/legal-pages.jsx`, `jsx/about-page.jsx`,
`jsx/changelog-page.jsx`, `jsx/guide-page.jsx`, `jsx/puzzle-page.jsx`,
`jsx/support-components.jsx`, `jsx/common-components.jsx`. Jeweils nur die
visuelle Schicht (Klassen/Farben/Typografie/Formen), keine
Komponentenstruktur- oder Prop-Änderungen.

## Erfolgskriterien

- Die App fühlt sich beim ersten Blick erkennbar anders an als generisches
  Tailwind-Boilerplate – eigenständige Farbwelt, eigene Typografie, kein
  Standard-Rechteck-Look mehr.
- Logo und UI wirken wie aus einem Guss (keine Farbdissonanz zwischen
  bestehendem Logo und neuer Palette).
- Der dichte Profi-Modus bleibt genauso bedienbar/übersichtlich wie zuvor –
  Wärme darf die Informationsdichte nicht verschlechtern.
- Dark Mode fühlt sich als vollwertige, wärmere Alternative an, nicht als
  lieblose Graustufen-Umkehrung.
- Kontrast/Barrierefreiheit (Fokusringe, Textkontrast) bleibt mindestens auf
  aktuellem Niveau erhalten.

## Nicht Teil dieser Spec

- Keine Änderung an `plan()`/`buildDays()`/Share-Link-Format/lokalen
  Speichersystemen oder sonstiger Logik.
- Keine Änderung an Logo-Dateien selbst.
- Keine strukturelle Layout-Überarbeitung (Panel-Aufteilung, Kalenderraster-
  Struktur, Navigationsfluss) – nur die visuelle Schicht darüber.
- Keine neue Sprache/kein Sprachumschalter (weiterhin nur Deutsch).
- Konkrete CSS-Umsetzung, Utility-Klassen-Zuordnung und Reihenfolge der
  Datei-Änderungen sind nicht Teil dieser Spec, sondern des nachfolgenden
  Implementierungsplans.

## Nächste Schritte

Nach Freigabe dieser Spec: Übergabe an die `writing-plans`-Skill zur
Erstellung eines konkreten Implementierungsplans (betroffene Dateien,
Reihenfolge, Cache-Busting-Versionierung, Testschritte im Browser).
