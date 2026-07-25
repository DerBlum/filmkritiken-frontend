# 04 — Archiv-Seite mit Suche, Filter & Sortierung (clientseitig)

**What to build:** Die Route `/archiv` zeigt alle besprochenen Filmkritiken in einem Grid. Über eine Suchleiste und Filter-Controls (Regie, Jahr, Beitrag von) sowie eine Sortierungs-Auswahl (neueste / älteste / beste) kann die Liste clientseitig eingeschränkt werden. Ein „Mehr laden"-Button am Ende des Grids lädt weitere Einträge via `limit`/`offset`. Alle Filter-Parameter laufen durch das `FilterOptions`-Interface aus Ticket 01 — die Implementierung ist ready für den späteren Backend-Tausch (Ticket 06).

**Blocked by:** 01 — `FilterOptions`-Interface und clientseitige Filter-Logik müssen existieren.

**Status:** ready-for-agent

```gherkin
Feature: Archiv mit Suche und Filter

  @e2e
  Scenario: Titelsuche filtert sichtbare Filmkarten
    Given der Besucher ist auf /archiv
    And es sind mindestens 3 Filmkritiken geladen
    When er einen Titel in das Suchfeld eingibt
    Then werden nur Filmkarten angezeigt deren Titel den Suchbegriff enthält

  @e2e
  Scenario: Sortierung neueste zuerst
    Given der Besucher ist auf /archiv
    When er "Neueste zuerst" als Sortierung wählt
    Then ist die Filmkarte mit dem jüngsten besprochenam zuerst

  @e2e
  Scenario: Mehr laden lädt nächste Seite
    Given es gibt mehr Filmkritiken als die initiale Seitenanzahl
    When der Besucher auf "Mehr laden" klickt
    Then erscheinen neue Filmkarten am Ende des Grids
    And bereits geladene Karten bleiben sichtbar

  @e2e
  Scenario: Keine Ergebnisse zeigt leeren State
    Given der Besucher filtert nach einem Titel der nicht existiert
    Then wird ein "Keine Ergebnisse"-State angezeigt (kein leerer Grid)
```

- [ ] Route `/archiv` zeigt `ArchivView` (kein `PlaceholderView` mehr)
- [ ] Alle besprochenen Filmkritiken werden initial geladen (erste Seite via `limit`/`offset`)
- [ ] Suchfeld (Freitext Titel) filtert sichtbare Karten clientseitig
- [ ] Filter: Regie, Jahr, Beitrag von (Dropdowns oder Freitext)
- [ ] Sortierung: Neueste / Älteste / Beste (nach Durchschnittsbewertung)
- [ ] „Mehr laden"-Button: Appended neue Einträge ohne Reload; Button verschwindet wenn keine weiteren Seiten vorhanden
- [ ] Leerer State wird angezeigt wenn keine Ergebnisse nach Filter
- [ ] Filter-State wird nicht in der URL persistiert (Phase 3 out-of-scope)
- [ ] `useArchivFilter`-Composable kapselt alle Filter-/Sortierlogik
