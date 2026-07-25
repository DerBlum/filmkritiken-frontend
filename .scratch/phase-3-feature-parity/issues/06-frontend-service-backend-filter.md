# 06 — Frontend: Service auf Backend-Filter umschwenken

**What to build:** Der `filmkritikenService` schickt die Filter-Parameter (`titel`, `regie`, `sortierung`) jetzt als echte Query-Params an das Backend statt clientseitig zu filtern. Der `useArchivFilter`-Composable delegiert die Logik an den Service — der Komponenten-Code ändert sich nicht. Der TODO-Kommentar aus Ticket 01 wird entfernt.

**Blocked by:** 05 — Backend-Endpoints müssen live sein.

**Status:** ready-for-agent

```gherkin
Feature: Serverseitiges Archiv-Filter

  @e2e
  Scenario: Titelsuche via Backend
    Given der Besucher tippt einen Titel ins Suchfeld
    When die Suche abgeschickt wird
    Then sendet der Service einen GET-Request mit ?titel=... an das Backend
    And nur die vom Backend zurückgegebenen Filmkarten werden angezeigt

  @e2e
  Scenario: Sortierung via Backend
    Given der Besucher wählt "Beste zuerst"
    Then sendet der Service ?sortierung=beste
    And die Filmkarten erscheinen in der vom Backend gelieferten Reihenfolge
```

- [ ] `filmkritikenService.fetchFilmkritiken(options)` leitet `FilterOptions`-Felder als Query-Params weiter
- [ ] Clientseitige `computed`-Filterung in `useArchivFilter` entfällt (oder bleibt als reiner Offline-Fallback mit Kommentar)
- [ ] Der `// TODO(Phase3-Backend)`-Kommentar aus Ticket 01 ist entfernt
- [ ] Keine Änderung an `ArchivView` oder anderen Komponenten nötig
- [ ] E2E-Tests aus Ticket 04 laufen weiterhin grün
