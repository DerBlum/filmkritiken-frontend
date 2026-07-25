# 01 — `filmkritikenService` auf `FilterOptions`-Interface umbauen

**What to build:** Der Service erhält ein typsicheres `FilterOptions`-Objekt als Parameter und filtert/sortiert die Ergebnisse zunächst clientseitig. Alle späteren Tickets können darauf aufbauen, ohne den Aufruf-Code zu ändern — der Tausch auf echte Backend-Query-Params (Ticket 06) ändert nur die Service-Implementierung, nicht die Komponenten.

**Blocked by:** None — kann sofort starten.

**Status:** ready-for-agent

- [ ] `FilterOptions`-Interface ist definiert (`suche`, `regie`, `jahr`, `beitragvon`, `sortierung: 'neueste' | 'aelteste' | 'beste'`)
- [ ] `fetchFilmkritiken(options?: FilterOptions)` nimmt das Interface entgegen
- [ ] Clientseitige Filterung/Sortierung geschieht im Service oder einem dedizierten Composable (`useArchivFilter`) — nicht in der Komponente direkt
- [ ] Ein `// TODO(Phase3-Backend): Ersetzen durch Query-Params wenn Backend-Ticket-05 fertig` Kommentar markiert die Implementierung
- [ ] Bestehende Aufrufe (HomeView, ArchivGrid) kompilieren fehlerfrei
