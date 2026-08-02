# Design-Guide FREILOTSE

> Dieses Dokument fasst die visuelle Sprache von FREILOTSE zusammen: Farben,
> Typografie, Radien/Schatten, Dark-Mode-Mechanik, wiederkehrende
> Komponenten-Muster und die semantische Farbcodierung des Kalenders. Es
> ergänzt [`Fachkonzept`](./FACHKONZEPT.md) und [`IT-Konzept`](./IT-KONZEPT.md)
> um die Designsicht. Alle Werte sind aus dem tatsächlichen Code entnommen
> (`index.html`-Tailwind-Konfiguration, `css/theme.css`, `app.jsx`,
> `jsx/*.jsx`) — bei Widersprüchen gilt der Code als Quelle der Wahrheit.

## 1. Markenidentität

FREILOTSE verbindet zwei Bildwelten im Namen: **frei** (Urlaub, freie Tage)
und **Lotse** (führt sicher durch die Planung). Die visuelle Umsetzung
zitiert bewusst ein **Freibad im Spätsommer** — warmes Cremeweiß wie
Sonnencreme, Beckenwasser-Türkis, Sonnenkoralle als Signalfarbe, ein
wiederkehrendes Wellen-Motiv als Trenner. Das Thema ist kein Zufall: Es
transportiert entspannte, sommerliche Urlaubsstimmung, ohne kitschig zu
wirken, und liefert eine in sich konsistente Farbmetapher (Wasser, Sonne,
Ziegel, Lagune), aus der sich alle weiteren Akzentfarben ableiten.

## 2. Farbpalette

Definiert in `index.html` (`tailwind.config.theme.extend.colors`). Jede
Farbe hat einen sprechenden, zum Freibad-Thema passenden Namen:

| Token | Hex | Verwendung |
|---|---|---|
| `sonnencreme` | `#F7F1E4` | Haupt-Hintergrund (Hellmodus) |
| `kalkstein` | `#FFFDF8` | Karten-/Oberflächenfarbe (Hellmodus), Text auf kräftigen Flächen |
| `beckenwasser` | `#0E9A70` | Primärfarbe: Urlaubstage, primäre Akzente/Ringe |
| `beckenwasser-hell` | `#BFE8DC` | Wellen-Motiv, dezente Flächen |
| `tiefwasser` | `#0B1E36` | Haupt-Hintergrund (Dunkelmodus), dunkler Text auf hellen Flächen |
| `tiefwasser-hell` | `#15304F` | Karten-/Oberflächenfarbe (Dunkelmodus) |
| `sonnenkoralle` | `#FF8A5B` | Support-/Spenden-CTA (Herz-Button, Floating Button) |
| `espresso` | `#4A3F35` | Fließtext (Hellmodus) |
| `lagune` | `#2E8FC2` | Überstundenabbau-Tage, sekundäre Akzente |
| `lagune-hell` | `#CFE7F3` | dezente Flächen zu Lagune |
| `ziegelrot` | `#C4432A` | Feiertage |
| `ziegelrot-hell` | `#F2D3C8` | dezente Feiertags-Fläche |
| `sonnengelb` | `#F4C542` | Sonderfälle (24./31.12.-Regel) |
| `sonnengelb-hell` | `#FBEAB0` | dezente Sonderfall-Fläche |

Jede Farbe mit `-hell`-Variante bildet ein Paar: die kräftige Version für
starke/aktive Zustände, die helle Version für dezente/inaktive Zustände
oder Flächen in der jeweils anderen Helligkeitsstufe.

## 3. Typografie

Drei Schriftfamilien, jede mit klarer Rolle, geladen über Google Fonts
(`index.html`):

| Rolle | Schrift | Tailwind-Klasse | Einsatz |
|---|---|---|---|
| Display | Manrope (700/800) | `font-display` | Überschriften, Kartentitel, Betonungen |
| Fließtext | Figtree (400/500/600/700) | `font-body` | Standardtext (ist zugleich Basis-Fontstack, meist ohne explizite Klasse) |
| Daten/Zahlen | Space Mono (400/700) | `font-data` | Zahlenwerte, Kalenderziffern — mit `tabular-nums` für sauberes Ziffern-Alignment |

`font-data` wird gezielt dort eingesetzt, wo Zahlen untereinanderstehen
(Kalender-Tageszahlen, Kennzahlen) — die feste Zeichenbreite von Space Mono
verhindert "hüpfende" Ziffern.

## 4. Radien und Schatten

Beobachtete Rundungs-Skala (Häufigkeit im Code, `app.jsx`/`jsx/*.jsx`):

| Klasse | Radius | Typischer Einsatz |
|---|---|---|
| `rounded-full` | 9999px | Buttons/Pills, Badges, InfoHint-Kreis |
| `rounded-xl` | 0.75rem | kleinere Elemente, Inputs |
| `rounded-2xl` | 1rem | mittlere Karten, Floating-Button-Ecken |
| `rounded-3xl` | 1.5rem | große Panels/Karten (Hauptkarten der Planung) |

Eigene Schatten in `css/theme.css` statt generischer Tailwind-Schatten, warm
statt neutral-grau, um zur Sonnencreme-Palette zu passen:

```css
.shadow-warm      { box-shadow: 0 4px 14px -4px rgba(74,63,53,.25), 0 2px 6px -2px rgba(74,63,53,.15); }
.shadow-warm-dark { box-shadow: 0 4px 14px -4px rgba(0,0,0,.45), 0 2px 6px -2px rgba(0,0,0,.3); }
```

## 5. Wellen-Motiv

Ein wiederkehrender horizontaler Divider im Wellen-Stil (`css/theme.css`,
`.wave-divider` / `.wave-divider-dark`) trennt Abschnitte auf Landingpage
und anderen Seiten — ein direktes visuelles Zitat des Freibad-Themas, als
Alternative zu einer schlichten Trennlinie. Farbe passt sich dem Modus an
(`beckenwasser-hell` im Hellmodus, `tiefwasser-hell` im Dunkelmodus).

## 6. Dark Mode: State statt Media Query

Wichtig für alle künftigen UI-Änderungen: FREILOTSE nutzt **nicht** Tailwinds
`dark:`-Variant und **nicht** `prefers-color-scheme`. Dark Mode ist ein
expliziter React-State (`const [dark, setDark] = useState(false)`,
Hellmodus ist Standard), den Nutzer:innen im Kopfbereich umschalten. Jede
Komponente wählt ihre Klassen über eine **Ternary pro Element**:

```jsx
className={dark ? "bg-tiefwasser-hell text-sonnencreme" : "bg-kalkstein text-espresso"}
```

Dieses Muster zieht sich durch die gesamte Codebasis (weit über 100
Stellen in `app.jsx`) statt einer globalen CSS-Umschaltung. Grundpaare:

| Rolle | Hellmodus | Dunkelmodus |
|---|---|---|
| Hintergrund | `sonnencreme` | `tiefwasser` |
| Oberfläche/Karte | `kalkstein` | `tiefwasser-hell` |
| Text | `espresso` | `sonnencreme` |

## 7. Semantische Farbcodierung des Kalenders

Das Herzstück der visuellen Sprache: Jeder Kalendertag bekommt seine Farbe
nach **Bedeutung**, nicht nach Position — implementiert in `dayClass()`
(`app.jsx`). Kein Tag bekommt einen Rahmen, außer er ist eine echte
Ausnahme (bewusst: "kein Kasten um jeden x-beliebigen Tag").

| Zustand | Hellmodus | Dunkelmodus | Bedeutung |
|---|---|---|---|
| Urlaub | `bg-beckenwasser text-kalkstein` | (identisch, modusunabhängig) | manuell oder automatisch gesetzter Urlaubstag |
| Überstundenabbau | `bg-lagune text-kalkstein` | (identisch) | manuell oder automatisch gesetzter Überstundentag |
| Feiertag an Arbeitstag | `bg-ziegelrot text-kalkstein` | (identisch) | kräftig, da ein "geretteter" Arbeitstag |
| Feiertag an ohnehin freiem Tag | `bg-ziegelrot-hell text-ziegelrot` | `bg-ziegelrot/30 text-ziegelrot-hell` | dezent, da kein zusätzlicher Nutzen |
| Sonderfall frei (24./31.12., cost 0) | `bg-sonnengelb text-tiefwasser` | (identisch) | halber/freier Tag durch Weihnachtsregel |
| Sonderfall halb (cost 0.5) | `bg-sonnengelb-hell text-tiefwasser/80` | `bg-sonnengelb/30 text-sonnengelb-hell` | halber Urlaubstag nötig |
| Echtes Wochenende | `bg-espresso/10 text-espresso/40` | `bg-tiefwasser-hell/60 text-sonnencreme/40` | stark gedämpft |
| Regelmäßig frei (kein echtes Wochenende) | `bg-espresso/5 text-espresso/30`, gestrichelter Rahmen | `bg-tiefwasser-hell/30 text-sonnencreme/30`, gestrichelter Rahmen | einzige Ausnahme mit bewusstem Rahmen, zur Unterscheidung von echtem Wochenende |
| Normaler Arbeitstag | `bg-kalkstein text-espresso` | `bg-tiefwasser-hell text-sonnencreme` | neutral, ohne jede Betonung |

Die Rahmen-Ausnahme für "regelmäßig frei" ist bewusst: Es ist der einzige
Tagestyp, der sich farblich kaum vom echten Wochenende unterscheidet, aber
fachlich relevant anders behandelt wird (siehe Fachkonzept, Abschnitt 4.4)
— der gestrichelte Rahmen macht den Unterschied sichtbar, ohne die
generelle Regel "kein Rahmen ohne Grund" zu brechen.

## 8. Komponenten-Muster

| Komponente | Datei | Muster |
|---|---|---|
| `CollapsibleCard` | `jsx/common-components.jsx` | Akkordeon-Karte; Höhen-/Fade-Animation über CSS-Grid-Trick (`gridTemplateRows: "0fr" → "1fr"`), Pfeil (`▶`) rotiert 90° beim Öffnen |
| `InfoHint` | `jsx/common-components.jsx` | Kleiner kreisrunder "i"-Button (16×16px); Erklärtext erscheint erst per Klick, nicht per Hover — funktioniert daher auch auf Touch-Geräten |
| `SiteFooter` | `jsx/support-components.jsx` | Schmale Fußzeile, gedämpfte Textfarbe mit Hover-Aufhellung, Rechtliches + Support-Link |
| `SupportFooterLink` | `jsx/support-components.jsx` | Pill-Button (`rounded-full`) in Sonnenkoralle mit Herz-Icon |
| `SupportFloatingButton` | `jsx/support-components.jsx` | Am rechten Rand angedockter Button, nur linke Ecken gerundet (`rounded-l-2xl`); Label blendet sich bei Hover/Fokus per `max-width`-Transition ein; nach 60s automatisch einmalig kurz ausgeklappt (nur ab `sm`-Breakpoint, nicht auf Rechts-/Datenschutzseiten) |

Icons sind durchgehend einfache **Linien-Icons**: `viewBox="0 0 24 24"`,
`fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`,
`strokeLinecap="round"`, `strokeLinejoin="round"` (siehe `HeartIcon`) —
erben ihre Farbe von der umgebenden Textfarbe, keine fest codierten
Icon-Farben.

## 9. Bewusste Prinzipien

- **Bedeutung vor Position**: Farbe zeigt immer, *was* ein Tag ist, nie nur
  *wo* er im Kalender steht.
- **Zurückhaltung als Regel**: Rahmen/Umrandungen nur für echte Ausnahmen —
  ein visuell "lauter" Kalender mit Kästen um jeden Tag würde die wirklich
  wichtigen Tage (Urlaub, Feiertag) untergehen lassen.
- **Klick statt Hover für Erklärungen** (`InfoHint`): funktioniert
  gleichermaßen mit Maus und Touch.
- **Warme statt neutrale Schatten**: selbst technische Details wie
  Box-Shadows zitieren die Sonnencreme-Palette statt generisches Grau.
- **Support-Hinweise zurückhaltend**: der Floating-Button drängt sich nicht
  auf (kein Popup, keine Modal-Unterbrechung), sondern expandiert dezent
  und zeitlich begrenzt.
