/* ------------------------------------------------------------------ */
/* jsx/common-components.jsx – wiederverwendbare, generische UI-Bausteine */
/* ohne Seiten-/Domänenbezug. Wird über Babel-Standalone im Browser      */
/* verarbeitet (kein Bundler, kein Modulsystem, siehe CLAUDE.md). In     */
/* einer IIFE gekapselt, damit lokale Konstanten/Hilfsfunktionen nicht   */
/* unnötig global werden; öffentliche Oberfläche: window.FREILOTSE.ui.  */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";
  const { useState } = React;
  const t = window.I18N.t;

  /* Einklappbare Karte (Accordion) im Stil des Einfachmodus.
     Sanfte Height- und Fade-Animation über den CSS-Grid-Trick (0fr -> 1fr). */
  function CollapsibleCard({ icon, title, open, onToggle, dark, cardCls, children }) {
    return (
      <section className={`${cardCls} overflow-hidden`}>
        <button type="button" onClick={onToggle}
          className="w-full flex items-center justify-between px-4 py-3 text-left">
          <span className="text-sm font-bold font-display flex items-center gap-2">
            <span aria-hidden="true">{icon}</span> {title}
          </span>
          <span className={`text-[10px] transition-transform duration-300 ${open ? "rotate-90" : ""} ${dark ? "text-sonnencreme/60" : "text-espresso/60"}`}>
            ▶
          </span>
        </button>
        <div className="grid transition-all duration-300 ease-in-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}>
          <div className="overflow-hidden">
            <div className="px-4 pb-4 space-y-4">{children}</div>
          </div>
        </div>
      </section>
    );
  }

  /* Kleines Info-Icon: die ausführliche Erklärung erscheint erst auf Klick */
  function InfoHint({ text, dark }) {
    const [show, setShow] = useState(false);
    return (
      <span className="inline">
        <button type="button" onClick={() => setShow(!show)} title={t("common.moreInfo")}
          className={`ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold align-middle ${
            dark ? "border-tiefwasser-hell text-sonnencreme/60 hover:bg-tiefwasser-hell" : "border-beckenwasser/30 text-espresso/60 hover:bg-beckenwasser-hell/40"
          }`}>
          i
        </button>
        {show && (
          <span className={`mt-1 block text-[11px] leading-snug ${dark ? "text-sonnencreme/60" : "text-espresso/60"}`}>{text}</span>
        )}
      </span>
    );
  }

  /* Auswahldialog für externe Reiseportale (Unterkunft: Booking.com/Trip.com,
     Flüge: Google Flights/Skyscanner). Bewusst generisch gehalten: die Optionen
     kommen als Liste herein, alle Texte als fertige Strings – diese Komponente
     kennt weder Portale noch Zeiträume.

     Die Optionen sind absichtlich echte <a target="_blank">-Links und keine
     Buttons, damit Mittelklick/„In neuem Tab öffnen" erhalten bleiben. */
  function PortalChoiceDialog({ dark, ariaLabel, title, subtitle, options, hint, cancelLabel, onClose }) {
    // Im Dark-Mode bewusst border-sonnencreme statt border-tiefwasser-hell:
    // die Dialogkarte ist selbst tiefwasser-hell, ein gleichfarbiger Rand
    // wäre unsichtbar und die Optionen sähen aus wie bloßer Text.
    const optionCls = `block w-full rounded-xl border px-3 py-2 text-center text-sm font-semibold ${
      dark ? "border-sonnencreme/40 text-sonnencreme hover:bg-sonnencreme/10" : "border-beckenwasser/30 text-espresso hover:bg-beckenwasser-hell/30"
    }`;
    return (
      <div role="dialog" aria-modal="true" aria-label={ariaLabel}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tiefwasser/60"
        onClick={onClose}>
        <div className={`w-full max-w-xs rounded-3xl p-4 space-y-3 ${dark ? "bg-tiefwasser-hell border border-tiefwasser-hell shadow-warm-dark" : "bg-kalkstein border border-beckenwasser/20 shadow-warm"}`}
          onClick={(e) => e.stopPropagation()}>
          <div>
            <p className="text-sm font-bold">{title}</p>
            <p className={`text-xs ${dark ? "text-sonnencreme/60" : "text-espresso/60"}`}>{subtitle}</p>
          </div>
          <div className="space-y-2">
            {options.map((o) => (
              <a key={o.key} href={o.href} target="_blank" rel="noopener noreferrer"
                onClick={onClose} className={optionCls}>
                {o.label}
              </a>
            ))}
          </div>
          {hint && (
            <p className={`text-[11px] ${dark ? "text-sonnencreme/50" : "text-espresso/50"}`}>{hint}</p>
          )}
          <button onClick={onClose}
            className={`w-full rounded-xl px-3 py-2 text-sm ${dark ? "text-sonnencreme/60 hover:bg-tiefwasser-hell" : "text-espresso/60 hover:bg-beckenwasser-hell/30"}`}>
            {cancelLabel}
          </button>
        </div>
      </div>
    );
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.ui = window.FREILOTSE.ui || {};
  Object.assign(window.FREILOTSE.ui, { CollapsibleCard, InfoHint, PortalChoiceDialog });
})();
