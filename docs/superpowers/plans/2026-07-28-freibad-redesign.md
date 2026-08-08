# FREILOTSE Redesign "Freibad-Kachel" Implementation Plan

> **Status: umgesetzt und ausgeliefert** (29. Juli 2026). Abschluss-Commit
> `08f100d`, Nachbesserungen aus dem Gesamt-Review in `c6d8603`, `ddc20b9`
> und `a97e72a`. Changelog-Eintrag „Neues Erscheinungsbild: Freibad-Kachel"
> vom 29. Juli 2026 (`locales/de.js`, `changelog.entries`).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the entire FREILOTSE app (marketing pages + the dense Planer screen in Einfach- and Profi-Modus) from a generic Tailwind-default dark-navy/emerald look to the warm "Freibad-Kachel" identity approved in `docs/superpowers/specs/2026-07-28-freibad-redesign-design.md`, with light mode as the new default.

**Architecture:** This is a pure visual re-skin (colors, typography, shapes/radii, spacing) — zero changes to component structure, props, state, routing, or business logic (`plan()`, `buildDays()`, share-link format, local storage). All changes are Tailwind class-string replacements plus one small `tailwind.config` extension (no build step exists — Tailwind runs via the CDN `<script>` tag already in `index.html`) and one new plain CSS file for the handful of things Tailwind utilities can't express (wave divider, warm shadows).

**Tech Stack:** Plain React 18 (global `React`/`ReactDOM`), Babel-standalone JSX-in-browser, Tailwind Play CDN (`cdn.tailwindcss.com`) — no bundler, no npm, no TypeScript. Testing is manual: serve the static files (`python -m http.server 8000` from the repo root) and verify in a real browser; there is no automated test suite in this project.

## Global Constraints

- **Reiner visueller Neuanstrich.** Never change a component's props, state shape, event handlers, conditional branching order, or which `t()` keys are used — only the class strings (and, where explicitly noted below, small structural additions like a size class or a wrapper `<span>` purely for visual layering).
- **Logo files (`assets/logo/*.svg`) are untouched.** Do not edit them in any task.
- **Manual dark-mode pattern stays**: every existing `dark ? "X" : "Y"` ternary stays a ternary — do not switch to Tailwind's `dark:` variant anywhere (the codebase never uses it, keep it that way for consistency). `jsx/legal-pages.jsx` is the one exception: it has no `dark` ternary at all (hardcoded dark-only palette, no toggle) — keep it single-theme, just retint its fixed palette (see Task 6).
- **Light becomes the default.** Every `useState(true) // dark` (there are five: `app.jsx`, `jsx/about-page.jsx`, `jsx/changelog-page.jsx`, `jsx/guide-page.jsx`, `jsx/puzzle-page.jsx`) becomes `useState(false)`. This is a one-line change per file, done as the *last* step of that file's task (so you develop/screenshot the new light look by default, and dark is still reachable via the existing toggle button for verification).
- **Cache-busting**: every time a file's contents change, bump its `?v=N` query string in `index.html` by 1. `index.html` itself has no version string (it's the entry point, browsers always refetch it).
- **Changelog rule (CLAUDE.md)**: this redesign is a user-visible change, so the final task adds one new entry to `changelog.entries` in `locales/de.js` (newest first), per the existing tone/format.
- **Test server**: `python -m http.server 8000` from the repo root (`C:\Users\jrive\OneDrive\Dokumente\GitHub\freilotse\.claude\worktrees\design-experiment`), then open `http://localhost:8000/`. Keep it running across tasks (background process); only restart if it dies.
- **Browser console must stay clean.** After every task's visual check, also check the browser console for new errors/warnings (missing `window.FREILOTSE.*` refs, Babel/JSX syntax errors, 404s for fonts/CSS) before committing.

### Color mapping table (apply everywhere in every task)

Base UI tokens (added to `tailwind.config`, see Task 1):

| Old (Tailwind default) | New token class | Notes |
|---|---|---|
| `bg-slate-950` (dark root bg) | `bg-tiefwasser` | `#0B1E36`, from the existing logo |
| `bg-slate-900` (dark header/card bg) | `bg-tiefwasser-hell` | `#15304F`, lighter navy for layering — new shade, same hue as logo navy |
| `bg-slate-800`, `bg-slate-800/60`, `bg-slate-700` | `bg-tiefwasser-hell` / `bg-tiefwasser-hell/60` | keep any existing `/NN` opacity suffix as-is |
| `bg-slate-100`, `bg-slate-50`, `bg-white` (light surfaces) | `bg-kalkstein` | `#FFFDF8` |
| light-mode page background (`bg-slate-100` on root wrappers) | `bg-sonnencreme` | `#F7F1E4` — only for the *page* background, not cards (cards use `bg-kalkstein`) |
| `bg-black/60`, `bg-slate-900/40` (modal overlays) | `bg-tiefwasser/60` | |
| `text-slate-100`, `text-slate-200` (dark-mode light text) | `text-sonnencreme` / `text-sonnencreme/90` | |
| `text-slate-300` (dark-mode secondary text) | `text-sonnencreme/80` | |
| `text-slate-400` (dark-mode muted text) | `text-sonnencreme/60` | |
| `text-slate-500` (light-mode muted text) | `text-espresso/60` | |
| `text-slate-600` (light-mode secondary text) | `text-espresso/80` | |
| `text-slate-700` (light-mode body text) | `text-espresso` | `#4A3F35` |
| `text-slate-900` (light-mode high-contrast heading) | `text-tiefwasser` | |
| `text-white` (on solid-color buttons/headers) | `text-kalkstein` | warm near-white instead of stark white |
| `border-slate-600`, `border-slate-700`, `border-slate-800` (dark borders) | `border-tiefwasser-hell` | |
| `border-slate-300` (light borders) | `border-beckenwasser/30` | |
| `border-slate-200` (light dividers/card borders) | `border-beckenwasser/20` | |
| `divide-slate-800` | `divide-tiefwasser-hell` | |
| `divide-slate-100` | `divide-beckenwasser/20` | |
| `ring-emerald-500`, `ring-emerald-400` (focus rings — used everywhere) | `ring-beckenwasser` | direct 1:1 swap |
| `bg-emerald-600` / `hover:bg-emerald-700` (primary CTA buttons, e.g. "Einfach starten", PayPal-Button, Rätsel "Auswerten"/"Ergebnis teilen"/"Jetzt planen") | `bg-sonnenkoralle` / `hover:bg-sonnenkoralle/90` | per the approved spec, Koralle is the CTA color — this is the one place it appears often, which is correct (primary buttons are the "sparse but present" CTA use case) |
| `rounded-md` (generic boxes/buttons/inputs) | `rounded-xl` | |
| `rounded-lg` (already-rounder elements) | `rounded-2xl` | |
| `rounded-xl` (cards) | `rounded-3xl` | |
| `shadow-sm`, `shadow`, `shadow-lg`, `shadow-xl` (any card/modal shadow) | append ` shadow-warm` (light) or ` shadow-warm-dark` (dark), keep the Tailwind shadow class too is *not* needed — **replace** the Tailwind shadow class outright with the new one, chosen by the existing `dark ? … : …` ternary at that call site |

Calendar/semantic status colors (used only in `dayClass`-equivalent functions in `app.jsx` and `jsx/puzzle-page.jsx`, and in the legend arrays):

| Meaning | Old class(es) | New token |
|---|---|---|
| Urlaubstag (vac) | `bg-emerald-600 text-white` | `bg-beckenwasser text-kalkstein` |
| Überstundenabbau (ot) | `bg-sky-600 text-white` | `bg-lagune text-kalkstein` — **new token**, see note below |
| Feiertag an Arbeitstag | `bg-rose-600 text-white` | `bg-ziegelrot text-kalkstein` — **new token** |
| Feiertag an freiem Tag (muted) | dark: `bg-rose-900/70 text-rose-300` / light: `bg-rose-200 text-rose-800` | dark: `bg-ziegelrot/30 text-ziegelrot-hell` / light: `bg-ziegelrot-hell text-ziegelrot` |
| Sonderfall voll frei (24./31.12., cost 0) | dark: `bg-amber-400 text-amber-950` / light: `bg-amber-300 text-amber-900` | dark: `bg-sonnengelb text-tiefwasser` / light: `bg-sonnengelb text-tiefwasser` — **new token** |
| Sonderfall halber Tag (cost 0.5) | dark: `bg-amber-900/70 text-amber-300` / light: `bg-amber-100 text-amber-800` | dark: `bg-sonnengelb/30 text-sonnengelb-hell` / light: `bg-sonnengelb-hell text-tiefwasser/80` |
| Wochenende | dark: `bg-slate-800 text-slate-600` / light: `bg-slate-200 text-slate-400` | dark: `bg-tiefwasser-hell/60 text-sonnencreme/40` / light: `bg-espresso/10 text-espresso/40` |
| Regelmäßig frei (kein Wochenende) | dark: `bg-slate-800/60 text-slate-500 border border-dashed border-slate-700` / light: `bg-slate-100 text-slate-400 border border-dashed border-slate-300` | dark: `bg-tiefwasser-hell/30 text-sonnencreme/30 border border-dashed border-tiefwasser-hell` / light: `bg-espresso/5 text-espresso/30 border border-dashed border-espresso/20` |
| Regulärer Arbeitstag | dark: `bg-slate-800 text-slate-200 border border-slate-600` / light: `bg-white text-slate-700 border border-slate-200` | dark: `bg-tiefwasser-hell text-sonnencreme border border-tiefwasser-hell` / light: `bg-kalkstein text-espresso border border-beckenwasser/20` |

**Why `lagune`, `ziegelrot`, `sonnengelb` are new tokens beyond the approved 7:** the approved spec's Farbe section defined the general UI palette, not the calendar's semantic status colors. The calendar currently distinguishes *four* simultaneous, mutually-exclusive states (Urlaub/Überstunden/Feiertag/Sonderfall) plus a *separate* ring overlay for "manuell vs. automatisch gesetzt" (see `app.jsx:1356-1359`) and for the active drag-selection preview. Collapsing Überstunden onto Sonnenkoralle (as the brainstorming session's shorthand description implied) would (a) collide with Sonnenkoralle's approved role as a *sparingly*-used CTA accent, since overtime-day tiles can appear dozens of times per year, and (b) still leave Feiertag and Sonderfall needing their own distinct hues, since those must stay visually distinguishable from Urlaub/Überstunden and from each other exactly as before. `lagune` (`#2E8FC2`, a warm pool-lagoon blue), `ziegelrot` (`#C4432A`, brick red — echoes the Kleingarten reference point from brainstorming), and `sonnengelb` (`#F4C542`, sunny yellow) all sit comfortably in the Freibad/Kleingarten world while preserving every existing distinction one-for-one. The **ring stays what it already is** — a manual-vs-automatic indicator and drag-preview, not a vac-vs-ot indicator — just recolored (Task 11).

## Task 1: Foundation — Tailwind config, fonts, base CSS, `index.html`

**Files:**
- Modify: `index.html`
- Create: `css/theme.css`

**Interfaces:**
- Produces: Tailwind color utilities (`bg-sonnencreme`, `bg-kalkstein`, `bg-beckenwasser`, `bg-beckenwasser-hell`, `bg-tiefwasser`, `bg-tiefwasser-hell`, `bg-sonnenkoralle`, `bg-espresso`, `bg-lagune`, `bg-lagune-hell`, `bg-ziegelrot`, `bg-ziegelrot-hell`, `bg-sonnengelb`, `bg-sonnengelb-hell`, and the `text-`/`border-`/`ring-`/`divide-` variants of all of them), font utilities (`font-display`, `font-body`, `font-data`), and CSS classes `.shadow-warm`, `.shadow-warm-dark`, `.wave-divider`, `.wave-divider-dark`. All later tasks consume these.

- [x] **Step 1: Add Google Fonts to `<head>`**

In `index.html`, immediately after the existing `<meta name="apple-mobile-web-app-title" ...>` line (line 15) and before the Tailwind CDN `<script>` (line 16), add:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Manrope:wght@700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

- [x] **Step 2: Add the Tailwind runtime config**

Immediately after the Tailwind CDN `<script src="https://cdn.tailwindcss.com"></script>` line (currently line 16), add:

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          sonnencreme: "#F7F1E4",
          kalkstein: "#FFFDF8",
          beckenwasser: { DEFAULT: "#0E9A70", hell: "#BFE8DC" },
          tiefwasser: { DEFAULT: "#0B1E36", hell: "#15304F" },
          sonnenkoralle: "#FF8A5B",
          espresso: "#4A3F35",
          lagune: { DEFAULT: "#2E8FC2", hell: "#CFE7F3" },
          ziegelrot: { DEFAULT: "#C4432A", hell: "#F2D3C8" },
          sonnengelb: { DEFAULT: "#F4C542", hell: "#FBEAB0" }
        },
        fontFamily: {
          display: ["Manrope", "system-ui", "sans-serif"],
          body: ["Figtree", "system-ui", "sans-serif"],
          data: ['"Space Mono"', "monospace"]
        }
      }
    }
  };
</script>
```

- [x] **Step 3: Create `css/theme.css`**

```css
/* css/theme.css — Freibad-Kachel Redesign: Ergaenzungen jenseits von
   Tailwind-Utilities (Wellen-Motiv, warme Schatten). */

.shadow-warm {
  box-shadow: 0 4px 14px -4px rgba(74, 63, 53, 0.25), 0 2px 6px -2px rgba(74, 63, 53, 0.15);
}

.shadow-warm-dark {
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.45), 0 2px 6px -2px rgba(0, 0, 0, 0.3);
}

.wave-divider {
  display: block;
  width: 100%;
  height: 20px;
  background-repeat: repeat-x;
  background-size: 48px 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='20' viewBox='0 0 48 20'%3E%3Cpath d='M0 10c6 0 6-7 12-7s6 7 12 7 6-7 12-7 6 7 12 7v10H0z' fill='%23BFE8DC'/%3E%3C/svg%3E");
}

.wave-divider-dark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='20' viewBox='0 0 48 20'%3E%3Cpath d='M0 10c6 0 6-7 12-7s6 7 12 7 6-7 12-7 6 7 12 7v10H0z' fill='%2315304F'/%3E%3C/svg%3E");
}
```

- [x] **Step 4: Link the new stylesheet**

In `index.html`, add right after the Tailwind config `<script>` block from Step 2:

```html
<link rel="stylesheet" href="css/theme.css?v=1">
```

- [x] **Step 5: Update the `<body>` default background and `theme-color`**

Change line 12 from:
```html
<meta name="theme-color" content="#0B203A">
```
to:
```html
<meta name="theme-color" content="#F7F1E4">
```

Change line 21 from:
```html
<body class="bg-slate-950">
```
to:
```html
<body class="bg-sonnencreme">
```

- [x] **Step 6: Verify in browser**

Start the server: `python -m http.server 8000` (background). Open `http://localhost:8000/`. Expected: page background is now warm cream instead of black (the rest of the UI still looks like the old dark theme until later tasks land — that's expected and fine at this stage). Open DevTools console: zero errors. Check the Network tab: the Google Fonts stylesheet and `css/theme.css` both return 200.

- [x] **Step 7: Commit**

```bash
git add index.html css/theme.css
git commit -m "Grundlage Freibad-Redesign: Tailwind-Farbtokens, Google Fonts, theme.css"
```

## Task 2: `jsx/common-components.jsx`

**Files:**
- Modify: `jsx/common-components.jsx`
- Modify: `index.html` (bump `?v=` for this file)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1.
- Produces: no signature/prop changes — `CollapsibleCard` and `InfoHint` keep their exact existing props.

- [x] **Step 1: Restyle `CollapsibleCard`'s chevron color** (line 23)

Change:
```jsx
<span className={`text-[10px] transition-transform duration-300 ${open ? "rotate-90" : ""} ${dark ? "text-slate-400" : "text-slate-500"}`}>
```
to:
```jsx
<span className={`text-[10px] transition-transform duration-300 ${open ? "rotate-90" : ""} ${dark ? "text-sonnencreme/60" : "text-espresso/60"}`}>
```

Also change the panel title span (line 20) to use the display font for a bit of character:
```jsx
<span className="text-sm font-bold font-display flex items-center gap-2">
```

- [x] **Step 2: Restyle `InfoHint`'s "i" button and text** (lines 42-49)

Change:
```jsx
className={`ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold align-middle ${
  dark ? "border-slate-600 text-slate-400 hover:bg-slate-800" : "border-slate-300 text-slate-500 hover:bg-slate-100"
}`}
```
to:
```jsx
className={`ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold align-middle ${
  dark ? "border-tiefwasser-hell text-sonnencreme/60 hover:bg-tiefwasser-hell" : "border-beckenwasser/30 text-espresso/60 hover:bg-beckenwasser-hell/40"
}`}
```
And the revealed text span (line 49):
```jsx
<span className={`mt-1 block text-[11px] leading-snug ${dark ? "text-sonnencreme/60" : "text-espresso/60"}`}>{text}</span>
```

- [x] **Step 2: Bump cache-busting version**

In `index.html`, change `jsx/common-components.jsx?v=1` to `?v=2`.

- [x] **Step 3: Verify in browser**

Reload `http://localhost:8000/`, navigate to the Planer (any mode with an info-hint/collapsible card, e.g. Einfachmodus). Click an info "i" icon and an accordion header — confirm the new warm-toned colors render in both light and dark (use the existing theme toggle to check dark). Console clean.

- [x] **Step 4: Commit**

```bash
git add jsx/common-components.jsx index.html
git commit -m "Freibad-Redesign: common-components.jsx (CollapsibleCard, InfoHint)"
```

## Task 3: `jsx/support-components.jsx`

**Files:**
- Modify: `jsx/support-components.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1.
- Produces: `SiteFooter`, `SiteLink`, `SupportFooterLink`, `SupportFloatingButton`, `HeartIcon` — same props/signatures as before.

- [x] **Step 1: Restyle `SupportFooterLink`'s pill button** (line 42-44)

Replace the emerald pill classes with beckenwasser:
```jsx
className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
  dark ? "bg-beckenwasser-hell/20 text-beckenwasser-hell hover:bg-beckenwasser-hell/30" : "bg-beckenwasser-hell/60 text-beckenwasser hover:bg-beckenwasser-hell"
}`}
```
(apply the same structural shape the current code already has — only the color tokens named above change; keep whatever wrapper/icon layout already exists around this className).

- [x] **Step 2: Restyle `SupportFloatingButton`** (line ~121)

Change the floating tab background/shadow/rounding:
```jsx
className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 rounded-l-2xl bg-sonnenkoralle px-3 py-2.5 text-kalkstein shadow-warm hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser"
```
And the heart icon tint (line 122) from `text-emerald-400` to `text-kalkstein` (it now sits on a solid Koralle background, so it should match the button's own text color rather than carry its own accent tint).

- [x] **Step 3: Restyle `SiteFooter`** (around lines 132-135)

Apply the neutral-text mapping table rows (`text-slate-400/500` → `text-sonnencreme/60`/`text-espresso/60`, `text-white` → `text-sonnencreme`/`text-tiefwasser`, `border-slate-800`/`bg-slate-950` → `border-tiefwasser-hell`/`bg-tiefwasser`, `border-slate-200`/`bg-white` → `border-beckenwasser/20`/`bg-sonnencreme`) to every occurrence in this block, following the Global Constraints table exactly.

- [x] **Step 4: Bump cache-busting version**

`jsx/support-components.jsx?v=1` → `?v=2` in `index.html`.

- [x] **Step 5: Verify in browser**

Reload the landing page (`/`) and any sub-page with `SiteFooter` (e.g. `/anleitung`). Confirm footer, floating support button, and footer support pill render in the new palette, light and dark. Console clean.

- [x] **Step 6: Commit**

```bash
git add jsx/support-components.jsx index.html
git commit -m "Freibad-Redesign: support-components.jsx (Footer, Floating-Button, HeartIcon)"
```

## Task 4: `jsx/landing-page.jsx`

**Files:**
- Modify: `jsx/landing-page.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1, restyled `SiteFooter` from Task 3.

- [x] **Step 1: Restyle the header** (line 103)

`<header className="bg-slate-900 text-white">` → `<header className="bg-tiefwasser text-sonnencreme">`. Keep this header always-dark regardless of the page's own theme (matches existing intent — the header band is a fixed brand-navy strip in the current design; do not make it ternary since it wasn't one before).

- [x] **Step 2: Restyle the primary CTA ("Einfach starten")** (lines 148-151)

```jsx
<button onClick={onStartSimple}
  className="w-full rounded-2xl bg-sonnenkoralle px-4 py-3 text-sm font-bold font-display text-kalkstein hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
```

- [x] **Step 3: Restyle the secondary CTA ("Profi starten")** (lines 166-171)

```jsx
<button onClick={onStartPro}
  className={`w-full rounded-2xl border px-4 py-3 text-sm font-bold font-display focus:outline-none focus:ring-2 focus:ring-beckenwasser ${
    dark ? "border-tiefwasser-hell text-sonnencreme hover:bg-tiefwasser-hell" : "border-beckenwasser/30 text-espresso hover:bg-beckenwasser-hell/30"
  }`}>
```

- [x] **Step 4: Sweep remaining occurrences**

Apply the Global Constraints mapping table to every remaining `slate-*`/`emerald-*` class in this file: the benefit-list checkmarks (`text-emerald-500` → `text-beckenwasser`), the step-connector line (`bg-slate-700`/`bg-slate-300` → `bg-tiefwasser-hell`/`bg-beckenwasser/30`), all body/heading text classes, and `rounded-full`/`rounded-md`/`rounded-lg` per the shape mapping. The video play-button (`fill-emerald-600`, `bg-black/20`, `bg-white/90`) becomes `fill-sonnenkoralle`, `bg-tiefwasser/20`, `bg-kalkstein/90`.

- [x] **Step 5: Add the H1/hero heading font**

Wherever the hero headline is rendered (top of the returned fragment, look for the largest heading element), add `font-display` to its className alongside existing size/weight classes.

- [x] **Step 6: Add the wave-divider motif under the header**

Immediately after the closing `</header>` tag (the element restyled in Step 1), insert:
```jsx
<div aria-hidden="true" className={`wave-divider ${dark ? "wave-divider-dark" : ""}`}></div>
```

- [x] **Step 7: Bump cache-busting version**

`jsx/landing-page.jsx?v=5` → `?v=6` in `index.html`.

- [x] **Step 8: Verify in browser**

Reload `/`. Confirm hero, both CTA buttons, benefit checkmarks, step indicators, and the wave-divider under the header all render in the new palette in both light and dark. Console clean.

- [x] **Step 9: Commit**

```bash
git add jsx/landing-page.jsx index.html
git commit -m "Freibad-Redesign: landing-page.jsx"
```

## Task 5: `jsx/about-page.jsx`

**Files:**
- Modify: `jsx/about-page.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1, `PAYPAL_URL`/`SiteFooter`/`SiteLink` from `support-components.jsx` (untouched).

- [x] **Step 1: Restyle the root wrapper** (line 67)

```jsx
<div className={`min-h-screen flex flex-col font-body ${dark ? "bg-tiefwasser text-sonnencreme" : "bg-sonnencreme text-espresso"}`}>
```
(adding `font-body` here sets the default body typeface for the whole page in one place.)

- [x] **Step 2: Restyle the PayPal CTA** (lines 142-145)

```jsx
<a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer" aria-label={t("about.support.buttonAriaLabel")}
  className="inline-flex items-center gap-2 rounded-full bg-sonnenkoralle px-5 py-2.5 text-sm font-bold font-display text-kalkstein hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
```

- [x] **Step 3: Restyle the LinkedIn secondary link** (lines 115-119)

```jsx
className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-beckenwasser ${
  dark ? "border-lagune/40 text-lagune-hell hover:bg-lagune/10" : "border-lagune/30 text-lagune hover:bg-lagune-hell/40"
}`}
```
(LinkedIn's own brand blue maps naturally onto `lagune` rather than beckenwasser/koralle, keeping it visually distinct from the primary CTA.)

- [x] **Step 4: Sweep remaining occurrences**

Apply the mapping table to lines 60-80 (intro section), 104-109 (portrait card — `shadow-md` stays `shadow-md` since it's a photo frame, not a UI card, but update its `border-slate-700`/`border-slate-300` per the table), and 139 (support panel wrapper `bg-slate-950/50` → `bg-tiefwasser/50`). Checkmark bullets (line 132): `text-emerald-500` → `text-beckenwasser`.

- [x] **Step 5: Flip the default theme**

Find this file's local `useState(true)` for its dark/light toggle and change to `useState(false)`.

- [x] **Step 6: Bump cache-busting version**

`jsx/about-page.jsx?v=4` → `?v=5` in `index.html`.

- [x] **Step 7: Verify in browser**

Navigate to `/ueber-freilotse`. Confirm page loads light by default, PayPal button is Koralle, LinkedIn link is Lagune-toned, portrait/card styling looks warm. Toggle dark, confirm it still reads well. Console clean.

- [x] **Step 8: Commit**

```bash
git add jsx/about-page.jsx index.html
git commit -m "Freibad-Redesign: about-page.jsx, Hell als Standard"
```

## Task 6: `jsx/legal-pages.jsx`

**Files:**
- Modify: `jsx/legal-pages.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1. This file has **no** `dark` prop/ternary and stays that way (see Global Constraints) — it is retinted as a single fixed-dark-theme page.

- [x] **Step 1: Retint the fixed dark palette**

Apply this literal substitution throughout the file (no ternary involved, just replace the hardcoded classes):
- `bg-slate-950` → `bg-tiefwasser`
- `text-slate-100` → `text-sonnencreme`
- `border-slate-800` → `border-tiefwasser-hell`
- `bg-slate-900` → `bg-tiefwasser-hell`
- `text-white` → `text-sonnencreme`
- `text-emerald-400` → `text-beckenwasser-hell` (links/highlighted text against the dark background)
- `text-slate-300` → `text-sonnencreme/80`
- `text-emerald-300` (hover states) → `text-beckenwasser`
- `border-slate-700` → `border-tiefwasser-hell`
- `text-slate-400` → `text-sonnencreme/60`
- `rounded-xl` → `rounded-3xl`, `rounded-lg` → `rounded-2xl`, `shadow-sm` → `shadow-warm-dark`

Line 38 (root wrapper) becomes:
```jsx
<div className="min-h-screen bg-tiefwasser text-sonnencreme flex flex-col font-body">
```

- [x] **Step 2: Bump cache-busting version**

`jsx/legal-pages.jsx?v=4` → `?v=5` in `index.html`.

- [x] **Step 3: Verify in browser**

Navigate to `/impressum` and `/datenschutz`. Confirm both render in the new warm-dark palette (still dark-only, no toggle — that's correct/unchanged). Console clean.

- [x] **Step 4: Commit**

```bash
git add jsx/legal-pages.jsx index.html
git commit -m "Freibad-Redesign: legal-pages.jsx (Impressum/Datenschutz, weiterhin dunkel-only)"
```

## Task 7: `jsx/changelog-page.jsx`

**Files:**
- Modify: `jsx/changelog-page.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1.

- [x] **Step 1: Restyle root wrapper and shell**

Apply the shared `min-h-screen` mapping row from Global Constraints (this file shares the exact wrapper string with `about-page.jsx`/`guide-page.jsx`/`puzzle-page.jsx`), adding `font-body` exactly as done in Task 5 Step 1:
```jsx
<div className={`min-h-screen flex flex-col font-body ${dark ? "bg-tiefwasser text-sonnencreme" : "bg-sonnencreme text-espresso"}`}>
```
Apply the same header/card mapping used in Task 5 (lines 47-56, 60, 66, 68).

- [x] **Step 2: Restyle the timeline rail/dot** (lines 81, 85-86, 93)

- `border-emerald-600/30` (rail) → `border-beckenwasser/30`
- `bg-emerald-500` (dot) → `bg-beckenwasser`
- `text-emerald-400/600` (date labels) → `text-beckenwasser-hell` (dark) / `text-beckenwasser` (light)
- `text-emerald-500` (bullet) → `text-beckenwasser`

- [x] **Step 3: Flip default theme**

`useState(true)` → `useState(false)` for this file's local dark state.

- [x] **Step 4: Bump cache-busting version**

`jsx/changelog-page.jsx?v=2` → `?v=3` in `index.html`.

- [x] **Step 5: Verify in browser**

Navigate to `/neuigkeiten`. Confirm timeline renders in Beckenwasser tones, light by default. Console clean.

- [x] **Step 6: Commit**

```bash
git add jsx/changelog-page.jsx index.html
git commit -m "Freibad-Redesign: changelog-page.jsx, Hell als Standard"
```

## Task 8: `jsx/guide-page.jsx`

**Files:**
- Modify: `jsx/guide-page.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1. Structurally identical shell to Task 7 (no timeline, otherwise same mapping rows: lines 47, 49, 53-54, 56, 60, 65-68).

- [x] **Step 1: Apply the shared shell mapping** (same rows as Task 7 Step 1, including the added `font-body` on the root wrapper) to lines 47-68.

- [x] **Step 2: Flip default theme** — `useState(true)` → `useState(false)`.

- [x] **Step 3: Bump cache-busting version** — `jsx/guide-page.jsx?v=2` → `?v=3` in `index.html`.

- [x] **Step 4: Verify in browser**

Navigate to `/anleitung`. Confirm article page renders light by default in the new palette, headings use `font-display` where the file already marks headings bold. Console clean.

- [x] **Step 5: Commit**

```bash
git add jsx/guide-page.jsx index.html
git commit -m "Freibad-Redesign: guide-page.jsx, Hell als Standard"
```

## Task 9: `jsx/puzzle-page.jsx`

**Files:**
- Modify: `jsx/puzzle-page.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1, semantic status-color mapping from Global Constraints (this file renders its own calendar day grid, independent of `app.jsx`'s `dayClass` — locate its equivalent local day-styling logic before starting, e.g. by searching this file for `bg-emerald-600` and `bg-amber` occurrences, which is where the player's own tile-status colors are computed for the puzzle board).

- [x] **Step 1: Restyle shell** (lines 213-241) using the same shared-wrapper (including `font-body`) and card mapping as Tasks 5/7/8.

- [x] **Step 2: Restyle the puzzle's own calendar day tiles**

Find the local function/inline logic in this file that assigns tile background classes (the inventory found `bg-emerald-600`/`bg-emerald-700` at lines 321, 362, 397, 418 for buttons, and `bg-amber-600`/`bg-amber-400` at lines 273/299 for the official/practice badges — confirm whether day-tile coloring itself reuses `window.FREILOTSE...dayClass`-style logic or has its own; if it has its own, apply the identical semantic-color mapping table from Global Constraints: vac→`bg-beckenwasser`, free→neutral, work→neutral, matching what Task 11 does for `app.jsx`). Also add `rounded-full aspect-square font-data` to whatever className produces each day cell, matching the "Beckenrand-Kachel" signature shape.

- [x] **Step 3: Restyle the official/practice result badges** (lines 269, 273, 297, 299)

`bg-emerald-900/40`/`bg-emerald-100`/`text-emerald-300`/`text-emerald-700` (official badge) → `bg-beckenwasser-hell/20`/`bg-beckenwasser-hell`/`text-beckenwasser-hell`/`text-beckenwasser`. `bg-amber-600`/`bg-amber-400`/`text-amber-950` (practice badge) → `bg-sonnengelb`/`bg-sonnengelb`/`text-tiefwasser`.

- [x] **Step 4: Restyle CTA buttons** (lines 321, 362, 366, 397)

Primary "Auswerten"/"Ergebnis teilen"/"Jetzt planen" buttons: `bg-emerald-600 ... text-white` → `bg-sonnenkoralle ... text-kalkstein` (per the Global Constraints CTA row). Secondary "Erneut versuchen" button (line 366): apply the border-button mapping (`border-slate-600`/`border-slate-300` → `border-tiefwasser-hell`/`border-beckenwasser/30`).

- [x] **Step 5: Restyle the share modal** (lines 409-432) using the modal-overlay mapping (`bg-black/60`/`bg-slate-900/40` → `bg-tiefwasser/60`, `rounded-xl`/`shadow-xl` → `rounded-3xl`/`shadow-warm-dark`).

- [x] **Step 6: Flip default theme** — `useState(true)` → `useState(false)`.

- [x] **Step 7: Bump cache-busting version** — `jsx/puzzle-page.jsx?v=4` → `?v=5` in `index.html`.

- [x] **Step 8: Verify in browser**

Navigate to `/raetsel`. Play through: set some days, click "Auswerten", confirm the official-result badge, share modal, and "Erneut versuchen" flow all render in the new palette with circular day tiles. Console clean.

- [x] **Step 9: Commit**

```bash
git add jsx/puzzle-page.jsx index.html
git commit -m "Freibad-Redesign: puzzle-page.jsx, Beckenrand-Kachel-Kalender, Hell als Standard"
```

## Task 10: `app.jsx` — Teil A: Grundgerüst, Kopfbereich, geteilte Stilkonstanten

**Files:**
- Modify: `app.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1.
- Produces: restyled `inputCls`, `labelCls`, `cardCls`, `subLabelCls` shared constants (same variable names, same call sites — every later `app.jsx` task in this plan relies on these already being updated).

- [x] **Step 1: Restyle the root wrapper** (line 1544)

```jsx
<div className={`min-h-screen font-body ${dark ? "bg-tiefwasser text-sonnencreme" : "bg-sonnencreme text-espresso"}`} style={{ fontFeatureSettings: '"tnum"' }}>
```

- [x] **Step 2: Restyle the shared style constants** (lines 1104-1109)

```jsx
const inputCls = dark ? "w-full rounded-xl border border-tiefwasser-hell bg-tiefwasser-hell px-2.5 py-1.5 text-sm text-sonnencreme focus:outline-none focus:ring-2 focus:ring-beckenwasser"
                      : "w-full rounded-xl border border-beckenwasser/30 bg-kalkstein px-2.5 py-1.5 text-sm text-tiefwasser focus:outline-none focus:ring-2 focus:ring-beckenwasser";
const labelCls = `block text-xs font-semibold uppercase tracking-wide ${dark ? "text-sonnencreme/60" : "text-espresso/60"} mb-1`;
const cardCls = dark ? "bg-tiefwasser-hell border border-tiefwasser-hell rounded-3xl shadow-warm-dark" : "bg-kalkstein border border-beckenwasser/20 rounded-3xl shadow-warm";
const subLabelCls = `text-xs font-semibold uppercase tracking-wide ${dark ? "text-sonnencreme/60" : "text-espresso/80"}`;
```
(Note: light-mode `cardCls` now gets a border, fixing the pre-existing dark/light asymmetry the inventory flagged — both themes now have a card border, consistent with the "Kalkstein-Kacheln" layering concept from the spec.)

- [x] **Step 3: Restyle the header/hero region** (around lines 1567-1621)

- Eyebrow label (line 1567, `text-emerald-400`) → `text-beckenwasser` (dark) / no change needed if already theme-aware — check and apply `dark ? "text-beckenwasser-hell" : "text-beckenwasser"`.
- H1 (line 1570) → add `font-display` to the existing className.
- Header buttons (share/save/theme-toggle, lines 1588, 1604, 1616): replace `border-slate-600 ... text-slate-300 hover:bg-slate-800` with `border-tiefwasser-hell ... text-sonnencreme/80 hover:bg-tiefwasser-hell` for the dark literal, and add the light equivalent `border-beckenwasser/30 ... text-espresso/80 hover:bg-beckenwasser-hell/30` if not already ternary (check each; some of these three buttons currently share one hardcoded dark-styled class string used regardless of `dark` — if so, convert to a `dark ? ... : ...` ternary using these two variants, since this is a pure color fix, not a structural change).
- Big free-days number (line 1621, `text-emerald-400`) → `text-sonnenkoralle` (this is the single most prominent number in the whole app — the approved spec calls out "die wichtigste Kennzahl im Kopfbereich" as one of Koralle's two sanctioned uses) and add `font-data` for the tabular Space Mono treatment.
- Directly below the header/hero block (after the closing tag of the element containing the H1 and big number, still inside the same header container), insert the signature wave motif as its own element:
  ```jsx
  <div aria-hidden="true" className={`wave-divider ${dark ? "wave-divider-dark" : ""}`}></div>
  ```
  This is the one and only place the wave divider appears in the Planer view (per the spec: "bewusst sparsam eingesetzt").

- [x] **Step 4: Restyle the legend swatches array** (lines 2320-2337)

```js
["bg-beckenwasser", legend.vacation],
["bg-lagune", legend.overtime],
["bg-ziegelrot", legend.holiday],
["bg-sonnengelb", legend.xmasFree],
["bg-sonnengelb-hell border border-sonnengelb", legend.xmasHalf],
[dark ? "bg-tiefwasser-hell" : "bg-espresso/10", legend.weekend],
[dark ? "bg-tiefwasser-hell/30 border border-dashed border-tiefwasser-hell" : "bg-espresso/5 border border-dashed border-espresso/20", legend.regularlyOff],
[dark ? "bg-tiefwasser-hell ring-2 ring-sonnencreme/50" : "bg-kalkstein ring-2 ring-tiefwasser/40", legend.manualSet],
["bg-ziegelrot-hell", legend.schoolHolidays],
[`bg-transparent border-2 rounded ${dark ? "border-beckenwasser-hell" : "border-beckenwasser"}`, legend.freePeriod],
```
(`legend.schoolHolidays` previously used `bg-orange-400` — mapped to `bg-ziegelrot-hell` here since Sonnenkoralle must stay reserved for CTAs per the spec; this keeps it visually distinct from every other legend swatch.)

- [x] **Step 5: Verify in browser**

Reload `/`, start the Planer (either mode). Confirm header, big number, buttons, and legend all show the new palette in both themes (toggle still works, dark state unchanged for now — flip to `false` default happens in Task 14 for `app.jsx` specifically, since this file has many more tasks left to land first).

- [x] **Step 6: Bump cache-busting version** — `app.jsx?v=21` → `?v=22` in `index.html`.

- [x] **Step 7: Commit**

```bash
git add app.jsx index.html
git commit -m "Freibad-Redesign: app.jsx Teil A (Grundgeruest, Kopfbereich, Legende)"
```

## Task 11: `app.jsx` — Teil B: Kalenderraster (`dayClass`, Ring-Logik, Zeitraum-Overlay)

**Files:**
- Modify: `app.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: `cardCls`/`inputCls` etc. from Task 10 (unaffected here), semantic-color mapping table from Global Constraints.
- Produces: `dayClass(day, selType, dark)` keeps its exact signature and branching order — only return values change.

- [x] **Step 1: Rewrite `dayClass`** (lines 76-107)

```js
function dayClass(day, selType, dark) {
  if (selType === "vac") return "bg-beckenwasser text-kalkstein";
  if (selType === "ot") return "bg-lagune text-kalkstein";
  if (day.holiday) {
    if (day.isWorkingDay) return "bg-ziegelrot text-kalkstein";
    return dark ? "bg-ziegelrot/30 text-ziegelrot-hell" : "bg-ziegelrot-hell text-ziegelrot";
  }
  if (day.special && day.cost === 0 && !day.weekend) return dark ? "bg-sonnengelb text-tiefwasser" : "bg-sonnengelb text-tiefwasser";
  if (day.special && day.cost === 0.5) return dark ? "bg-sonnengelb/30 text-sonnengelb-hell" : "bg-sonnengelb-hell text-tiefwasser/80";
  if (day.weekend) return dark ? "bg-tiefwasser-hell/60 text-sonnencreme/40" : "bg-espresso/10 text-espresso/40";
  if (!day.isWorkingDay) {
    return dark
      ? "bg-tiefwasser-hell/30 text-sonnencreme/30 border border-dashed border-tiefwasser-hell"
      : "bg-espresso/5 text-espresso/30 border border-dashed border-espresso/20";
  }
  return dark ? "bg-tiefwasser-hell text-sonnencreme border border-tiefwasser-hell" : "bg-kalkstein text-espresso border border-beckenwasser/20";
}
```

- [x] **Step 2: Recolor the ring logic** (lines 1356-1359)

The `ring` variable serves two purposes that must stay exactly as they are: a live drag-selection preview, and a persistent "this day was set manually, not automatically" indicator. Only recolor, don't change which condition produces which ring:
```js
const ring = inDrag
  ? clickMode === "vac" ? "ring-2 ring-beckenwasser" : "ring-2 ring-lagune"
  : manual && manual !== "none" ? (dark ? "ring-2 ring-sonnencreme/50" : "ring-2 ring-tiefwasser/40")
  : clickable ? "hover:ring-2 hover:ring-beckenwasser/60" : "";
```

- [x] **Step 3: Restyle the day-cell button shape** (lines 1394-1396)

Change:
```jsx
className={`relative h-7 rounded-md flex items-center justify-center text-[11px] tabular-nums select-none ${
  clickable ? "cursor-pointer" : "cursor-default"
} ${ring} ${dayClass(day, selType, dark)}`}>
```
to:
```jsx
className={`relative h-7 aspect-square rounded-full flex items-center justify-center text-[11px] font-data tabular-nums select-none ${
  clickable ? "cursor-pointer" : "cursor-default"
} ${ring} ${dayClass(day, selType, dark)}`}>
```
(`aspect-square` guarantees the medallion stays circular regardless of the grid column's rendered width; `font-data` applies Space Mono to the day number, per the signature-element spec.)

- [x] **Step 4: Recolor the "freier Zeitraum" overlay border** (lines 1406-1409 and its continuation just below)

Wherever this overlay's border color references emerald (look for `border-emerald` in the `className` on the `<span aria-hidden="true">` overlay), replace with `border-beckenwasser` (and its `/NN` opacity variants if any exist for the dimmed-vs-highlighted states). Keep `rounded-l-md`/`rounded-r-md` on this overlay as `rounded-l-full`/`rounded-r-full` to match the new circular tile shape.

- [x] **Step 5: Verify in browser**

Reload the Planer, open Profi-Modus, look at the calendar grid. Confirm: vacation days are Beckenwasser-green circles, overtime days are Lagune-blue circles, holidays are Ziegelrot-red circles (or muted-red if already free), 24./31.12. are Sonnengelb-yellow, weekends/regular-off are muted neutral circles, manually-set days show the new neutral ring, dragging to select shows the colored preview ring, and multi-day free periods still show a connected Beckenwasser border spanning the row. Test in both light and dark. Test with a non-Mon–Fri `workingWeekdays` setting if easy (Profi-Modus → regelmäßige Arbeitstage) to confirm the "regelmäßig frei" muted state still looks distinct from real weekends. Console clean.

- [x] **Step 6: Bump cache-busting version** — same `app.jsx?v=22` → `?v=23`.

- [x] **Step 7: Commit**

```bash
git add app.jsx index.html
git commit -m "Freibad-Redesign: app.jsx Teil B, Beckenrand-Kachel-Kalender (dayClass, Ring, Zeitraum-Overlay)"
```

## Task 12: `app.jsx` — Teil C: Einfachmodus

**Files:**
- Modify: `app.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: `cardCls`/`inputCls`/`labelCls` from Task 10, `dayClass`/ring from Task 11 (calendar preview inside Einfachmodus, if any, reuses the same function — no separate work needed there).

- [x] **Step 1: Locate the Einfachmodus JSX block**

Grep this file for `simple.stepperTitle` (seen at line 1641 in the earlier inventory) to find the start of the Einfachmodus render block, and read through to where the Profi-Modus block begins (look for a `uiMode === "profi"` or similar branch).

- [x] **Step 2: Sweep every class in that block through the Global Constraints mapping table**

This includes the stepper +/- buttons (`border-slate-600`/`border-slate-300` → `border-tiefwasser-hell`/`border-beckenwasser/30`, `hover:bg-slate-800`/`hover:bg-slate-100` → `hover:bg-tiefwasser-hell`/`hover:bg-beckenwasser-hell/30`), the numeric stepper value display (add `font-data`), and any inline "Entfernen"/"remove block" link buttons (`text-emerald-600` → `text-beckenwasser`, in both the dark and light variants where present).

- [x] **Step 3: Verify in browser**

Reload `/`, start "Einfach" mode. Walk through: pick a vacation-day budget with the stepper, add/remove a Wunschblock, confirm all buttons and text read correctly in the new palette, both themes. Console clean.

- [x] **Step 4: Bump cache-busting version** — `?v=23` → `?v=24`.

- [x] **Step 5: Commit**

```bash
git add app.jsx index.html
git commit -m "Freibad-Redesign: app.jsx Teil C, Einfachmodus"
```

## Task 13: `app.jsx` — Teil D: Profi-Modus (Panels, Overrides, Monatszusammenfassung, Dialoge)

**Files:**
- Modify: `app.jsx`
- Modify: `index.html` (bump `?v=`)

**Interfaces:**
- Consumes: everything from Tasks 10-12.

This is the largest remaining chunk — everything not already covered by Teil A/B/C. Work section by section; each sub-step is independently verifiable, but commit once at the end of the whole task (they all touch the same file and same visual "Profi-Modus" surface).

- [x] **Step 1: Panel headers and inputs**

Sweep the Profi-Modus panel bodies (Allgemein, Kontingente, Wunschblöcke, Regelmäßige Arbeitstage, Gemeinsam frei, Jahreswechsel-Erweiterung) — every `border-slate-*`/`bg-slate-*`/`text-slate-*` through the mapping table. These panels use `CollapsibleCard` (already restyled in Task 2) as their shell, so only the *contents* need sweeping here.

- [x] **Step 2: Month-summary cards** (around lines 2170-2217 per the inventory: `bg-violet-100`/`text-violet-700`, `bg-amber-950/20`/`bg-amber-50`, `border-amber-600/70`/`border-amber-400`, `text-amber-400`/`text-amber-700`, `bg-emerald-100`/`text-emerald-700`)

- Schulferien-Info-Chip (`bg-violet-100`/`text-violet-700`) → `bg-lagune-hell/60`/`text-lagune` (keeps it visually distinct from the amber/emerald chips next to it).
- Feiertags-Hinweis-Kasten (amber) → `bg-sonnengelb-hell`/`border-sonnengelb`/`text-tiefwasser` (dark: `bg-sonnengelb/10`/`border-sonnengelb/70`/`text-sonnengelb-hell`).
- Erfolgs-Chip (emerald) → `bg-beckenwasser-hell/60`/`text-beckenwasser`.

- [x] **Step 3: Warning/error text** (rose/orange occurrences, e.g. lines 1194, 1429, 1434, 1535, 1764, 1858, 1954, 1956-1957, 2108, 2111, 2249, 2256, 2307, 2313, 2390, 2495 per the inventory)

These are the "failedManual"/budget-exceeded/warning messages — map every `text-rose-*`/`text-orange-*`/`bg-rose-*` occurrence to the `ziegelrot` family (`text-ziegelrot`, `bg-ziegelrot-hell`, `border-ziegelrot/40` etc., picking the closest-contrast equivalent shade for each specific dark/light literal). Keep these visually "alarm-like" (still the reddest color in the app) so warnings don't lose urgency.

- [x] **Step 4: Override list, block editor rows, share/local-plan/Gemeinsam-frei sections**

Sweep remaining `slate-*`/`emerald-*`/`sky-*` occurrences (e.g. `divide-slate-800`/`divide-slate-100` at lines 1827/2153/2268, and the various small icon-buttons) through the mapping table.

- [x] **Step 5: Modals** (share dialog, local-plans dialog — lines ~2369-2454 per the inventory)

`bg-black/60`/`bg-slate-900/40` overlay → `bg-tiefwasser/60`; modal panel `bg-slate-900`/`bg-white` → `bg-tiefwasser-hell`/`bg-kalkstein`; `rounded-xl`/`shadow-xl` → `rounded-3xl`/`shadow-warm-dark` (dark) or `shadow-warm` (light); modal action buttons follow the same primary/secondary button mapping as everywhere else (`bg-emerald-600` → `bg-sonnenkoralle` for the primary confirm action, bordered secondary per the table).

- [x] **Step 6: Verify in browser**

Reload `/`, start Profi-Modus. Walk through every panel (expand each `CollapsibleCard`), trigger at least one warning state (e.g. exceed the vacation budget) to see the alarm coloring, open the Teilen-Dialog and the Meine-Pläne-Dialog. Confirm everything reads correctly in both themes. Console clean.

- [x] **Step 7: Flip `app.jsx`'s default theme**

Change `const [dark, setDark] = useState(true);` (line 194) to `useState(false)`.

- [x] **Step 8: Bump cache-busting version** — `?v=24` → `?v=25`.

- [x] **Step 9: Commit**

```bash
git add app.jsx index.html
git commit -m "Freibad-Redesign: app.jsx Teil D (Profi-Modus, Dialoge), Hell als Standard"
```

## Task 14: Vollständige Regression, Changelog-Eintrag, Abschluss-Commit

**Files:**
- Modify: `locales/de.js` (new changelog entry only)
- Verify: every file touched in Tasks 1-13 (no further edits expected unless the regression pass finds a mismatch)

- [x] **Step 1: Full manual regression pass**

With the server still running, click through, in order, in **both** light and dark (use the toggle) and at least once each in **Einfach-** and **Profi-Modus**:
1. `/` (Landing Page)
2. Planer start (both modes), including the calendar grid, a manual override click, a drag-selection, the Teilen-Button/-Dialog, "Meine Pläne" dialog, "Gemeinsam frei" (paste any valid share-link of your own current plan into itself as a smoke test), Jahreswechsel-Erweiterung hint (pick a year whose last period reaches 31.12., e.g. 2027).
3. `/anleitung`, `/neuigkeiten`, `/ueber-freilotse`, `/impressum`, `/datenschutz`, `/raetsel` (play one full round).
4. Resize the browser to a narrow mobile width (~375px) on at least the Planer and Landing Page to confirm nothing overflows or clips with the new rounded shapes/shadows.

For each, confirm: no leftover `slate`/`emerald`/`sky`/`rose`/`amber`/`orange`/`violet` classes visibly render as the old colors (a quick `grep -rn "slate-\|emerald-\|sky-\|rose-\|amber-\|orange-\|violet-" app.jsx jsx/ index.html` should return **zero** matches once this task starts — if it doesn't, go back and fix the missed spot in the relevant earlier task's file before proceeding), keyboard focus rings are visible (Tab through a form), and the browser console has zero errors across every page.

- [x] **Step 2: Add the changelog entry**

In `locales/de.js`, add a new entry at the **start** of the `changelog.entries` array (newest first), following the existing `{ date, title, items[] }` shape and tone:

```js
{
  date: "28. Juli 2026",
  title: "Neues Erscheinungsbild: Freibad-Kachel",
  items: [
    "FREILOTSE hat ein komplett neues, wärmeres Design bekommen – inspiriert vom deutschen Freibad-Sommer statt vom generischen Software-Look.",
    "Der helle Modus ist jetzt Standard; der dunkle Modus bleibt über den bekannten Umschalter erhalten, nur wärmer gestaltet.",
    "Kalendertage erscheinen jetzt als runde Kacheln statt eckiger Kästchen.",
  ],
},
```

Bump `locales/de.js?v=18` → `?v=19` in `index.html`.

- [x] **Step 3: Final verification**

Reload once more from a hard-refresh (clear cache) to confirm the new `locales/de.js` version loads, the changelog entry appears at the top of `/neuigkeiten`, and nothing else regressed.

- [x] **Step 4: Commit**

```bash
git add locales/de.js index.html
git commit -m "Freibad-Redesign: Abschluss, Neuigkeiten-Eintrag"
```

- [x] **Step 5: Stop the test server**

Kill the background `python -m http.server 8000` process.
