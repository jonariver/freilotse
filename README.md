# FREILOTSE

Dein smarter Urlaubsplaner: FREILOTSE plant Brückentage automatisch –
Feiertage, Schulferien und Urlaubstage passend zu deinem Bundesland (oder
Kanton) – kostenlos und ohne Anmeldung.

🔗 Live: https://freilotse.de/

## Funktionen

- Automatische Brückentage-/Urlaubsplanung, wahlweise im Einfach- oder
  Profi-Modus
- Feiertags- und Schulferien-Anbindung an externe APIs mit
  Offline-Fallback (funktioniert auch ohne Netzwerk)
- Regelmäßige Arbeitstage frei einstellbar (z. B. für Teilzeitmodelle)
- Planung per Link teilen – ganz ohne Backend, ohne Konto
- Mehrere Pläne lokal im Browser speichern und verwalten
- „Gemeinsam frei": gemeinsame freie Tage mit Kolleg:innen/Partner:in finden
- Tägliches Brückentage-Rätsel unter [`/raetsel`](https://freilotse.de/raetsel)

## Technischer Stack

FREILOTSE ist eine reine React/JSX-App, die direkt im Browser läuft – über
CDN eingebundenes React und Babel-Standalone für JSX. Es gibt **keinen
Build-Schritt, keinen Bundler, kein npm und kein TypeScript**; jede
Quelldatei ist ein klassisches `<script>`-Tag. Details zu Architektur,
Modulaufteilung und Konventionen stehen in [`CLAUDE.md`](./CLAUDE.md).

## Lokal ausführen

Da nichts gebaut werden muss, reicht ein beliebiger statischer Dev-Server im
Projektverzeichnis, z. B.:

```sh
npx serve .
# oder
python -m http.server
```

Anschließend `index.html` im Browser öffnen.

## Projektstruktur

| Pfad | Inhalt |
|---|---|
| `index.html` | Einstiegspunkt, lädt alle Skripte in der richtigen Reihenfolge |
| `app.jsx` | Zentrale Komponente (`Urlaubsplaner`, `App`), mountet die App |
| `js/` | Reine Logik-Module (Planung, Kalender, Datenquellen, Share-Link, …) |
| `jsx/` | Ausgelagerte UI-Komponenten (Landing Page, rechtliche Seiten, Rätsel, …) |
| `locales/de.js` | Sämtliche Übersetzungen/UI-Texte |
| `assets/`, `css/` | Bilder/Logos und Styles |

## Deployment

Statisches Hosting via Netlify unter der Custom Domain
[freilotse.de](https://freilotse.de/) (weiterhin auch über
[freilotse.netlify.app](https://freilotse.netlify.app/) erreichbar) –
kein Build-Kommando nötig, das Publish-Verzeichnis ist der Repo-Root.
