/* ------------------------------------------------------------------ */
/* jsx/about-page.jsx – Seite „Über FREILOTSE" (/ueber-freilotse).      */
/* Anders als Impressum/Datenschutz bewusst OHNE „noindex" (soll        */
/* indexierbar sein) und mit eigenem, lokalem Dark/Light-Umschalter     */
/* (die Seite hängt nicht am Dark-State von Urlaubsplaner, da sie       */
/* eigenständig über App() geroutet wird). Wird über Babel-Standalone   */
/* im Browser verarbeitet (kein Bundler, kein Modulsystem, siehe        */
/* CLAUDE.md). Muss NACH jsx/support-components.jsx geladen werden      */
/* (nutzt SiteLink/SiteFooter/PAYPAL_URL). In einer IIFE gekapselt;     */
/* öffentliche Oberfläche: window.FREILOTSE.ui.                        */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";
  const { useState, useEffect } = React;
  const t = window.I18N.t;
  const { SiteLink, SiteFooter, PAYPAL_URL, LanguageSwitcher } = window.FREILOTSE.ui;

  const LINKEDIN_URL = "https://www.linkedin.com/in/jonathan-rivera-a701a817b";

  // Kleines Inline-SVG (nur "in"-Schriftzug, ohne Marken-Hintergrundquadrat),
  // damit es sich per currentColor in die bestehende Mint-/Slate-Farbwelt
  // einfügt statt als eigenständiges blaues LinkedIn-Badge zu wirken.
  function LinkedInIcon({ className = "" }) {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="14" height="14"
        className={className} fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.368-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.554V9h3.565v11.452z" />
      </svg>
    );
  }

  function AboutPage() {
    const [dark, setDark] = useState(false);

    // document.title + Meta-Description setzen und beim Verlassen wieder
    // herstellen (analog zum Robots-Meta-Muster in LegalLayout, hier aber
    // bewusst OHNE den Robots-Tag anzufassen, damit die Seite indexierbar bleibt).
    useEffect(() => {
      const previousTitle = document.title;
      document.title = t("about.documentTitle");

      let meta = document.querySelector('meta[name="description"]');
      const created = !meta;
      const previousContent = meta ? meta.getAttribute("content") : null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", t("about.metaDescription"));

      return () => {
        document.title = previousTitle;
        if (created) meta.remove();
        else if (previousContent === null) meta.removeAttribute("content");
        else meta.setAttribute("content", previousContent);
      };
    }, []);

    const softTextCls = dark ? "text-sonnencreme/80" : "text-espresso/80";
    const mutedTextCls = dark ? "text-sonnencreme/60" : "text-espresso/60";
    const cardCls = dark
      ? "bg-tiefwasser-hell border border-tiefwasser-hell rounded-3xl shadow-warm-dark"
      : "bg-kalkstein border border-beckenwasser/20 rounded-3xl shadow-warm";

    return (
      <div className={`min-h-screen flex flex-col font-body ${dark ? "bg-tiefwasser text-sonnencreme" : "bg-sonnencreme text-espresso"}`}>
        <header className={dark ? "border-b border-tiefwasser-hell bg-tiefwasser-hell" : "border-b border-beckenwasser/20 bg-kalkstein"}>
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5">
            <SiteLink to="/" className={`font-bold tracking-tight ${dark ? "text-kalkstein hover:text-beckenwasser-hell" : "text-espresso hover:text-beckenwasser"}`}>
              FREILOTSE
            </SiteLink>
            <div className="flex items-center gap-4">
              <SiteLink to="/" className={`text-sm ${dark ? "text-sonnencreme/80 hover:text-kalkstein" : "text-espresso/80 hover:text-espresso"}`}>
                {t("about.backToPlanner")}
              </SiteLink>
              <button onClick={() => setDark(!dark)}
                title={t("theme.toggleTitle")}
                className={`rounded-xl border px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-beckenwasser ${
                  dark ? "border-tiefwasser-hell text-sonnencreme/80 hover:bg-tiefwasser" : "border-beckenwasser/30 text-espresso/80 hover:bg-beckenwasser/5"
                }`}>
                {dark ? t("theme.toLight") : t("theme.toDark")}
              </button>
              <LanguageSwitcher dark={dark} />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
          <article className={`${cardCls} space-y-8 p-5 sm:p-8`}>
            <div>
              <h1 className="mb-4 text-3xl font-bold tracking-tight">{t("about.pageTitle")}</h1>
              {/* Porträt: feste width/height-Attribute verhindern Layout-Shift beim
                  Laden; die tatsächliche Anzeigegröße (112px mobil, 128px ab sm)
                  wird über Tailwind-Klassen gesteuert (object-cover, keine Verzerrung).
                  Mobil zentriert über dem Text, ab sm links davon, vertikal zentriert. */}
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                <img
                  src="assets/jonathan-portrait-freilotse.png"
                  alt={t("about.portraitAlt")}
                  width="128"
                  height="128"
                  loading="eager"
                  decoding="async"
                  className={`h-28 w-28 shrink-0 rounded-full object-cover shadow-md sm:h-32 sm:w-32 ${
                    dark ? "border-2 border-tiefwasser-hell" : "border-2 border-beckenwasser/20"
                  }`}
                />
                <div className="space-y-3">
                  <p className={`text-lg font-semibold ${dark ? "text-sonnencreme/90" : "text-espresso"}`}>{t("about.intro")}</p>
                  <p className={`text-sm leading-7 ${softTextCls}`}>{t("about.body1")}</p>
                  <p className={`text-sm leading-7 ${softTextCls}`}>{t("about.body2")}</p>
                  {/* Dezenter Text-Button im bestehenden Emerald-Akzent (analog zum
                      Theme-Umschalter oben) statt einer dominanten CTA-Pille wie beim
                      PayPal-Button weiter unten. */}
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
                    aria-label={t("about.linkedin.ariaLabel")}
                    className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-beckenwasser ${
                      dark ? "border-lagune/40 text-lagune-hell hover:bg-lagune/10" : "border-lagune/30 text-lagune hover:bg-lagune-hell/40"
                    }`}>
                    <LinkedInIcon />
                    {t("about.linkedin.linkText")}
                  </a>
                </div>
              </div>
            </div>

            <section>
              <h2 className="mb-3 text-lg font-bold">{t("about.values.heading")}</h2>
              <ul className="space-y-2 text-sm">
                {t("about.values.items").map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="text-beckenwasser">✓</span>
                    <span className={softTextCls}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`space-y-4 rounded-2xl p-5 ${dark ? "bg-tiefwasser/50 border border-tiefwasser-hell" : "bg-beckenwasser/5 border border-beckenwasser/20"}`}>
              <h2 className="text-lg font-bold">{t("about.support.heading")}</h2>
              <p className={`text-sm leading-7 ${softTextCls}`}>{t("about.support.text")}</p>
              <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer" aria-label={t("about.support.buttonAriaLabel")}
                className="inline-flex items-center gap-2 rounded-full bg-sonnenkoralle px-5 py-2.5 text-sm font-bold font-display text-kalkstein hover:bg-sonnenkoralle/90 focus:outline-none focus:ring-2 focus:ring-beckenwasser">
                {t("about.support.button")}
              </a>
            </section>

            <p className={`text-xs ${mutedTextCls}`}>
              {t("about.contact.prefix")}
              <a href="mailto:freilotse@outlook.de"
                className={`underline decoration-beckenwasser/30 underline-offset-2 ${dark ? "text-beckenwasser-hell hover:text-beckenwasser/80" : "text-beckenwasser hover:text-beckenwasser/80"}`}>
                freilotse@outlook.de
              </a>
              {t("about.contact.suffix")}
            </p>
          </article>
        </main>

        <SiteFooter dark={dark} />
      </div>
    );
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.ui = window.FREILOTSE.ui || {};
  Object.assign(window.FREILOTSE.ui, { AboutPage });
})();
