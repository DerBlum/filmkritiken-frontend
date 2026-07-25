# 05 — Backend: Filter-Endpoints für `GET /api/filmkritiken`

**What to build:** Das Backend-Endpoint `GET /api/filmkritiken` wird um Query-Parameter für serverseitiges Filtering und Sortierung erweitert. Die OpenAPI-Spec wird aktualisiert. Das Frontend-Ticket 06 wartet auf diesen Stand.

> **⚠️ Dieses Ticket liegt im Backend-Repo** (`filmkritiken-backend`). Es ist hier als Reminder erfasst, damit der Checkpoint und die Blocking-Edge zu Ticket 06 sichtbar bleiben.

**Blocked by:** 04 (Archiv mit clientseitigem Filter funktioniert) + **⛔ Checkpoint A** (explizite Bestätigung abwarten).

**Status:** ready-for-agent

- [ ] `GET /api/filmkritiken` akzeptiert optionale Query-Parameter: `titel` (Freitext-Suche), `regie`, `sortierung` (`neueste` | `aelteste` | `beste`)
- [ ] Die OpenAPI-Spec (`api/openapi.yaml`) ist um die neuen Parameter erweitert
- [ ] Bestehende Aufrufe ohne Parameter verhalten sich identisch wie bisher (keine Breaking Change)
- [ ] Parameter ohne Treffer geben ein leeres Array zurück (kein 404)
- [ ] Backend-Tests für die neuen Parameter sind vorhanden
