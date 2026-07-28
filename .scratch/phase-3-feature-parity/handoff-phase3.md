# Handoff: Phase 3 – Funktionsparität & Angular-Ablösung

## Kontext & Status

**Phase 3 ist VOLLSTÄNDIG ABGESCHLOSSEN!** All 7 Tickets wurden erfolgreich implementiert, getestet und verifiziert. Der alte Angular-Code wurde entfernt und die Dokumentation auf den Vue 3 + Vite + Tailwind Cinema-Glass Stack aktualisiert.

---

## Repositories & Workspace

| Repo | Pfad | Standard CLI Prefix |
|---|---|---|
| **Frontend** | `/mnt/c/Users/stefa/Repositories/filmkritiken-frontend` | `rtk pnpm` / `rtk npm` / `rtk vitest` |
| **Backend** | `/mnt/c/Users/stefa/Repositories/filmkritiken-backend` | `rtk go test` / `rtk make` |

---

## Artefakte & Dokumentation

| Artefakt / Spec | Pfad |
|---|---|
| Spec (Phase 3 gegrillt) | `.scratch/phase-3-feature-parity/spec.md` |
| Tickets (01 bis 07) | `.scratch/phase-3-feature-parity/issues/` |
| ADR 0001 — Bewertungsskala numerisch | `docs/adr/0001-bewertungsskala-numerisch.md` |
| ADR 0002 — Archiv-Filter clientseitig zuerst | `docs/adr/0002-archiv-filter-clientseitig-zuerst.md` |
| Frontend Vue-Stack Skill | `.agents/skills/vue-frontend-stack/SKILL.md` |
| README | `README.md` (Frontend & Backend) |

---

## Statusübersicht der Phase 3 Tickets

| Ticket | Inhalt | Status | Note |
|---|---|---|---|
| **01** | `FilterOptions` & Service-Abstraktion | ✅ DONE | `fetchFilmkritiken(options)` |
| **02** | Film Detailseite (`/film/:id`) | ✅ DONE | Öffentliche Detailseite mit Back-Button & Status-Badges |
| **03** | Bewertungsformular (1-10 Slider & Enthaltung) | ✅ DONE | Cinema-Red Slider, Auth-Guard, Toast-Feedback |
| **04** | Archiv-Seite (`/archiv`) | ✅ DONE | Titel- & Originaltitel-Suche, Besprechungsjahr, BeitragVon, Sortierung, Collapsible Filter, Paginierung |
| **05** | Backend Filter-Endpoints (`GET /api/filmkritiken`) | ✅ DONE | Query-Params `suche`, `titel`, `jahr`, `beitragvon`, `sortierung`, `limit`, `offset` in Go/Gin + Mongo Driver |
| **06** | Frontend Service Backend-Filter Swap | ✅ DONE | `fetchFilmkritiken` sendet echte HTTP Query-Params |
| **07** | Angular Cleanup & Doku-Update | ✅ DONE | Angular gelöscht, `README.md` auf Vue 3 aktualisiert |

---

## Wichtigste Verhaltens- & Designkonventionen

1. **Bewertungsdarstellung:**
   - Sterndetails hinter Zahlen: `8.5 ★`, `9 ★`, `5 ★`.
   - Max-Wertung `/ 10` Suffix entfernt (redundante Info).
2. **Badge-Design System ([src/assets/styles/index.css](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/src/assets/styles/index.css)):**
   - Badges (`.badge-open`, `.badge-pending`, `.badge-closed`, `.badge-rating`) teilen sich einheitliche Abmessungen (`font-size: 0.875rem`, `padding: 0.35rem 0.85rem`).
   - Zukünftige Filme mit geschlossener Bewertung zeigen Badge *„Besprechung ausstehend"* und *„Wird besprochen am [Datum]"*.
3. **Archiv-Filter & Paginierung ([ArchivView.vue](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/src/views/ArchivView.vue)):**
   - **Response Format:** `GET /api/filmkritiken` liefert ein JSON-Wrapper-Objekt `{ items: [...], totalCount: 25 }`, dokumentiert in `api/openapi.yaml` als `FilmkritikenPageResponse`.
   - **Mehr laden (X weitere):** Berechnet die verbleibenden Elemente exakt als `totalCount - geladeneFilme.length`.
   - **Debouncing:** Eingaben im Titelsuchfeld werden um 500ms gepuffert (`debounce`), bevor ein Backend-Request rausgeht. Select-Filter (Jahr, Einreicher, Sortierung) schicken Requests sofort ab.
   - **Jahr-Filter:** Filtert nach dem Jahr der Besprechung (`details.besprochenam`), NICHT nach dem Erscheinungsjahr des Films.
   - **Suche:** Freitext-Suche prüft sowohl `film.titel` als auch `film.originaltitel`.
4. **HomeView & Zuletzt Besprochen Layout ([HomeView.vue](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/src/views/HomeView.vue) & [ArchivGrid.vue](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/src/features/filmkritiken/components/ArchivGrid.vue)):**
   - `HomeView` laedt via `useFilmkritiken({ limit: 10 })` max. 10 Filme und übergibt die Liste via `.slice(0, 8)` an `ArchivGrid`.
   - **Mobile Layout:** Snap-Scroll-Horizonalliste (`overflow-x-auto snap-x`) mit fester Kartenbreite (`w-36 sm:w-44 flex-shrink-0`).
   - **Desktop Layout:** 4-Spalten-Grid (`lg:grid-cols-4 justify-items-center`).
5. **Testumgebung & Router Interceptor ([apiClient.ts](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/src/services/apiClient.ts) & [vite.config.ts](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/vite.config.ts)):**
   - `apiClient.ts` nutzt dynamischen `import('@/router')` im 401-Handler, um Top-Level DOM-Zugriffe in Headless-Testumgebungen zu verhindern.
   - Test-Environment ist `happy-dom` (`^20.11.1`).
6. **Navigation:**
   - Unimplementierte Menüeinträge (Watchlist, Statistiken) bleiben in [SideNav.vue](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/src/components/SideNav.vue) und [BottomTabBar.vue](file:///mnt/c/Users/stefa/Repositories/filmkritiken-frontend/src/components/BottomTabBar.vue) ausgeblendet.

---

## Suggested Skills für spätere Tasks

- `vue-frontend-stack` — Vue 3 Composition API, Cinema-Glass Styling & Service patterns.
- `frontend-e2e-tester` — Headless UAT Execution mit Docker Compose & Playwright.
- `tdd` — Test-Driven Development für Backend/Frontend Features.

---

## Nächste Schritte für die nachfolgende Session

1. **Backend-gestützte Filter-Werte (`verfuegbareJahre`, `verfuegbareBeitragende`):**
   - Beim nächsten Mal starten wir damit, die verfuegbaren Filter-Werte (Besprechungsjahre, Beitragende Mitglieder) direkt aus dem Backend ans Frontend zu übertragen.
   - Diese Filter-Werte sollen im Backend gecacht und dem Frontend über einen eigenen Endpoint aus dem Cache geliefert werden.
   - *Grund:* Aktuell basieren die Dropdown-Optionen (`verfuegbareJahre`, `verfuegbareBeitragende`) im Frontend nur auf den aktuell geladenen Paginierungs-Daten im Frontend. Bei größeren Datensätzen fehlen dadurch in den Dropdowns Filteroptionen für Filme, die noch nicht geladen wurden.

2. **Weitere Phase 4 Features:**
   - Implementierung von Folgefeatures (z. B. Watchlist, erweiterte Statistiken oder Admin-Funktionen).
