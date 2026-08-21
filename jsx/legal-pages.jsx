/* ------------------------------------------------------------------ */
/* jsx/legal-pages.jsx – Impressum und Datenschutzerklärung. Diese      */
/* rechtlichen Texte sind bewusst als String-Literale gehalten (nicht   */
/* über t(...)), weil sie eingebettete Links (ExternalLegalLink)        */
/* benötigen, die locales/de.js als reine Datendatei nicht abbilden     */
/* kann – siehe CLAUDE.md, Abschnitt „Internationalisierung und         */
/* UI-Texte". Wird über Babel-Standalone im Browser verarbeitet (kein   */
/* Bundler, kein Modulsystem). Muss NACH jsx/support-components.jsx     */
/* geladen werden (nutzt SiteLink/SiteFooter). In einer IIFE gekapselt; */
/* öffentliche Oberfläche: window.FREILOTSE.ui.                        */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";
  const { useEffect } = React;
  const { SiteLink, SiteFooter } = window.FREILOTSE.ui;
  const t = window.I18N.t;

  function LegalLayout({ title, documentTitle, metaDescription, children }) {
    useEffect(() => {
      let robots = document.querySelector('meta[name="robots"]');
      const created = !robots;
      const previousContent = robots?.getAttribute("content");

      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex, follow, noarchive");

      return () => {
        if (created) robots.remove();
        else if (previousContent === null) robots.removeAttribute("content");
        else robots.setAttribute("content", previousContent);
      };
    }, []);

    useEffect(() => {
      const previousTitle = document.title;
      document.title = documentTitle;

      let meta = document.querySelector('meta[name="description"]');
      const created = !meta;
      const previousContent = meta ? meta.getAttribute("content") : null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", metaDescription);

      return () => {
        document.title = previousTitle;
        if (created) meta.remove();
        else if (previousContent === null) meta.removeAttribute("content");
        else meta.setAttribute("content", previousContent);
      };
    }, [documentTitle, metaDescription]);

    return (
      <div className="min-h-screen bg-tiefwasser text-sonnencreme flex flex-col font-body">
        <header className="border-b border-tiefwasser-hell bg-tiefwasser-hell">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5">
            <SiteLink to="/" className="font-bold tracking-tight text-sonnencreme hover:text-beckenwasser-hell">FREILOTSE</SiteLink>
            <SiteLink to="/" className="text-sm text-sonnencreme/80 hover:text-sonnencreme">{t("legal.backToPlanner")}</SiteLink>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
          <article className="rounded-3xl border border-tiefwasser-hell bg-tiefwasser-hell p-5 shadow-warm-dark sm:p-8">
            <h1 className="mb-8 text-3xl font-bold tracking-tight">{title}</h1>
            {window.I18N.getLocale() === "en" && (
              <p className="mb-6 rounded-xl border border-tiefwasser-hell/60 bg-tiefwasser px-4 py-3 text-sm text-sonnencreme/80">
                {t("legal.germanOnlyNotice")}
              </p>
            )}
            <div className="space-y-7 text-sm leading-7 text-sonnencreme/80">{children}</div>
          </article>
        </main>
        <SiteFooter dark />
      </div>
    );
  }

  const LegalSection = ({ title, children }) => (
    <section>
      <h2 className="mb-2 text-lg font-bold text-sonnencreme">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );

  const ExternalLegalLink = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-beckenwasser-hell underline decoration-beckenwasser-hell/40 underline-offset-2 hover:text-beckenwasser">
      {children}
    </a>
  );

  const ProviderDetailsImage = () => (
    <figure className="max-w-md">
      <img
        src="/assets/anbieterangaben.png"
        alt="Name und ladungsfähige Anschrift des Anbieters als Grafik"
        width="1000"
        height="320"
        className="h-auto w-full rounded-2xl border border-tiefwasser-hell"
      />
      <figcaption className="mt-2 text-xs leading-5 text-sonnencreme/60">
        Die Anbieterangaben werden zum Schutz vor einfachem automatisiertem Auslesen als Grafik dargestellt.
      </figcaption>
    </figure>
  );

  function ImpressumPage() {
    return (
      <LegalLayout title="Impressum" documentTitle={t("legal.impressum.documentTitle")} metaDescription={t("legal.impressum.metaDescription")}>
        <LegalSection title="Angaben gemäß § 5 DDG">
          <p><strong className="text-sonnencreme">FREILOTSE</strong></p>
          <ProviderDetailsImage />
        </LegalSection>
        <LegalSection title="Kontakt">
          <p>E-Mail: <a className="text-beckenwasser-hell hover:text-beckenwasser" href="mailto:freilotse@outlook.de">freilotse@outlook.de</a></p>
        </LegalSection>
        <LegalSection title="Verbraucherstreitbeilegung">
          <p>Ich bin nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </LegalSection>
      </LegalLayout>
    );
  }

  function DatenschutzPage() {
    return (
      <LegalLayout title="Datenschutzerklärung" documentTitle={t("legal.datenschutz.documentTitle")} metaDescription={t("legal.datenschutz.metaDescription")}>
        <p>Stand: 7. August 2026</p>

        <LegalSection title="1. Verantwortlicher">
          <ProviderDetailsImage />
          <p>E-Mail: <a className="text-beckenwasser-hell hover:text-beckenwasser" href="mailto:freilotse@outlook.de">freilotse@outlook.de</a></p>
        </LegalSection>

        <LegalSection title="2. Hosting über Netlify">
          <p>Diese Website wird über Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, USA, bereitgestellt. Beim Aufruf der Website verarbeitet Netlify technisch erforderliche Verbindungsdaten. Dazu können insbesondere IP-Adresse, Datum und Uhrzeit des Abrufs, aufgerufene Seite beziehungsweise Datei, übertragene Datenmenge, Referrer-URL, Browsertyp, Betriebssystem und Zugriffsstatus gehören.</p>
          <p>Die Verarbeitung erfolgt, um die Website sicher, stabil und fehlerfrei auszuliefern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der sicheren und zuverlässigen Bereitstellung dieses Angebots.</p>
          <p>Eine Verarbeitung in den USA ist möglich. Netlify gibt an, für Übermittlungen aus der EU das EU-US Data Privacy Framework und ergänzend geeignete Garantien wie Standardvertragsklauseln zu verwenden. Weitere Informationen enthält die <ExternalLegalLink href="https://www.netlify.com/privacy/">Datenschutzerklärung von Netlify</ExternalLegalLink>.</p>
        </LegalSection>

        <LegalSection title="3. Feiertags- und Schulferiendaten">
          <p>Der Urlaubsplaner ruft Feiertags- und Schulferiendaten vorrangig von <ExternalLegalLink href="https://openholidaysapi.org/">OpenHolidays API</ExternalLegalLink> direkt aus deinem Browser ab – für Deutschland, Österreich und die Schweiz. Schulferiendaten für Deutschland werden bei einem technischen Fehler oder fehlenden Daten ersatzweise von <ExternalLegalLink href="https://schulferien-api.de/">schulferien-api.de</ExternalLegalLink> bezogen (für Österreich und die Schweiz entfällt diese Ersatzquelle mangels Abdeckung); Feiertage werden bei einem Ausfall der OpenHolidays API in diesem Fall lokal in deinem Browser berechnet, ohne dass ein weiterer Anbieter abgefragt wird. Bei den Abfragen werden technisch bedingt insbesondere deine IP-Adresse sowie das ausgewählte Jahr, Land und das Kürzel des ausgewählten Bundeslands beziehungsweise Kantons an den jeweiligen Anbieter übertragen.</p>
          <p>Die Abfragen sind erforderlich, um die ausgewählten Kalenderdaten anzuzeigen und passende Planungsvorschläge zu berechnen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der korrekten und aktuellen Bereitstellung der Planungsfunktion.</p>
        </LegalSection>

        <LegalSection title="4. Land-Vorauswahl per IP-Adresse">
          <p>Beim ersten Aufruf ohne geteilten Planungslink versucht der Urlaubsplaner, dein Land (Deutschland, Österreich oder Schweiz) automatisch vorzubelegen, damit du es nicht manuell auswählen musst. Dazu wird deine IP-Adresse an den Geolocation-Dienst <ExternalLegalLink href="https://www.geojs.io/">geojs.io</ExternalLegalLink> übermittelt, der daraus ein Land ermittelt. Schlägt diese Abfrage fehl oder wird sie blockiert (etwa durch einen Werbe- oder Tracking-Blocker), wertet der Urlaubsplaner ersatzweise die in deinem Browser eingestellte Sprache aus; liefert auch das kein Ergebnis, bleibt es bei der Voreinstellung Deutschland.</p>
          <p>Die Abfrage erfolgt bei jedem Aufruf ohne geteilten Link erneut, es werden keine Daten gespeichert oder mit anderen Zwecken verknüpft; das ermittelte Land dient ausschließlich der einmaligen Vorbelegung und kann von dir jederzeit manuell geändert werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in einer möglichst komfortablen Nutzung ohne unnötige manuelle Auswahl. Weitere Informationen enthält die <ExternalLegalLink href="https://www.geojs.io/docs/v1/">Dokumentation von geojs.io</ExternalLegalLink>.</p>
        </LegalSection>

        <LegalSection title="5. Technische Bibliotheken und Content Delivery Networks">
          <p>Für die Darstellung und Ausführung der Website werden React, ReactDOM und Babel über unpkg sowie Tailwind CSS über cdn.tailwindcss.com geladen. Beim Abruf dieser Dateien wird technisch bedingt insbesondere deine IP-Adresse an die jeweiligen Anbieter übermittelt.</p>
          <p>Die Verarbeitung dient der funktionsfähigen und einheitlichen Darstellung der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der technisch zuverlässigen Bereitstellung des Urlaubsplaners. Die Anbieter können Daten auch außerhalb der EU beziehungsweise des EWR verarbeiten.</p>
        </LegalSection>

        <LegalSection title="6. Planung, Freigabelinks und Kalenderexport">
          <p>Deine Eingaben und berechneten Urlaubsdaten werden nicht an mich übermittelt und nicht dauerhaft in deinem Browser gespeichert. Die Berechnung erfolgt lokal in deinem Browser.</p>
          <p>Wenn du die Teilen-Funktion nutzt, werden die Planungseinstellungen in einem URL-Fragment gespeichert. Dieses Fragment wird beim normalen Seitenaufruf nicht an den Webserver übertragen. Der Inhalt ist kodiert, aber nicht verschlüsselt. Jede Person mit dem Link kann die darin enthaltene Planung öffnen. Teile einen solchen Link deshalb nur mit Personen, für die diese Informationen bestimmt sind.</p>
          <p>Beim Herunterladen einer ICS-Datei wird die Kalenderdatei lokal in deinem Browser erzeugt. Erst wenn du ausdrücklich „Google“ auswählst, wird Google Kalender geöffnet und die für den Termin erforderliche Information an Google übergeben. Dann gelten die Datenschutzbestimmungen von <ExternalLegalLink href="https://policies.google.com/privacy?hl=de">Google</ExternalLegalLink>.</p>
          <p>Bei ausreichend langen freien Zeiträumen zeigt der Urlaubsplaner zusätzlich die Schaltflächen „Flüge“ und „Unterkunft“ an. Diese enthalten normale externe Links zu Google Flights beziehungsweise Booking.com, vorausgefüllt mit dem Datumsbereich des jeweiligen Zeitraums sowie – falls du sie freiwillig in das optionale Reiseziel-Feld einträgst – deiner Zielort-Eingabe. Das Reiseziel-Feld wird nicht gespeichert und nicht Teil eines Freigabelinks. Beim bloßen Anzeigen dieser Schaltflächen werden keine Daten übertragen. Erst wenn du eine der Schaltflächen anklickst, verlässt du diese Website und dein Browser stellt eine Verbindung zum jeweiligen Anbieter her; dabei können personenbezogene Daten, insbesondere deine IP-Adresse, technische Verbindungsdaten sowie eine eingetragene Zielort-Angabe, verarbeitet werden. Für die weitere Datenverarbeitung auf der jeweiligen Website ist der jeweilige Anbieter verantwortlich. Weitere Informationen findest du in der <ExternalLegalLink href="https://policies.google.com/privacy?hl=de">Datenschutzerklärung von Google</ExternalLegalLink> beziehungsweise der <ExternalLegalLink href="https://www.booking.com/content/privacy.html">Datenschutzerklärung von Booking.com</ExternalLegalLink>.</p>
        </LegalSection>

        <LegalSection title="7. Kontaktaufnahme per E-Mail">
          <p>Wenn du mich per E-Mail kontaktierst, verarbeite ich die von dir mitgeteilten Daten zur Bearbeitung deiner Anfrage und für mögliche Anschlussfragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit deine Anfrage auf einen Vertrag oder vorvertragliche Maßnahmen gerichtet ist; im Übrigen Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der Beantwortung von Anfragen.</p>
          <p>Mein E-Mail-Postfach wird über Outlook.com von Microsoft bereitgestellt. Dabei kann Microsoft die für die Übermittlung und Speicherung der Nachricht erforderlichen Daten verarbeiten. Für Nutzer im Europäischen Wirtschaftsraum ist Microsoft Ireland Operations Limited, One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland, zuständig. Weitere Informationen enthält die <ExternalLegalLink href="https://privacy.microsoft.com/de-de/privacystatement">Datenschutzerklärung von Microsoft</ExternalLegalLink>.</p>
          <p>Die Daten werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
        </LegalSection>

        <LegalSection title="8. Externer Link zu PayPal">
          <p>Auf dieser Website befindet sich ein normaler externer Link zu meinem PayPal.me-Profil. Beim bloßen Besuch von FREILOTSE werden dadurch keine Daten an PayPal übertragen. Erst wenn du den Link anklickst, verlässt du diese Website und dein Browser stellt eine Verbindung zu PayPal her. Dabei können personenbezogene Daten, insbesondere deine IP-Adresse und technische Verbindungsdaten, durch PayPal verarbeitet werden. Für die weitere Datenverarbeitung auf der PayPal-Website ist PayPal verantwortlich. Weitere Informationen findest du in der <ExternalLegalLink href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full">Datenschutzerklärung von PayPal</ExternalLegalLink>.</p>
        </LegalSection>

        <LegalSection title="9. Eingebettete YouTube-Videos">
          <p>Auf dieser Website werden Videos der Plattform YouTube eingebunden. Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.</p>
          <p>Die Website verwendet eine Zwei-Klick-Lösung. Beim bloßen Aufruf der Seite wird noch keine Verbindung zu YouTube hergestellt. Zunächst wird lediglich ein lokal gespeichertes Vorschaubild angezeigt. Erst wenn du das Video durch Anklicken aktivierst, wird der YouTube-Player über die datenschutzfreundlichere Domain youtube-nocookie.com geladen.</p>
          <p>Dabei wird eine Verbindung zu Servern von Google hergestellt. Google erhält insbesondere deine IP-Adresse, technische Informationen zu deinem Browser und Gerät sowie die Information, welche Seite du aufgerufen hast. Wenn du gleichzeitig bei einem Google- beziehungsweise YouTube-Konto angemeldet bist, kann Google den Aufruf deinem Konto zuordnen. Beim Abspielen können außerdem Cookies oder vergleichbare Speichertechniken eingesetzt werden.</p>
          <p>Mit dem Anklicken des Videos willigst du in die Übertragung deiner Daten an Google und eine mögliche Verarbeitung in den USA ein. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a DSGVO und, soweit Informationen auf deinem Endgerät gespeichert oder ausgelesen werden, § 25 Abs. 1 TDDDG. Die Einwilligung ist freiwillig. Ohne Aktivierung des Videos findet keine Übertragung durch den eingebetteten YouTube-Player statt.</p>
          <p>Die Einbindung erfolgt im erweiterten Datenschutzmodus von YouTube. Nach Angaben von Google werden Aufrufe solcher Videos nicht zur Personalisierung der Nutzungserfahrung auf YouTube verwendet. Weitere Informationen findest du in der <ExternalLegalLink href="https://policies.google.com/privacy?hl=de">Datenschutzerklärung von Google</ExternalLegalLink>.</p>
        </LegalSection>

        <LegalSection title="10. Cookies, lokale Speicherung und Netlify Web Analytics">
          <p>Der eigene Anwendungscode von FREILOTSE setzt keine Cookies ein und verwendet weder Local Storage noch Session Storage. Es findet keine personalisierte Werbung oder Bildung individueller Nutzerprofile durch FREILOTSE statt.</p>
          <p>Diese Website verwendet Netlify Web Analytics zur statistischen Auswertung der Nutzung. Die Auswertung erfolgt serverseitig anhand der Protokolldaten des Netlify Content Delivery Networks. Ausgewertet werden insbesondere Seitenaufrufe, aufgerufene Seiten, ungefähre Herkunftsorte und die Anzahl unterschiedlicher Besucher. Zur Bestimmung unterschiedlicher Besucher vergleicht Netlify IP-Adressen innerhalb begrenzter Zeiträume.</p>
          <p>Nach Angaben von Netlify erfolgt die Auswertung anonym, ohne Cookies, ohne clientseitiges Tracking-Skript und ohne personenbezogene Nutzerprofile. Die Verarbeitung dient der statistischen Auswertung und Verbesserung des Angebots. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt darin, die Nutzung von FREILOTSE nachvollziehen und das Angebot technisch und inhaltlich verbessern zu können.</p>
          <p>Da Netlify Web Analytics keine Cookies setzt und kein clientseitiges Tracking verwendet, wird hierfür derzeit kein Einwilligungsbanner eingesetzt. Weitere Informationen enthält die <ExternalLegalLink href="https://docs.netlify.com/monitor-sites/analytics/">Dokumentation zu Netlify Web Analytics</ExternalLegalLink>.</p>
        </LegalSection>

        <LegalSection title="11. Speicherdauer">
          <p>Soweit in dieser Datenschutzerklärung keine besondere Speicherdauer genannt ist, werden personenbezogene Daten nur so lange verarbeitet, wie dies für den jeweiligen Zweck erforderlich ist. Gesetzliche Aufbewahrungsfristen bleiben unberührt.</p>
        </LegalSection>

        <LegalSection title="12. Deine Rechte">
          <p>Du hast im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit.</p>
          <p>Beruht eine Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO, kannst du aus Gründen, die sich aus deiner besonderen Situation ergeben, Widerspruch gegen die Verarbeitung einlegen. Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt davon unberührt.</p>
          <p>Du hast außerdem das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren. Zuständig ist insbesondere das Bayerische Landesamt für Datenschutzaufsicht, Promenade 18, 91522 Ansbach. Weitere Informationen findest du unter <ExternalLegalLink href="https://www.lda.bayern.de/">www.lda.bayern.de</ExternalLegalLink>.</p>
        </LegalSection>

        <LegalSection title="13. Änderungen dieser Datenschutzerklärung">
          <p>Ich passe diese Datenschutzerklärung an, wenn sich Funktionen, eingesetzte Dienste oder rechtliche Anforderungen ändern.</p>
        </LegalSection>
      </LegalLayout>
    );
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.ui = window.FREILOTSE.ui || {};
  Object.assign(window.FREILOTSE.ui, {
    LegalLayout, LegalSection, ExternalLegalLink, ProviderDetailsImage, ImpressumPage, DatenschutzPage,
  });
})();
