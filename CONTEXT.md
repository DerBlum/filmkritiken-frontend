# Filmkritiken Frontend

Das digitale Herzstück eines privaten Filmtreffs. Die Plattform digitalisiert den Rhythmus der Gruppe: Ein Mitglied schlägt einen Film vor, die Gruppe schaut und diskutiert ihn, und jedes Mitglied gibt eine individuelle Wertung ab.

## Language

**Filmtreff**:
Der private Kreis von Filmbegeisterten, der die Anwendung nutzt.
_Avoid_: Filmclub, Kino-Club, Gruppe (wenn die Organisation gemeint ist)

**Filmkritiken** (Singular & Plural):
Das zentrale Aggregat der Anwendung. Eine Filmkritiken umfasst genau einen Film, seine Metadaten zum Filmabend und die Sammlung aller Bewertungen der Mitglieder.
_Avoid_: Filmeintrag, Eintrag, Review, Kritik (als Singular für das Aggregat)

**Film**:
Die Filmdaten innerhalb einer Filmkritiken — Titel, Erscheinungsjahr, Regie, Laufzeit, Poster usw. Ein Film existiert immer im Kontext einer Filmkritiken, nicht eigenständig.
_Avoid_: Movie, Streifen

**Bewertung**:
Die individuelle, numerische Wertung (1–10) eines Mitglieds für eine Filmkritiken. Eine Bewertung gehört immer genau einem Mitglied (`von`) und einer Filmkritiken.
_Avoid_: Rating, Note, Stimme

**Enthaltung**:
Eine Bewertung, bei der ein Mitglied aktiv auf eine Wertung verzichtet (`enthaltung: true`). Enthaltungen fließen nicht in die Durchschnittsberechnung ein.
_Avoid_: Keine Wertung, leere Bewertung

**Besprochen am**:
Das Datum, an dem der Film von der Gruppe angeschaut und besprochen wird oder wurde. Liegt das Datum in der Zukunft (oder fehlt es), gilt der Film als *Nächster Film*.
_Avoid_: Datum, Termin, Filmabend-Datum

**Nächster Film**:
Die Filmkritiken, deren `besprochenAm` in der Zukunft liegt oder nicht gesetzt ist. Wird auf der Startseite prominent im Hero-Bereich dargestellt. Gibt es keinen Nächsten Film, wird stattdessen der *Letzte Film* angezeigt.
_Avoid_: Upcoming film, geplanter Film

**Letzter Film**:
Die Filmkritiken mit dem jüngsten `besprochenAm` in der Vergangenheit. Wird im Hero angezeigt, wenn kein Nächster Film vorhanden ist.
_Avoid_: Zuletzt Besprochener, recent film

**Bewertung offen**:
Ein Flag (`boolean`) einer Filmkritiken, das anzeigt ob Mitglieder aktuell noch Bewertungen abgeben können. Wird ausschließlich vom Admin gesetzt.
_Avoid_: Abstimmung offen, Voting aktiv

**Beitrag von**:
Das Mitglied, das den Film für den Filmabend vorgeschlagen hat.
_Avoid_: Vorschlagender, Einreicher, Autor

**Archiv**:
Alle Filmkritiken, deren `besprochenAm` in der Vergangenheit liegt. Auf der Startseite als Grid unterhalb des Hero-Bereichs dargestellt, standardmäßig nach `besprochenAm` absteigend sortiert (neueste zuerst).
_Avoid_: Filme-Liste, History, Verlauf

## Rollen

**Mitglied**:
Ein authentifizierter Nutzer der Plattform. Darf Bewertungen abgeben, wenn `bewertungoffen: true`.
_Avoid_: User, Nutzer (zu generisch im Kontext der App)

**Admin**:
Ein Mitglied mit erweiterten Rechten. Darf Filme hinzufügen, `bewertungoffen` setzen und `besprochenAm` bearbeiten.
_Avoid_: Superuser, Manager

**Öffentlicher Besucher**:
Nicht-authentifizierter Nutzer. Darf alle Filmkritiken lesend einsehen, aber keine Daten verändern.
_Avoid_: Gast, Anonymous user
