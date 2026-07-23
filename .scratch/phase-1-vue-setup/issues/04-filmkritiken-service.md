# 04 — Filmkritiken-Service + TypeScript-Typen + useFilmkritiken Composable

**What to build:** Der vollständige Datenzugriffs-Layer für Filmkritiken. Am Ende liefert `useFilmkritiken()` reaktive Daten aus dem echten Backend (oder einer Mock-Antwort beim lokalen Entwickeln). Ticket 05 (Hero) und Ticket 06 (Archiv) können parallel starten, sobald dieses Ticket grün ist.

**Blocked by:** 03 — Shared Foundation

**Status:** ready-for-agent

### TypeScript-Typen

- [ ] `src/features/filmkritiken/types/filmkritik.ts` modelliert die Backend-DTOs:
  - `Filmkritik` (zentrales Aggregat): `id`, `film`, `besprochenam`, `bewertungoffen`, `beitragvon`, `bewertungen`, `image`
  - `Film`: `titel`, `erscheinungsjahr`, `regie`, `laufzeit`
  - `Bewertung`: `von` (Mitglieds-Name als String), `wertung` (number | null), `enthaltung` (boolean)
  - `FilmImage`: `id` (nullable) — `source` wird ignoriert (deprecated)
  - `besprochenam`: wird als **Date-only-String** behandelt (`YYYY-MM-DD` oder ISO-Date ohne Uhrzeit). Die Uhrzeit-Komponente wird im Frontend **nicht** angezeigt. Formatierung: z.B. `Fr, 17. Juli 2026` via `Intl.DateTimeFormat`
  - Alle Felder nullable/optional wo das Backend `null` liefert

### Feature-Service

- [ ] `src/features/filmkritiken/services/filmkritikenService.ts` exportiert `fetchFilmkritiken(): Promise<Filmkritik[]>` — `GET /api/filmkritiken?limit=70` via `apiClient`

### Composable

- [ ] `src/features/filmkritiken/composables/useFilmkritiken.ts` exportiert:
  - `filmkritiken: Ref<Filmkritik[]>`
  - `isLoading: Ref<boolean>`
  - `error: Ref<string | null>`
- [ ] `isLoading` wird **immer** im `finally`-Block zurückgesetzt (Resilient-State-Muster)
- [ ] Bei Fetch-Fehler: `error.value` gesetzt; Toast wird vom apiClient-Interceptor ausgelöst (kein doppelter Toast im Composable)
- [ ] Komposable ruft `fetchFilmkritiken()` beim Mount ab (`onMounted`)

### Hilfsfunktionen

- [ ] `src/features/filmkritiken/composables/useFilmkritiken.ts` (oder separates util) exportiert:
  - `getNextFilm(filmkritiken: Filmkritik[]): Filmkritik | null` — frühestes `besprochenam` in der Zukunft oder ohne Datum
  - `getLastFilm(filmkritiken: Filmkritik[]): Filmkritik | null` — jüngstes `besprochenam` in der Vergangenheit
  - `getArchivFilme(filmkritiken: Filmkritik[], heroFilm: Filmkritik | null): Filmkritik[]` — alle vergangenen, exkl. Hero
  - `getDurchschnittsBewertung(filmkritik: Filmkritik): number | null` — Enthaltungen ignorieren, `null` wenn keine Bewertungen
  - `getPosterUrl(filmkritik: Filmkritik, apiBaseUrl: string): string | null` — `null` wenn `image.id` fehlt
