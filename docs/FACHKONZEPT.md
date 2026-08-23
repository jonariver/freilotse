# Fachkonzept FREILOTSE

> Dieses Dokument beschreibt FREILOTSE aus fachlicher/Produktsicht: was die
> Anwendung tut, für wen, nach welchen Regeln. Es ergänzt die
> [`CLAUDE.md`](../CLAUDE.md), die dieselben Regeln aus technischer Sicht
> (Architektur, Module, Datenformate) beschreibt. Bei Widersprüchen zwischen
> beiden Dokumenten gilt der tatsächliche Code als Quelle der Wahrheit;
> Änderungen an der Fachlogik sollten in beiden Dokumenten nachgezogen
> werden.

## 1. Zweck

FREILOTSE hilft Berufstätigen in Deutschland (perspektivisch auch anderen
Ländern/Kantonen), ihr Urlaubskontingent so einzusetzen, dass daraus möglichst
viele zusammenhängende freie Tage entstehen ("Brückentage"). Die Anwendung
kombiniert dafür:

- das persönliche Urlaubs- und Überstundenkontingent,
- gesetzliche Feiertage des gewählten Bundeslands,
- Schulferien als optionalen Planungshinweis,
- die persönliche Arbeitswoche (nicht jeder arbeitet Montag–Freitig, z. B. bei
  Teilzeit).

Die App ist kostenlos, werbefrei, ohne Registrierung nutzbar und läuft
vollständig im Browser der Nutzer:in.

> **Rechtlicher Vorbehalt zur Schweiz:** Die Schweiz ist bereits heute als
> Land in der Urlaubsplanung wählbar (Feiertage/Kantone, siehe Abschnitt 5) —
> das ist reine Funktionsunterstützung, keine gezielte Markt- oder
> Werbeausrichtung auf die Schweiz (kein Schweizer Marketing, keine
> `.ch`-Domain). Sobald sich FREILOTSE tatsächlich gezielt an Nutzer:innen in
> der Schweiz richten sollte, kommt zusätzlich das revidierte Schweizer
> Datenschutzgesetz (revDSG) zur Anwendung, inklusive einer möglichen
> Vertretungspflicht in der Schweiz — das ist keine Nebensächlichkeit,
> sondern eine eigene rechtliche Prüfung, die erst bei einer solchen
> Ausrichtung fällig wird und aktuell nicht akut ist.

## 2. Zielgruppe

- Arbeitnehmer:innen, die ihren Jahresurlaub planen und Brückentage
  optimal nutzen möchten.
- Teilzeitkräfte mit unregelmäßiger Arbeitswoche (z. B. nur Di–Do).
- Paare/Familien/Kolleg:innen, die gemeinsame freie Zeit abstimmen wollen.
- Nutzer:innen, die spielerisch (Rätsel des Tages) mit dem
  Brückentage-Prinzip vertraut werden.

Nicht adressiert: Personalabteilungen, Schichtplanung, Teams mit
rollierenden Dienstplänen (siehe Abschnitt 10, Abgrenzung).

## 3. Grundprinzipien

1. **Kein Backend, kein Konto.** Alle Berechnungen laufen im Browser. Es gibt
   keine Nutzerkonten, kein Server-seitiges Speichern personenbezogener
   Daten. Persistenz erfolgt ausschließlich lokal (`localStorage`) oder über
   Links, die die Nutzer:in selbst weitergibt.
2. **Der Plan ist eine reine Ableitung, kein Datenbestand.** Es gibt keine
   gespeicherte Liste "geplanter Tage". Stattdessen werden aus wenigen
   Eingaben (Kontingente, Feiertage, Schulferien, manuelle Festlegungen)
   bei jeder Änderung alle freien Tage neu berechnet. Das garantiert, dass
   Anzeige und tatsächliche Regeln nie auseinanderlaufen können.
3. **Manuell vor automatisch.** Was die Nutzer:in explizit festlegt (Urlaub,
   Überstundenabbau oder "gesperrt"), hat immer Vorrang vor der
   automatischen Planung. Die Automatik kann manuelle Festlegungen weder
   überschreiben noch verdrängen.
4. **Datensparsamkeit.** Geteilte Links und lokal gespeicherte Pläne
   enthalten ausschließlich Eingaben (Kontingente, Einstellungen, manuelle
   Tage) – niemals abgeleitete Daten wie Feiertage, Schulferien oder das
   Rechenergebnis selbst, da diese jederzeit neu erzeugt werden können.
5. **Nie ein Absturz durch fehlende externe Daten.** Feiertags- und
   Schulferien-APIs können ausfallen. Für Feiertage existiert eine
   vollständige Offline-Berechnung als Ersatz; für Schulferien existiert
   eine zweite API als Fallback. Ohne verwertbare Daten schaltet die
   betroffene Funktion sichtbar in einen neutralen Zustand statt falsche
   Ergebnisse zu erzeugen.

## 4. Kernfunktion: Automatische Urlaubsplanung

### 4.1 Zwei Bedienmodi

- **Einfach-Modus:** wenige, geführte Fragen (Bundesland, Jahr, verfügbare
  Urlaubstage, gewünschtes Ziel) führen zu einem fertigen Vorschlag. Gedacht
  für den schnellen Einstieg ohne Detailwissen.
- **Profi-Modus:** alle Einstellungen sind gleichzeitig sichtbar, zusätzlich
  können Tage direkt im Kalender manuell angeklickt/angepasst werden.
  Wunschblöcke, Jahreswechsel-Erweiterung und die Quellenanzeige
  (Feiertage/Schulferien) stehen nur hier zur Verfügung.

Ein Wechsel zwischen beiden Modi verändert oder verwirft nichts – beide
Modi arbeiten auf demselben Zustand.

### 4.2 Eingaben, aus denen sich der Plan ableitet

| Eingabe | Bedeutung |
|---|---|
| Jahr, Bundesland/Kanton | bestimmt Feiertage und Schulferien |
| Urlaubskontingent | Anzahl verfügbarer Urlaubstage |
| Überstundenkontingent | Anzahl verfügbarer Tage aus Überstundenabbau (separates Kontingent, wird nicht mit Urlaub verrechnet) |
| Regelmäßige Arbeitstage | an welchen Wochentagen überhaupt ein freier Tag "erkauft" werden muss (Standard Mo–Fr, siehe 4.4) |
| 24./31.12.-Regel | ob Heiligabend/Silvester als ganzer, halber oder kein Urlaubstag zählt |
| Budget der Automatik / "ab Monat" | wie viele Tage die Automatik einsetzen darf und ab wann im Jahr sie beginnt |
| Schulferien-Präferenz | ob die Automatik Schulferien bevorzugt, meidet oder neutral behandelt |
| Wunschblöcke (Profi-Modus) | feste Wunschzeiträume ("9 Tage am Stück im Juli"), die vorrangig vor der übrigen Automatik eingeplant werden |
| Manuelle Tage (Profi-Modus) | einzelne Tage per Kalenderklick als Urlaub, Überstundenabbau oder gesperrt festgelegt |

Stehen beide Kontingente zur Wahl, verbraucht die Automatik standardmäßig
zuerst Urlaubstage; im Profi-Modus lässt sich diese Reihenfolge umkehren
("Zuerst aufbrauchen: Urlaubstage/Überstunden"), im Einfach-Modus gilt der
Standard fest, ohne eigene Auswahlmöglichkeit. Ein durch die
24./31.12.-Regel entstehender halber Urlaubstag zählt in der Anzahl freier
Tage wie ein vollständiger freier Tag – halbiert wird ausschließlich der
ausgewiesene Kontingentverbrauch.

### 4.3 Ergebnis

Die Anwendung zeigt zusammenhängende freie Zeiträume, wie viele Urlaubs-/
Überstundentage jeweils investiert wurden, das verbleibende Restbudget sowie
optional bereits erreichte, aber ungenutzte Erweiterungsmöglichkeiten (siehe
Abschnitt 8, Jahreswechsel-Erweiterung). Jeder Zeitraum lässt sich einzeln
oder gesammelt als Kalenderdatei exportieren bzw. direkt in Google Kalender
öffnen.

Ab einer gewissen Mindestlänge bietet jeder freie Zeitraum zusätzlich
„Flüge"- und „Unterkunft"-Schaltflächen an: Die Nutzer:in wählt jeweils
zwischen zwei Anbietern (Google Flights oder Skyscanner; Booking.com oder
Trip.com), optional vorbefüllt mit einem selbst eingetragenen Reiseziel und
einem anhand des Bundeslands/Kantons vorgeschlagenen Abflughafen. Es handelt
sich um reine, nicht monetarisierte Weiterleitungen zu den jeweiligen
Anbietern – kein eigenes Buchungs- oder Preisvergleichsfeature.

### 4.4 Regelmäßige Arbeitstage

Nutzer:innen legen fest, an welchen Wochentagen sie regelmäßig arbeiten
(z. B. Montag–Freitag als Standard, Montag–Donnerstag, Dienstag–Samstag,
einzelne Tage). Nur an diesen Tagen wird überhaupt ein Urlaubstag benötigt;
an persönlich freien Wochentagen entstehen keine Kosten, unabhängig vom
kalendarischen Wochenende. Das deckt insbesondere regelmäßige
Teilzeitmodelle ab.

**Bewusst nicht abgedeckt:** wechselnde Schichten, rollierende
Dienstpläne, wochenabhängig unterschiedliche Arbeitstage, konkrete
Stundenzahlen pro Tag oder Teilzeitquoten. Für ein 5-Tage-Modell mit fester
Wochentagsmenge ist die Funktion gedacht – nicht für alles, was sich als
"Teilzeit" bezeichnen lässt.

### 4.5 Wie die Automatik entscheidet

Die automatische Planung ist ein deterministischer, mehrstufiger
Algorithmus mit fester Reihenfolge – kein mathematisch bewiesenes globales
Optimum über alle denkbaren Zielgrößen (Gesamtzahl freier Tage, Länge des
längsten Blocks, Anzahl Blöcke ab Mindestlänge, Effizienz):

1. Manuelle Festlegungen (siehe Grundsatz 3) werden zuerst eingeplant.
2. Wunschblöcke (Profi-Modus) werden mit den geringsten Kosten platziert;
   bei gleichen Kosten gewinnt die bessere Flankierung durch angrenzende
   bereits freie Tage.
3. Der 24. und 31. Dezember werden gemäß der gewählten Regel fest
   eingeplant, damit sie die Feiertagsserie nicht unterbrechen.
4. Das verbleibende Budget der Automatik wird nach Rendite verteilt (freie
   Tage pro eingesetztem Tag), gestaffelt nach Lückengröße – zuerst
   isolierte 1-Tages-Brücken, danach 2-, 3- und 4-Tages-Lücken –, höchstens
   eine Lücke je Monat pro Runde. Bei gleicher Rendite gewinnt der frühere
   Zeitpunkt im Jahr.

Diese Rendite-Logik verteilt das Budget bewusst über mehrere Lücken im
Jahr, statt es zwingend auf die eine Lücke zu konzentrieren, die den
längsten einzelnen zusammenhängenden freien Zeitraum ergäbe. Das
unterscheidet sie strukturell vom Brückentage-Rätsel (Abschnitt 8), das
für ein einzelnes Kalenderfenster und festes Budget ausschließlich den
längsten zusammenhängenden freien Zeitraum sucht – ein einfacheres,
eigenständiges Optimierungsproblem, auch wenn beide Funktionen auf
derselben Planungslogik aufbauen.

## 5. Feiertage und Schulferien

### 5.1 Feiertage

Feiertage werden primär über eine externe API abgerufen (landesweite bzw.
exakt zum gewählten Bundesland passende Einträge; rein kommunale
Sonderfeiertage wie das Augsburger Friedensfest werden herausgefiltert, da
die App ausschließlich auf Bundesland-/Kantonsebene plant, nicht auf
Gemeindeebene). Ist die API nicht erreichbar oder liefert keine verwertbaren
Daten, berechnet FREILOTSE die Feiertage vollständig offline selbst –
identisches Ergebnis für alle landesweiten Feiertage. Regionale
Sonderfälle, bei denen ein Feiertag gesetzlich nur in Teilen eines
Bundeslands gilt (Mariä Himmelfahrt in Bayern, Fronleichnam in Sachsen und
Thüringen, das Augsburger Friedensfest), bildet FREILOTSE bewusst
vereinfacht ab und weist im Profi-Modus sichtbar darauf hin (Hinweistext
unterhalb des Kalenders).

### 5.2 Schulferien

Schulferien sind ausschließlich ein **Planungshinweis** – sie fließen nie
direkt in die Kontingentberechnung ein, sondern beeinflussen höchstens, wo
die Automatik ihre Urlaubstage bevorzugt platziert (Präferenz: bevorzugen /
meiden / neutral). Datenquelle ist primär eine externe API, mit einer
zweiten externen API als automatischem Fallback. Sind für die gewählte
Kombination aus Jahr und Bundesland keine Daten verfügbar (auch nicht
während des Ladens), wird die gewählte Präferenz automatisch neutral
gehalten und die Auswahlmöglichkeiten werden sichtbar deaktiviert – die
Nutzer:in wird darüber informiert, statt dass die Anwendung mit
möglicherweise falschen Annahmen weiterrechnet. Im Profi-Modus wird stets
angezeigt, welche der beiden Quellen tatsächlich verwendet wurde.

## 6. Planung teilen, speichern und vergleichen

### 6.1 Planung teilen (Share-Link)

Über einen Button lässt sich der aktuelle Planungsstand als Link teilen –
ohne Konto, ohne eigenen Server. Der Link enthält ausschließlich die
Eingaben (Kontingente, Einstellungen, manuelle Tage), keine
personenbezogenen Daten und keine abgeleiteten Ergebnisse. Jede Person mit
diesem Link kann die Planung öffnen; das wird der Nutzer:in vor dem Teilen
transparent mitgeteilt. Ältere, bereits erzeugte Links bleiben dauerhaft
funktionsfähig, auch wenn die Anwendung seither um neue Einstellungen
erweitert wurde – getragen von einer additiv-only-Regel für das Datenformat
(jede neue Einstellung bekommt einen Vorgabewert, der das Ergebnis alter
Links unverändert lässt; siehe `CLAUDE.md`, Abschnitt
„Versionierungsstrategie (SHARE_VERSION)"). Sollte einmal eine bestehende
Einstellung ihre Bedeutung ändern müssen, statt nur um eine neue ergänzt zu
werden, wird das nur mit einer mitgelieferten Kompatibilitätslogik für
ältere Links umgesetzt, nicht durch ersatzloses Verwerfen.

### 6.2 Mehrere Pläne lokal speichern

Nutzer:innen können beliebig viele benannte Pläne direkt im eigenen Browser
speichern (z. B. "Urlaub 2027", "Sommerferien Familie"), öffnen, umbenennen,
duplizieren oder löschen – ganz ohne Konto oder Server. Ist der lokale
Speicher des Geräts nicht verfügbar, blendet sich diese Funktion einfach
aus, ohne dass etwas fehlschlägt. Gespeicherte Pläne verwenden dasselbe
Datenformat wie Share-Links und unterliegen derselben
Kompatibilitätszusage aus Abschnitt 6.1 – wichtiger noch als dort, da ein
lokal gespeicherter Plan typischerweise deutlich länger in Verwendung
bleibt als ein einzelner geteilter Link.

### 6.3 "Gemeinsam frei" – Überschneidung mit anderen Personen

Fügt eine Nutzer:in den Share-Link einer anderen Person hinzu, berechnet
FREILOTSE deren Planung mit genau denselben Regeln und zeigt gemeinsame
freie Zeiträume beider Personen an. Der eingefügte Link wird nirgends
gespeichert, nur für die aktuelle Sitzung ausgewertet. Ungültige Links oder
ein abweichendes Planungsjahr führen zu einem verständlichen Hinweis statt
zu einer stillen Fehlberechnung.

## 7. Jahreswechsel-Erweiterung (Profi-Modus)

Reicht der letzte freie Zeitraum des Jahres bis zum 31. Dezember, prüft
FREILOTSE automatisch, welche direkt anschließenden Tage im Folgejahr
ohnehin kostenlos frei wären (Feiertage, Wochenenden), und hängt diese
sichtbar an den Zeitraum an. Zusätzlich – rein informativ und **nicht**
automatisch eingeplant, da das Urlaubskontingent des Folgejahres unbekannt
ist – wird gezeigt, wie viele weitere Urlaubstage aus dem neuen Jahr eine
noch längere Pause ermöglichen würden. Diese hypothetische Verlängerung
verändert weder das angezeigte Restbudget noch die Gesamtzahl freier Tage
und ist beim Kalenderexport nicht enthalten.

Für diese Prüfung lädt FREILOTSE die Feiertage des Folgejahres eigenständig
nach – ein zweiter, vom Hauptjahr unabhängiger Abruf (mit demselben
Offline-Fallback wie unter Abschnitt 5.1 beschrieben). Fällt die externe
Quelle nur für das Folgejahr aus, kann die Jahreswechsel-Erweiterung
technisch auf einer anderen Datenquelle beruhen als der übrige Plan; das
ist aktuell nicht separat sichtbar.

## 8. Brückentage-Rätsel des Tages (`/raetsel`)

Ein tägliches, Wordle-artiges Minispiel, unabhängig vom eigentlichen
Urlaubsplaner: Für ein zufällig, aber deterministisch gewähltes
Bundesland/Monat/Budget müssen Nutzer:innen per Klick selbst Urlaubstage
setzen und so den längstmöglichen freien Zeitraum finden – ein einzelnes,
klar umrissenes Optimierungsproblem (siehe Abschnitt 4.5 zur Abgrenzung
gegenüber der Zielfunktion des Hauptplaners). Nach der Auswertung wird das
Ergebnis mit der objektiv besten Lösung verglichen und
lässt sich als spoiler-freies Emoji-Raster teilen. Es gilt die
Selbstverpflichtung auf **einen gewerteten Versuch pro Tag** (Streak/
Statistik lokal auf dem Gerät gespeichert); danach ist beliebiges Üben
möglich, ohne die Wertung zu beeinflussen. Diese Begrenzung ist – wie bei
vergleichbaren Wordle-artigen Spielen ohne Konto und ohne Server –
bewusst **nicht technisch erzwungen**: Ohne Backend gibt es keinen Schutz
gegen ein privates Browserfenster, gelöschten lokalen Speicher oder ein
zweites Gerät. Das Rätsel hat – anders als der Hauptplaner – **keine**
Netzwerkabhängigkeit, da es ausschließlich die eingebaute
Feiertagsberechnung nutzt.

## 9. Weitere Seiten

| Seite | Zweck |
|---|---|
| Startseite / Landing Page | Erklärt das Produkt für neue Besucher:innen, führt in den Planer |
| Anleitung (`/anleitung`) | Erklärt alle Funktionen des Planers in einfacher Sprache |
| Neuigkeiten (`/neuigkeiten`) | Chronologische Liste sichtbarer Änderungen/Verbesserungen |
| Über FREILOTSE (`/ueber-freilotse`) | Hintergrund zum Projekt |
| Impressum / Datenschutz | Rechtliche Pflichtseiten |

## 10. Sprache

FREILOTSE ist auf Deutsch und Englisch verfügbar. Ein Sprachumschalter im
Header (auf Planer, Startseite, Anleitung, Neuigkeiten, Über FREILOTSE und
Rätsel-Seite; nicht auf den rechtlichen Pflichtseiten) wechselt jederzeit
zwischen beiden Sprachen; die Wahl wird im Browser gemerkt und gilt beim
nächsten Besuch automatisch wieder. Deutsch bleibt die Standardsprache beim
ersten Besuch. Ein Sprachwechsel verwirft keine begonnene Planung. Auch die
Weiterleitungen zu Flug-/Unterkunftssuche (siehe 4.3) berücksichtigen die
gewählte Sprache, soweit das jeweilige externe Portal das unterstützt.

## 11. Nicht-funktionale Anforderungen

- **Datenschutz:** keine Übertragung von Planungsdaten an eigene Server;
  keine Tracking-Notwendigkeit für die Kernfunktion; keine externen
  Link-Shortener/Speicherdienste.
- **Robustheit gegenüber Drittanbietern:** Ausfälle externer Feiertags-/
  Schulferien-APIs dürfen die Kernfunktion (Urlaubsplanung) nie vollständig
  verhindern.
- **Determinismus:** Für identische Eingaben und identisch geladene
  Feiertage/Schulferien liefert die Planung immer exakt dasselbe Ergebnis –
  Voraussetzung dafür, dass geteilte Links beim Empfänger dasselbe Ergebnis
  zeigen wie beim Absender. Diese Voraussetzung ist nicht garantiert: Laden
  Absender und Empfänger unterschiedliche Feiertagsquellen (API vs.
  Offline-Berechnung, siehe Abschnitt 5.1) oder öffnet der Empfänger den
  Link nach einer Weiterentwicklung der Planungslogik, kann das Ergebnis
  trotz identischer Eingaben abweichen. Das betrifft auch „Gemeinsam frei"
  (Abschnitt 6.3): Die dort für eine dritte Person neu berechnete Planung
  kann von deren eigenem Ergebnis abweichen, ohne dass diese Person das
  selbst bemerkt oder validiert, da sie das Ergebnis nie zu Gesicht bekommt.
- **Keine Registrierung, kein Backend:** durchgängiges Produktprinzip, nicht
  nur eine technische Einschränkung.

## 12. Abgrenzung (bewusst außerhalb des Funktionsumfangs)

- Wechselnde Schichten, rollierende Dienstpläne, wochenabhängige
  Arbeitszeiten oder Teilzeitquoten unterhalb eines festen
  Wochentagsmusters.
- Verwaltung/Genehmigung von Urlaub durch Vorgesetzte oder HR-Systeme
  (kein Team-/Unternehmensfeature, kein Workflow mit Genehmigungsschritten).
- Serverseitige Konten, Login, Synchronisation zwischen Geräten.
- Automatisches Einplanen der Jahreswechsel-Verlängerung (Abschnitt 7) oder
  jeglicher Einsatz von Urlaubstagen ohne explizite Zustimmung der
  Nutzer:in.
- Weitere Sprachen über Deutsch/Englisch hinaus (siehe Abschnitt 10).

## 13. Rechtliche Einordnung: geprüft, nicht einschlägig

Folgende Regelungen wurden im Rahmen einer rechtlichen Review-Runde geprüft
und als für FREILOTSE nicht einschlägig eingestuft — bewusst hier
festgehalten, damit sie nicht wiederholt neu aufgerollt werden müssen. Bei
strukturellen Änderungen (insbesondere Einführung kostenpflichtiger
Funktionen) ist die Einschätzung jeweils erneut zu prüfen.

- **§ 312j Abs. 3 BGB (Button-Lösung)**: setzt einen entgeltlichen
  Verbrauchervertrag voraus. FREILOTSE ist vollständig kostenlos, ohne
  Konto, ohne Bezahlfunktion; der einzige Zahlungsbezug ist ein externer,
  freiwilliger Spendenlink zu PayPal (`PAYPAL_URL`,
  `jsx/support-components.jsx`), kein Kauf-/Checkout-Vorgang innerhalb der
  App. Damit entfallen in diesem Kontext auch Widerrufsrecht und die
  Verbraucherschlichtungs-Informationspflicht. Ändert sich sofort, sobald
  es irgendeine kostenpflichtige Funktion gibt.
- **DSA (Digital Services Act) / Haftung für Nutzerinhalte**: FREILOTSE
  hostet oder verbreitet keine fremden Inhalte. Share-Links sind
  Punkt-zu-Punkt über das URL-Fragment codiert (siehe Abschnitt 6 sowie
  CLAUDE.md, Abschnitt „Share-Link-Funktion") — die Daten liegen nie auf
  einem Server. Melde- und Abhilfeverfahren, Notice-and-Action sowie
  Hostprovider-Haftung entfallen damit strukturell, als direkte Folge der
  No-Backend-Entscheidung.
- **Gewinnspielrecht beim Rätsel** (Abschnitt 8): keine Preise, keine
  Teilnahmegebühr, kein Glücksspielbezug — das tägliche Rätsel ist ein
  reines Übungs-/Vergleichsspiel ohne Auslobung.
- **BFSG (Barrierefreiheitsstärkungsgesetz, gilt seit 28.06.2025)**:
  voraussichtlich nicht anwendbar. Erfasst sind u. a. Dienstleistungen im
  elektronischen Geschäftsverkehr, die auf einen Verbrauchervertrag
  gerichtet sind — FREILOTSE ist ein unentgeltliches Werkzeug ohne
  Vertragsabschluss (siehe § 312j-Punkt oben), ergänzend greift die
  Ausnahme für Kleinstunternehmen bei Dienstleistungen. Anders als die
  drei Punkte oben ist das nur eine Einschätzung, keine abschließende
  Feststellung — bei Einführung von Partnerlinks oder kostenpflichtigen
  Funktionen ist sie neu zu bewerten. Unabhängig davon bleibt BITV-nahe
  Zugänglichkeit (Tastaturbedienbarkeit, Kontraste,
  Screenreader-Beschriftung) schlicht Qualität und wird laufend verfolgt
  (z. B. `aria-label` auf den Kalendertagen in `app.jsx` und beim
  Brückentage-Rätsel, `jsx/puzzle-page.jsx`).
