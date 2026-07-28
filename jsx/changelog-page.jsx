/* ------------------------------------------------------------------ */
/* jsx/changelog-page.jsx – Seite „Neuigkeiten" (/neuigkeiten).         */
/* Anders als Impressum/Datenschutz bewusst OHNE „noindex" (soll        */
/* indexierbar sein) und mit eigenem, lokalem Dark/Light-Umschalter     */
/* (die Seite hängt nicht am Dark-State von Urlaubsplaner, da sie       */
/* eigenständig über App() geroutet wird) – analog zu jsx/about-page.jsx.*/
/* Wird über Babel-Standalone im Browser verarbeitet (kein Bundler,     */
/* kein Modulsystem, siehe CLAUDE.md). Muss NACH                        */
/* jsx/support-components.jsx geladen werden (nutzt SiteLink/           */
/* SiteFooter). In einer IIFE gekapselt;                                */
/* öffentliche Oberfläche: window.FREILOTSE.ui.                        */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";
  const { useState, useEffect } = React;
  const t = window.I18N.t;
  const { SiteLink, SiteFooter } = window.FREILOTSE.ui;

  function ChangelogPage() {
    const [dark, setDark] = useState(false);

    // document.title + Meta-Description setzen und beim Verlassen wieder
    // herstellen (analog zu jsx/about-page.jsx, bewusst OHNE den Robots-Tag
    // anzufassen, damit die Seite indexierbar bleibt).
    useEffect(() => {
      const previousTitle = document.title;
      document.title = t("changelog.documentTitle");

      let meta = document.querySelector('meta[name="description"]');
      const created = !meta;
      const previousContent = meta ? meta.getAttribute("content") : null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", t("changelog.metaDescription"));

      return () => {
        document.title = previousTitle;
        if (created) meta.remove();
        else if (previousContent === null) meta.removeAttribute("content");
        else meta.setAttribute("content", previousContent);
      };
    }, []);

    const softTextCls = dark ? "text-sonnencreme/80" : "text-espresso/80";
    const cardCls = dark
      ? "bg-tiefwasser-hell border border-tiefwasser-hell rounded-2xl shadow-warm-dark"
      : "bg-kalkstein border border-beckenwasser/20 rounded-2xl shadow-warm";

    return (
      <div className={`min-h-screen flex flex-col font-body ${dark ? "bg-tiefwasser text-sonnencreme" : "bg-sonnencreme text-espresso"}`}>
        <header className={dark ? "border-b border-tiefwasser-hell bg-tiefwasser-hell" : "border-b border-beckenwasser/20 bg-kalkstein"}>
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5">
            <SiteLink to="/" className={`font-bold tracking-tight ${dark ? "text-kalkstein hover:text-beckenwasser-hell" : "text-espresso hover:text-beckenwasser"}`}>
              FREILOTSE
            </SiteLink>
            <div className="flex items-center gap-4">
              <SiteLink to="/" className={`text-sm ${dark ? "text-sonnencreme/80 hover:text-kalkstein" : "text-espresso/80 hover:text-espresso"}`}>
                {t("changelog.backToPlanner")}
              </SiteLink>
              <button onClick={() => setDark(!dark)}
                title={t("theme.toggleTitle")}
                className={`rounded-xl border px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-beckenwasser ${
                  dark ? "border-tiefwasser-hell text-sonnencreme/80 hover:bg-tiefwasser" : "border-beckenwasser/30 text-espresso/80 hover:bg-beckenwasser/5"
                }`}>
                {dark ? t("theme.toLight") : t("theme.toDark")}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
          <article className={`${cardCls} space-y-8 p-5 sm:p-8`}>
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight">{t("changelog.pageTitle")}</h1>
              <p className={`text-sm leading-7 ${softTextCls}`}>{t("changelog.intro")}</p>
            </div>

            <ol className="space-y-6 border-l-2 border-beckenwasser/30 pl-6">
              {t("changelog.entries").map((entry) => (
                <li key={entry.date} className="relative">
                  <span aria-hidden="true"
                    className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full bg-beckenwasser" />
                  <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? "text-beckenwasser-hell" : "text-beckenwasser"}`}>
                    {entry.date}
                  </p>
                  <h2 className="mt-1 text-base font-bold">{entry.title}</h2>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {entry.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="text-beckenwasser">•</span>
                        <span className={softTextCls}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </article>
        </main>

        <SiteFooter dark={dark} />
      </div>
    );
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.ui = window.FREILOTSE.ui || {};
  Object.assign(window.FREILOTSE.ui, { ChangelogPage });
})();
