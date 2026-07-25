# Handoff: Phase 3 – Funktionsparität & Angular-Ablösung

## Kontext

Phase 3 wurde vollständig gegrillt und in Tickets zerlegt. Alle Architektur-Entscheidungen sind gefallen. Der nächste Agent implementiert die Issues **einzeln, in Dependency-Reihenfolge**. Zwei explizite **⛔ Checkpoints** erfordern eine Pause und Bestätigung — der Agent darf sie **nicht überspringen**.

---

## Repos

| Repo | Pfad |
|---|---|
| Frontend | `/mnt/c/Users/stefa/Repositories/filmkritiken-frontend` |
| Backend | `/mnt/c/Users/stefa/Repositories/filmkritiken-backend` |

---

## Artefakte (nicht duplizieren, nur referenzieren)

| Dokument | Pfad |
|---|---|
| Spec (gegrillt, mit Checkpoint-Tabelle) | `.scratch/phase-3-feature-parity/spec.md` |
| ADR 0001 — Bewertungsskala numerisch | `docs/adr/0001-bewertungsskala-numerisch.md` |
| ADR 0002 — Archiv-Filter clientseitig zuerst | `docs/adr/0002-archiv-filter-clientseitig-zuerst.md` |
| Domain-Glossar | `CONTEXT.md` |
| Tickets | `.scratch/phase-3-feature-parity/issues/` |
| Vue-Stack-Skill | `.agents/skills/vue-frontend-stack/SKILL.md` |

---

## Issues & Reihenfolge

```
01-filterOptions-service.md         ← sofort startbar (und parallel zu 04 möglich)
02-film-detailseite.md              ← blocked by 01
03-bewertungsformular-slider.md     ← blocked by 02
04-archiv-suche-filter.md          ← blocked by 01 (parallel zu 02+03 möglich)

⛔ CHECKPOINT A — einchecken, auf Bestätigung warten
05-backend-filter-endpoints.md      ← blocked by Checkpoint A (Backend-Repo)
06-frontend-service-backend-filter.md ← blocked by 05

⛔ CHECKPOINT B — einchecken, auf Bestätigung warten
07-angular-cleanup.md               ← blocked by Checkpoint B (separater Commit)
```

---

## Wichtigste Entscheidungen (Kurzform)

- **Detailseite:** Eigene Route `/film/:id`, öffentlich, kein Modal
- **Bewertungsformular:** Slider `<input type="range" min="1" max="10" step="1">`, Cinema-Red (`#e50914`), Snap auf Ganzzahlen; plus Enthaltungs-Option
- **Archiv-Pagination:** „Mehr laden"-Button via `limit`/`offset`; kein Endless Scroll (Phase 3)
- **Archiv-Filter:** Phase 1 clientseitig via `useArchivFilter`-Composable + `FilterOptions`-Interface; Phase 2 Backend-Query-Params (Ticket 05+06)
- **Angular-Cleanup:** Separater Commit `chore: remove legacy Angular app`, erst nach Checkpoint B

---

## Aktueller Code-Stand (was Phase 2 hinterlassen hat)

### Frontend-Stack
- **Vue 3** + Composition API (`<script setup>`), **Pinia**, **Vue Router**, **Axios**, **Tailwind v4** (Cinema-Glass Theme)
- Theme-Tokens: `--color-cinema-dark: #121212`, `--color-cinema-red: #e50914`, `--color-cinema-text: #ffffff`, `--color-cinema-text-muted: #e0e0e0`
- Auth: `useAuthStore` (Pinia) mit `name`, `permissions`, `isAuthenticated`; `Permission`-Type: `'film.add' | 'bewertung.add' | 'bewertung.openclose'`
- 401-Interceptor: stiller Logout + Toast, kein Redirect — **kein** `returnUrl` (TODO Phase 3, aber nicht zwingend)

### Bestehende Komponenten & Composables

| Datei | Zweck |
|---|---|
| `src/features/filmkritiken/composables/useFilmkritiken.ts` | Lädt alle Filmkritiken, exportiert Helper: `getNextFilm`, `getLastFilm`, `getArchivFilme`, `getDurchschnittsBewertung`, `getPosterUrl`, `formatDatum` |
| `src/features/filmkritiken/services/filmkritikenService.ts` | `fetchFilmkritiken()` → `GET /api/filmkritiken?limit=100` — **Ticket 01 baut darauf auf** |
| `src/features/filmkritiken/types/filmkritik.ts` | `Filmkritik`, `Film`, `FilmkritikenDetails`, `Bewertung`, `FilmImage` — vollständig typisiert |
| `src/features/filmkritiken/components/FilmCard.vue` | Kleine Archiv-Karte — **braucht `<RouterLink>` zu `/film/:id`** (Ticket 02) |
| `src/features/filmkritiken/components/ArchivGrid.vue` | Grid-Wrapper für `FilmCard`-Liste |
| `src/features/filmkritiken/components/NextFilmCard.vue` | Hero-Karte Nächster Film |
| `src/features/filmkritiken/components/LastFilmCard.vue` | Hero-Karte Letzter Film |
| `src/views/HomeView.vue` | Startseite: Hero + ArchivGrid; nutzt `useFilmkritiken` |
| `src/views/PlaceholderView.vue` | Platzhalter für `/archiv`, `/watchlist`, `/stats` — **/archiv wird in Ticket 04 ersetzt** |

### Router (aktuell)

```
/          → HomeView
/archiv    → PlaceholderView  ← Ticket 04 ersetzt durch ArchivView
/watchlist → PlaceholderView  ← Phase 5
/stats     → PlaceholderView  ← Phase 6
/login     → LoginView
```
Route `/film/:id` fehlt noch — **Ticket 02 legt sie an**.

### Backend-API (relevant für Phase 3)

| Endpoint | Methode | Auth | Zweck |
|---|---|---|---|
| `GET /api/filmkritiken` | GET | — | Alle Filmkritiken (`limit`, `offset`) |
| `GET /api/filmkritiken/{id}` | GET | — | **Existiert noch nicht** — Fallback: alle laden, nach ID filtern; TODO-Kommentar setzen |
| `PUT /api/filmkritiken/{id}/bewertungen/{username}` | PUT | `bewertung.add` | Bewertung abgeben (Body: `{ wertung: number }` oder `{ enthaltung: true }`) |
| `GET /auth/me` | GET | Cookie | Gibt `{ name, permissions }` zurück |

> **⚠️ Backend-Hinweis:** `SetBewertungRequest` hat in der OpenAPI-Spec kein `enthaltung`-Feld, die Go-Domain-Typen aber schon (`enthaltung: bool`). Bei Enthaltung `{ enthaltung: true }` senden — Akzeptanz durch Backend prüfen.

### Env

- `VITE_API_URL` — Backend-URL (in `.env`, Wert: `http://localhost:8080`)
- **NIEMALS `config/local.secrets.env` im Backend-Repo lesen oder ausgeben**

---

## Suggested Skills

- `vue-frontend-stack` — für alle Frontend-Tickets (01–04, 06, 07); lesen vor dem ersten Commit
- `tdd` — optional für Ticket 01 (Service-Abstraktion mit Unit-Tests absichern)
- `frontend-e2e-tester` — für E2E-Tests nach Ticket 03 + 04

---

## Hinweise für den Agent

1. **Skill zuerst lesen:** `.agents/skills/vue-frontend-stack/SKILL.md` vor dem ersten Code-Edit lesen — enthält Tailwind-Klassen-Konventionen, Toast-System und Error-Handling-Patterns.
2. **`FilterOptions` from Day 1:** Ticket 01 muss das Interface so legen, dass Ticket 06 (Backend-Swap) keine Komponenten-Änderungen braucht — nur der Service tauscht die Implementierung.
3. **Slider-Styling:** `appearance: none` + CSS-Custom-Properties für `::-webkit-slider-thumb` und `::-webkit-slider-runnable-track` — Theme-Farbe `#e50914`.
4. **Enthaltung-Logik:** Wenn Enthaltung aktiv → Slider deaktiviert und umgekehrt. Enthaltungen fließen **nicht** in `getDurchschnittsBewertung` ein (bereits korrekt implementiert).
5. **Checkpoints einhalten:** Der Agent stoppt selbstständig nach Ticket 03+04 (Checkpoint A) und nach Ticket 06 (Checkpoint B), checkt ein, und wartet auf explizite Bestätigung bevor er weitermacht.
