# ADR 0002 — Archiv-Filter: Clientseitig zuerst, Backend-Migration als Meilenstein

**Status**: Entschieden (Phase 3)  
**Datum**: 2026-07-26

## Kontext

Das Backend-Endpoint `GET /api/filmkritiken` unterstützt nur `limit` und `offset` — kein Filtering nach Titel, Regie, Jahr oder `beitragvon`, kein serverseitiges Sorting.

Das Archiv soll Suche (Titel), Filter (Jahr, Regie, Beitrag von) und Sortierung (neueste / beste / älteste) bieten.

## Entscheidung

**Phase 1 (clientseitig):** Das Frontend lädt alle Filmkritiken in einem einzigen Request (großes `limit`) und filtert/sortiert lokal über berechnete `computed`-Properties. Der `filmkritikenService` wird so abstrahiert, dass alle Filter-Parameter als Option-Objekt übergeben werden — auch wenn sie zunächst nur lokal ausgewertet werden.

**Phase 2 (Backend-Migration, Ende Phase 3):** Das Backend wird um Query-Parameter erweitert (`titel`, `regie`, `besprochenam_von`, `besprochenam_bis`, `sortierung`). Der `filmkritikenService` tauscht dann die lokale Auswertung gegen echte API-Parameter aus — der Aufruf-Code der Komponenten ändert sich nicht.

Vor Phase 2 erfolgt ein expliziter **Checkpoint** — der Agent stoppt, der aktuelle Stand wird eingecheckt, und der Umbau beginnt erst nach Bestätigung.

## Considered Options

- **Nur clientseitig (dauerhaft):** Einfach, aber skaliert nicht bei > 500 Einträgen. Kein serverseitiges Filtering bedeutet immer einen vollen Datentransfer.
- **Nur serverseitig (sofort):** Erfordert Backend-Änderungen vor dem ersten UI-Feature — verzögert Phase 3 unnötig.
- **Clientseitig zuerst, dann Backend** *(gewählt)*: Liefert Features sofort; Backend-Migration ist ein isolierter, planbarer Schritt.

## Consequences

- Der `filmkritikenService` muss von Anfang an ein `FilterOptions`-Interface annehmen, auch wenn die Implementierung zunächst clientseitig ist.
- Ein Checkpoint vor der Backend-Migration verhindert, dass ein halbfertiger Refactor eingecheckt wird.
- Das Backend muss in Phase 3 um Filter-Endpoints erweitert werden (kein rein-Frontend-Scope mehr).
