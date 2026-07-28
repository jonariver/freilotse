/* ------------------------------------------------------------------ */
/* jsx/guide-page.jsx – Seite „Anleitung" (/anleitung).                 */
/* Anders als Impressum/Datenschutz bewusst OHNE „noindex" (soll        */
/* indexierbar sein) und mit eigenem, lokalem Dark/Light-Umschalter     */
/* (die Seite hängt nicht am Dark-State von Urlaubsplaner, da sie       */
/* eigenständig über App() geroutet wird) – analog zu jsx/about-page.jsx*/
/* und jsx/changelog-page.jsx. Wird über Babel-Standalone im Browser    */
/* verarbeitet (kein Bundler, kein Modulsystem, siehe CLAUDE.md). Muss  */
/* NACH jsx/support-components.jsx geladen werden (nutzt SiteLink/      */
/* SiteFooter). In einer IIFE gekapselt; öffentliche Oberfläche:        */
/* window.FREILOTSE.ui.                                                 */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";
  const { useState, useEffect } = React;
  const t = window.I18N.t;
  const { SiteLink, SiteFooter } = window.FREILOTSE.ui;

  function GuidePage() {
    const [dark, setDark] = useState(true);

    // document.title + Meta-Description setzen und beim Verlassen wieder
    // herstellen (analog zu jsx/about-page.jsx, bewusst OHNE den Robots-Tag
    // anzufassen, damit die Seite indexierbar bleibt).
    useEffect(() => {
      const previousTitle = document.title;
      document.title = t("guide.documentTitle");

      let meta = document.querySelector('meta[name="description"]');
      const created = !meta;
      const previousContent = meta ? meta.getAttribute("content") : null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", t("guide.metaDescription"));

      return () => {
        document.title = previousTitle;
        if (created) meta.remove();
        else if (previousContent === null) meta.removeAttribute("content");
        else meta.setAttribute("content", previousContent);
      };
    }, []);

    const softTextCls = dark ? "text-slate-300" : "text-slate-600";
    const cardCls = dark
      ? "bg-slate-900 border border-slate-800 rounded-xl shadow-sm"
      : "bg-white border border-slate-200 rounded-xl shadow-sm";

    return (
      <div className={`min-h-screen flex flex-col ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
        <header className={dark ? "border-b border-slate-800 bg-slate-900" : "border-b border-slate-200 bg-white"}>
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5">
            <SiteLink to="/" className={`font-bold tracking-tight ${dark ? "text-white hover:text-emerald-400" : "text-slate-900 hover:text-emerald-600"}`}>
              FREILOTSE
            </SiteLink>
            <div className="flex items-center gap-4">
              <SiteLink to="/" className={`text-sm ${dark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}>
                {t("guide.backToPlanner")}
              </SiteLink>
              <button onClick={() => setDark(!dark)}
                title={t("theme.toggleTitle")}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  dark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}>
                {dark ? t("theme.toLight") : t("theme.toDark")}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
          <article className={`${cardCls} space-y-8 p-5 sm:p-8`}>
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight">{t("guide.pageTitle")}</h1>
              <p className={`text-sm leading-7 ${softTextCls}`}>{t("guide.intro")}</p>
            </div>

            <div className="space-y-6">
              {t("guide.sections").map((section) => (
                <section key={section.heading}>
                  <h2 className="mb-2 text-lg font-bold">{section.heading}</h2>
                  <div className="space-y-2">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className={`text-sm leading-7 ${softTextCls}`}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </main>

        <SiteFooter dark={dark} />
      </div>
    );
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.ui = window.FREILOTSE.ui || {};
  Object.assign(window.FREILOTSE.ui, { GuidePage });
})();
