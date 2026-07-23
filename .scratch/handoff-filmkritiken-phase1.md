# Handoff: Phase 1 – Vue.js Öffentliches Gerüst & Setup

**Ziel der nächsten Session:** Implementierung von Phase 1 des Filmkritiken-Frontend-Rewrites (Angular → Vue 3). Alle Tickets sind fertig spezifiziert und bereit zur Umsetzung.

---

## Kontext

Das Filmkritiken-Frontend ist eine private Filmclub-Plattform. Die bestehende Angular-App wird durch eine Vue 3 App ersetzt. Phase 1 liefert die vollständige, öffentlich lesbare Startseite (kein Login erforderlich).

- **Repository**: `/mnt/c/Users/stefa/Repositories/filmkritiken-frontend`
- **Backend-Repo** (Referenz): `/mnt/c/Users/stefa/Repositories/filmkritiken-backend`
- **Domain-Glossar**: [`CONTEXT.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/CONTEXT.md)
- **ADR-0001** (Bewertungsskala numerisch 1–10, keine Sterne): [`docs/adr/0001-bewertungsskala-numerisch.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/docs/adr/0001-bewertungsskala-numerisch.md)

---

## Vollständige Spec

[`spec.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/spec.md)

Enthält: Problem Statement, User Stories, alle Implementation Decisions (inkl. Design System, App-Shell Layout, Hero-Modell, Auth-Stub), Testing Decisions (Gherkin-Szenarien), Out-of-Scope-Liste.

---

## Tickets (in Dependency-Reihenfolge)

Alle unter: `.scratch/phase-1-vue-setup/issues/`

| # | Datei | Blocked by | Kerninhalt |
|---|---|---|---|
| 01 | [`01-repo-umstrukturierung.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/issues/01-repo-umstrukturierung.md) | — | `git mv` Angular → `legacy/angular/`; Cinema.jpg sichern |
| 02 | [`02-vue-bootstrap.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/issues/02-vue-bootstrap.md) | 01 | Vite + Tailwind v4 + Custom Tokens + App-Shell (Sidebar / Bottom Tab Bar) |
| 03 | [`03-shared-foundation.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/issues/03-shared-foundation.md) | 02 | `apiClient.ts` + `useToast` + `ToastContainer.vue` |
| 04 | [`04-filmkritiken-service.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/issues/04-filmkritiken-service.md) | 03 | TypeScript-DTOs + `filmkritikenService` + `useFilmkritiken` Composable + Hilfsfunktionen |
| 05 | [`05-hero-bereich.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/issues/05-hero-bereich.md) | 04 | Karte A (Nächster Film) + Karte B (Letzte Besprechung mit Einzel-Ratings) |
| 06 | [`06-archiv-grid.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/issues/06-archiv-grid.md) | 04 | `FilmCard.vue` + Grid (4-cols Desktop, Horizontal-Scroll Mobile) |
| 07 | [`07-homeview-zusammenbau.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/issues/07-homeview-zusammenbau.md) | 05 + 06 | `HomeView.vue` + Auth-Stub + `AdminFab.vue` |
| 08 | [`08-dockerfile-cicd.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.scratch/phase-1-vue-setup/issues/08-dockerfile-cicd.md) | 07 | Multi-Stage Dockerfile, nginx SPA-Fallback, CI/CD |

**Parallelisierung**: Tickets 05 und 06 können gleichzeitig starten, sobald 04 abgeschlossen ist.

---

## Wichtigste Design-Entscheidungen (bereits getroffen)

### App-Shell Layout
- **Mobile (< lg)**: Bottom Tab Bar, Cinema-Glass (`bg-black/75 backdrop-blur-md border-t border-white/10`)
- **Desktop (≥ lg)**: Linke Sidebar mit Navigation, User-Info, Admin-FAB-Stub
- Layout-Switch ausschließlich via Tailwind `lg:`-Prefix — kein JS-Breakpoint-Detection

### Design System (Tailwind Custom Tokens in `tailwind.config.js`)
| Token | Hex | Verwendung |
|---|---|---|
| `cinema-dark` | `#121212` | Page Background |
| `cinema-red` | `#e50914` | Primary CTA, aktive Nav-Punkte |
| `cinema-text` | `#ffffff` | Überschriften |
| `cinema-text-muted` | `#e0e0e0` | Fließtext |

- **Glassmorphismus**: `bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl`
- **Kein `<style>`-Block** in `.vue`-Dateien (strikt)
- **Hintergrundbild**: `src/assets/images/Cinema.jpg` (aus Angular-App gesichert in Ticket 01)

### Hero-Modell (zwei Karten, keine Fallback-Logik zwischen ihnen)
- **Karte A** — Nächster Film: frühestes `besprochenam` in der Zukunft / ohne Datum. Leer-State wenn nichts vorhanden.
- **Karte B** — Letzte Besprechung: jüngste vergangene Filmkritik, mit **individuellen Mitglieder-Bewertungen**.
- `besprochenam` wird als **Datum ohne Uhrzeit** angezeigt (z.B. `Fr, 17. Juli 2026`).
- CTA-Buttons `[🗓️ Kalender]` und `[⭐ Bewerten]` als **disabled Platzhalter** (Out of Scope Phase 1).

### Bewertungen (ADR-0001)
- Numerisch 1–10, Badge `★ 7.4`, **keine Sterne-Umrechnung**
- Enthaltungen (`enthaltung: true`): im Durchschnitt ignoriert, in Karte B als `— Enthaltung` sichtbar

### Archiv-Grid
- **Ausgeschlossen**: Nächster Film (Karte A) + Letzter Film (Karte B)
- Desktop: 4-Spalten-Grid; Mobile: horizontaler Snap-Scroll
- Header „ZULETZT BESPROCHEN" + „Alle ansehen ›" (Route `/archiv` — spätere Phase)

### Auth-Stub
- `useAuth`: `isAuthenticated: ref(false)`, `user: ref(null)`, `isAdmin: ref(false)`
- `AdminFab.vue` implementiert, aber bei `isAdmin: false` unsichtbar

---

## Vue Frontend Stack (Standards)

Vollständige Standards: [`.agents/skills/vue-frontend-stack/SKILL.md`](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/.agents/skills/vue-frontend-stack/SKILL.md)

Kurzfassung:
- Ausschließlich `<script setup lang="ts">`
- Dumb Components: keine API-Aufrufe, keine Geschäftslogik
- `isLoading` immer im `finally`-Block zurücksetzen
- API-Calls nur über Feature-Services (`filmkritikenService.ts`)
- Feature-Slice: `src/features/filmkritiken/{components,composables,services,types}`

---

## Aktueller Repo-Zustand

- Die Angular-App läuft noch im Root (noch nicht verschoben — das ist Ticket 01)
- `Cinema.jpg` liegt unter `src/assets/images/Cinema.jpg`
- `docs/adr/` enthält 1 ADR (ADR-0001)
- `.scratch/phase-1-vue-setup/issues/` enthält alle 8 Tickets

---

## Suggested Skills

- **`vue-frontend-stack`** — Pflicht für alle Vue-Komponenten, Composables, Services; enthält Completion Criteria als Checkliste
- **`tdd`** — Falls du einzelne Tickets test-first aufbauen willst (Vitest ist installiert, aber keine Tests in Phase 1 vorgeschrieben)
- **`frontend-e2e-tester`** — Für Ticket 07 Verifikation der Gherkin-Szenarien

---

## Out of Scope (nicht anfassen)

- Azure EntraID Login → Phase 2
- Bewertungs-Formular → Phase 3
- Admin-CRUD → Phase 4
- TMDB-Integration → Phase 4
- Watchlist / Vorschlags-System → Phase 5
- Statistiken & iCal-Export → Phase 6
