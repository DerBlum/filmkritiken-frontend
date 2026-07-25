# 02 — Film-Detailseite `/film/:id`

**What to build:** Ein Klick auf eine Filmkarte öffnet die Route `/film/:id` mit der vollständigen Ansicht einer Filmkritik: alle Film-Metadaten (Titel, Regie, Erscheinungsjahr, Laufzeit, Originaltitel, Produktionsland, Altersfreigabe, Poster), das Datum `besprochenam`, `beitragvon` sowie alle Bewertungen der Mitglieder als Liste (Wertung oder Enthaltung). Die Seite ist öffentlich erreichbar (kein Login nötig). Das Bewertungsformular ist noch nicht Teil dieses Tickets (→ Ticket 03).

**Blocked by:** 01 — `filmkritikenService` muss `fetchById` oder äquivalenten Abruf anbieten.

**Status:** ready-for-agent

```gherkin
Feature: Film-Detailseite

  @e2e
  Scenario: Öffentlicher Besucher öffnet Detailseite
    Given ein öffentlicher Besucher ist nicht eingeloggt
    When er auf eine Filmkarte in der Startseite oder im Archiv klickt
    Then öffnet sich die Route /film/:id
    And alle Film-Metadaten (Titel, Regie, Jahr, Laufzeit) sind sichtbar
    And alle Mitglieder-Bewertungen (Wertung oder Enthaltung) sind aufgelistet

  @e2e
  Scenario: Ungültige Film-ID
    Given ein Besucher navigiert zu /film/UNGUELTIGE_ID
    Then wird ein 404-Fehlerstate angezeigt (kein leerer Screen)
```

- [ ] Route `/film/:id` ist im Router registriert und lazy-loaded
- [ ] `FilmCard` und Cards im Archiv verlinken per `<RouterLink>` auf `/film/:id`
- [ ] Alle Film-Metadaten werden angezeigt (fehlende Felder werden graceful weggelassen, kein Leerzeichen-Crash)
- [ ] Bewertungsliste zeigt alle Mitglieder mit Wertung oder „Enthaltung"-Badge
- [ ] Ungültige ID zeigt einen 404-Fehlerstate (nicht leerer Screen)
- [ ] Kein Auth-Guard auf dieser Route (öffentlich)

> **Backend-Hinweis:** `GET /api/filmkritiken/{id}` existiert noch nicht in der OpenAPI-Spec. Fallback: alle Filmkritiken laden und clientseitig nach ID filtern. TODO-Kommentar setzen.
