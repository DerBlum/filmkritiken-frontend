# Phase 1 – Vue.js Öffentliches Gerüst & Setup

**Labels**: `ready-for-agent`  
**Slug**: `phase-1-vue-setup`

---

## Problem Statement

Die bestehende Filmkritiken-Plattform ist in Angular implementiert und nicht mehr zeitgemäß. Das Frontend soll durch eine moderne Vue 3 Applikation ersetzt werden, die von Grund auf mit dem Cinema-Glass-Designsystem, einer klaren Feature-Slice-Architektur und einer wartbaren Codebasis aufgebaut wird.

Gleichzeitig muss der Übergang so gestaltet sein, dass die Angular-App nicht sofort abgeschaltet werden muss — sie bleibt als Referenz erhalten, während das Vue-Projekt parallel entwickelt wird.

---

## Solution

Das bestehende Angular-Projekt wird in `legacy/angular/` verschoben. Im neuen Unterordner `vue/` entsteht das Vue 3 Frontend (Vite, TypeScript, Tailwind CSS, Pinia, Vue Router). Am Ende der Phase ist die öffentliche, nicht-authentifizierte Read-Only-Ansicht vollständig deployed: Eine Startseite mit einem Hero-Bereich für den nächsten Film und einem Archiv-Grid für alle bereits besprochenen Filme. Das Dockerfile und die CI/CD-Pipeline zeigen dann auf das Vue-Projekt.

---

## User Stories

### Öffentliche Besucher

1. Als öffentlicher Besucher möchte ich die Filmkritiken-Seite ohne Login aufrufen können, sodass ich das Filmarchiv einsehen kann, ohne Mitglied des Filmclubs zu sein.
2. Als öffentlicher Besucher möchte ich oben auf der Startseite den nächsten geplanten Film prominent hervorgehoben sehen, sodass ich weiß, welcher Film als nächstes besprochen wird.
3. Als öffentlicher Besucher möchte ich den Titel, den Vorschlagenden und das geplante Datum des nächsten Films sehen, sodass ich den Filmabend in meinen Kalender eintragen kann.
4. Als öffentlicher Besucher möchte ich alle bereits besprochenen Filme in einem übersichtlichen Grid sehen, sodass ich die Filmgeschichte des Clubs nachvollziehen kann.
5. Als öffentlicher Besucher möchte ich pro Filmkarte das Poster, den Titel, das Erscheinungsjahr und die Durchschnittsbewertung sehen, sodass ich mir schnell einen Überblick verschaffen kann.
6. Als öffentlicher Besucher möchte ich auch ohne Internetzugang zur Backend-API eine sinnvolle Fehlermeldung statt einer leeren Seite sehen, sodass ich weiß, dass ein technisches Problem vorliegt.
7. Als öffentlicher Besucher möchte ich, dass die Seite auf mobilen Geräten korrekt dargestellt wird, sodass ich sie auch unterwegs nutzen kann.

### Projektbeteiligte (Entwickler / Admin)

8. Als Entwickler möchte ich das Vue-Projekt lokal via `npm run dev` starten können, sodass ich ohne Docker-Setup entwickeln kann.
9. Als Entwickler möchte ich, dass der CI/CD-Pipeline-Prozess nach einem Push auf `master` das Vue-Projekt baut und deployed, sodass Änderungen automatisch in Produktion ankommen.
10. Als Entwickler möchte ich die Angular-App im Unterordner `legacy/angular/` erhalten, sodass ich bei Bedarf Implementierungsreferenzen nachschlagen kann.

---

## Implementation Decisions

### Repo-Umstrukturierung
- Die bestehende Angular-App (inkl. `angular.json`, `tsconfig*.json`, `src/`, `e2e/`, `package.json`) wird nach `legacy/angular/` verschoben. Git-History bleibt erhalten (`git mv`).
- Root-Dateien (`.github/`, `.agents/`, `AGENTS.md`, `CLAUDE.md`, `renovate.json`, `README.md`, `.gitignore`, `captain-definition`) verbleiben im Root.
- Das Vue 3 Projekt wird **direkt im Root** initialisiert (nicht in einem Unterordner). Das Dockerfile (`COPY ./ ./`) bleibt dadurch einfach.
- `node_modules/`, `dist/`, `.angular/` werden nicht verschoben, sondern gelöscht/neu erstellt.
- `Dockerfile` und `nginx.conf` werden durch Vue-kompatible Versionen ersetzt.

### Vue 3 Projektstruktur
- **Framework**: Vue 3 + Composition API (`<script setup lang="ts">`) via Vite.
- **State Management**: Pinia — in Phase 1 nur als leerer `useAuth`-Store vorbereitet.
- **Routing**: Vue Router — initiale Route: `/` → HomeView. Placeholder-Routen `/archiv`, `/watchlist`, `/stats` angelegt (leer, werden in späteren Phasen befüllt).
- **Styling**: Tailwind CSS v4 — Custom Colors (`cinema-red`, `cinema-dark`) werden in `tailwind.config.js` definiert. Keine eigenen `<style>`-Blöcke in `.vue`-Dateien (strikt verboten).
- **Architektur**: Feature-Slice — `src/features/filmkritiken/` enthält `components/`, `composables/`, `services/`, `types/`.

### App-Shell Layout
- **Mobile (< lg)**: Bottom Tab Bar (`BottomTabBar.vue`) fixiert am unteren Rand; 4 Tabs: Home, Archiv, Watchlist, Stats. Aktiver Tab in `cinema-red`. Cinema-Glass: `bg-black/75 backdrop-blur-md border-t border-white/10`.
- **Desktop (≥ lg)**: Linke Sidebar (`SideNav.vue`) mit Logo, Nav-Links, User-Info (Name + Admin-Badge) und `[+ Film hinzufügen]`-Button (nur für Admins — in Phase 1 nicht sichtbar). Cinema-Glass: `bg-black/75 backdrop-blur-md border-r border-white/10`.
- `App.vue` steuert das Layout ausschließlich via Tailwind `lg:`-Prefix — kein JavaScript-Breakpoint-Detection.

### API-Kommunikation
- Zentraler Axios-Client (`apiClient`) mit `baseURL: import.meta.env.VITE_API_URL` (lokal: `http://localhost:8080`) und `withCredentials: true`.
- In Phase 1 wird exakt ein Request gemacht: `GET /api/filmkritiken?limit=70`. Das Backend prüft das in der OpenAPI-Spec dokumentierte Maximum von 50 **nicht** — `limit=70` funktioniert in einem einzigen Request.
- HTTP-Interceptors: `401` → Redirect zu Login (Stub); `403`/`5xx` → Toast.

### Hero-Bereich: Nächster Film & Letzte Besprechung
- Der obere Bereich der Startseite zeigt **zwei Karten** parallel (Desktop) / gestapelt (Mobile).
- **Karte A — Nächster Film**: frühestes `besprochenam` in der Zukunft oder Filmkritik ohne Datum. Leer-State wenn kein Nächster Film vorhanden. Zeigt Filmtitel, Erscheinungsjahr, "Beitrag von", `besprochenam` als **Datum ohne Uhrzeit** (z.B. `Fr, 17. Juli 2026`). Zwei CTA-Buttons als **visuelle Platzhalter (disabled)**: `[🗓️ Kalender]` (Phase 6) und `[⭐ Bewerten]` (Phase 3).
- **Karte B — Letzte Besprechung**: jüngste Filmkritik mit `besprochenam` in der Vergangenheit. Zeigt Durchschnittsbewertung plus **individuelle Mitglieder-Bewertungen** (`Thomas: 9.0`, `Julia: 8.0`, etc.). Enthaltungen werden als `— Enthaltung` angezeigt (nicht im Durchschnitt). Kleines Poster links.
- Beide Karten können gleichzeitig angezeigt werden — sie ersetzen sich **nicht** gegenseitig.
- Ist `bewertungoffen: true`: Amber-Badge „Bewertungen offen“ auf Karte A.

### Archiv-Grid
- Alle Filmkritiken mit `besprochenam` in der Vergangenheit, **ausgenommen** der Nächste Film (Karte A) und der Letzte Film (Karte B).
- Standardsortierung: **neueste zuerst** (`besprochenam` absteigend).
- Abschnitts-Header "ZULETZT BESPROCHEN" + Link "Alle ansehen ›" (führt zu `/archiv` — in späterer Phase befüllt).
- **Desktop**: 4-Spalten-Grid. **Mobile**: horizontaler Scroll-Container mit Snap-Behavior.
- Weitergehende Filter und Sortieroptionen sind Out of Scope für Phase 1.

### Poster & Bild-Fallback
- Bild-URL: `${VITE_API_URL}/api/images/${film.image.id}`.
- Ist `film.image` null oder `film.image.id` nicht gesetzt: **Titel-Karte** — Amber→Rose Gradient-Hintergrund mit dem Filmtitel als typografisches Element.
- `film.image.source` ist deprecated und wird ignoriert.

### Bewertungsanzeige
- Durchschnitt: Enthaltungen (`enthaltung: true`) werden ignoriert. Nur Einträge mit gesetztem `wertung`-Wert fließen ein.
- Darstellung: Numerisches Badge `★ 7.4` (1–10 Skala, eine Nachkommastelle). Keine Sterne-Umrechnung. Siehe ADR-0001.
- Hat ein Film noch keine Bewertungen: Badge wird auf der Karte ausgeblendet.

### Auth-Stub
- `useAuth` Composable exportiert `isAuthenticated: ref(false)`, `user: ref(null)`, `isAdmin: ref(false)`.
- Die Sidebar (Desktop) und Bottom Tab Bar (Mobile) zeigen einen „Login“-Eintrag / Avatar-Placeholder, der in Phase 1 keinen EntraID-Flow auslöst.
- Route Guards werden als leere Scaffolds vorbereitet.
- **Admin FAB**: `AdminFab.vue` ist implementiert, aber bei `isAdmin: false` nicht sichtbar. Bereit für Phase 2.

### Dockerfile & Deployment
- Multi-Stage Dockerfile: `COPY ./ ./`, `npm ci && npm run build` (Vite Output: `dist/`); Serve-Stage: nginx.
- CapRover-Deployment via `captain-definition` unverändert.

### Toast-System
- Internes `useToast`-Composable (keine externe Library).
- `ToastContainer.vue` wird in `App.vue` eingebunden.
- Typen: `info | success | warning | error`.

---

## Design System

### Visuelles Leitmotiv: Cinema-Themed / Dark-Mode-First

Die Anwendung folgt einer Kino-Optik — dunkle Hintergründe lassen Filmcover und Poster wirken. Alle Design-Entscheidungen stärken dieses Leitmotiv.

### Hintergrundbild
- Das bestehende Hintergrundbild `src/assets/images/Cinema.jpg` aus der Angular-App wird im Vue-Projekt weiterverwendet.
- Es wird nach `public/images/Cinema.jpg` (oder äquivalent in Vite `src/assets/images/Cinema.jpg`) kopiert und als globaler Seiten-Hintergrund mit einem dunklen Overlay eingesetzt, sodass Text lesbar bleibt.

### Farbpalette (Custom Tailwind Tokens)

Farbwerte werden in `tailwind.config.js` als Custom Colors registriert — **nicht** als hardcodierte Hex-Werte in Templates:

| Token | Hex | Verwendung |
|---|---|---|
| `cinema-dark` | `#121212` | Page Background (Base) |
| `cinema-red` | `#e50914` | Primary CTA, aktive Nav-Punkte, feine Akzent-Ränder |
| `cinema-text` | `#ffffff` | Überschriften (High-Contrast) |
| `cinema-text-muted` | `#e0e0e0` | Fließtext, Beschreibungen |

### Glassmorphismus-Effekt (Kern-Effekt)
- Schwebende UI-Elemente (Modals, Toasts, Sticky-Header, Cards) verwenden exakt: `bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl`.
- Micro-Animations auf interaktiven Elementen: `transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`.

### Raster-System
- Striktes **8px-Raster**: alle Margins, Paddings und Gaps über Tailwind-Spacing-Klassen (`p-2`, `p-4`, `gap-6`, `m-8`, …).
- Das Spacing-Grid wird in `tailwind.config.js` als einzige Spacing-Quelle verankert.

### No-Custom-CSS-Regel
- **Strikt verboten**: `<style>`-Blöcke innerhalb von `.vue`-Dateien.
- Sämtliches Styling ausnahmslos über Tailwind Utility-Klassen im Template.

---

## Testing Decisions

### Seam
Der primäre Testseam für Phase 1 ist die **Browser-UI gegen das gemockte Backend-API**. Wir testen ausschließlich sichtbares Verhalten (DOM, Texte, CSS-Klassen), keine interne Composable-Logik direkt.

### Was einen guten Test ausmacht
- Tests prüfen nur externes, beobachtbares Verhalten — was der Nutzer sieht und interagieren kann.
- Kein Mock von Vue-Interna, kein Direktzugriff auf Composable-State.
- Testdaten kommen aus einem MSW (Mock Service Worker) oder Playwright-internen Request-Interceptors.

### Szenarien

```gherkin
Feature: Öffentliche Startseite

  @e2e
  Scenario: Nächster Film wird als Hero angezeigt
    Given das Backend gibt einen Film zurück, dessen besprochenam in der Zukunft liegt
    When ein öffentlicher Besucher die Startseite aufruft
    Then sieht er den Titel dieses Films prominent im Hero-Bereich

  @e2e
  Scenario: Letzter Film wird als Hero angezeigt wenn kein nächster Film vorhanden
    Given das Backend gibt keine Filme zurück, deren besprochenam in der Zukunft liegt
    When ein öffentlicher Besucher die Startseite aufruft
    Then sieht er den letzten Film im Hero-Bereich mit Badge "Letzter Film"

  @e2e
  Scenario: Archiv-Filme werden im Grid angezeigt
    Given das Backend gibt mehrere Filme zurück, deren besprochenam in der Vergangenheit liegt
    When ein öffentlicher Besucher die Startseite aufruft
    Then sieht er alle vergangenen Filme als Kacheln unterhalb des Hero-Bereichs
    And der Hero-Film erscheint nicht doppelt im Grid

  @e2e
  Scenario: Fehler beim Backend-Aufruf zeigt Toast
    Given das Backend antwortet mit einem 500-Fehler
    When ein öffentlicher Besucher die Startseite aufruft
    Then erscheint eine Fehler-Toast-Meldung

  @e2e
  Scenario: Seite ist ohne Login vollständig lesbar
    Given kein Nutzer ist eingeloggt
    When ein öffentlicher Besucher die Startseite aufruft
    Then sind alle Filmkritiken sichtbar
    And es erscheint kein Login-Modal oder Auth-Redirect
```

### Kein Unit-Test-Setup in Phase 1
- Vitest wird als Dev-Dependency installiert, aber es werden in Phase 1 keine Tests geschrieben.
- E2E-Tests mit Playwright werden ab Phase 3 aktiv.

---

## Out of Scope

- Azure EntraID Login-Flow (→ Phase 2)
- Bewertungs-Formular (→ Phase 3)
- Admin-Funktionen (→ Phase 4)
- TMDB-Integration (→ Phase 4)
- Watchlist / Vorschlags-System (→ Phase 5)
- Statistiken & iCal-Export (→ Phase 6)
- Film-Detailseite als eigene Route (→ Phase 3)
- Suche und Filter im Archiv (→ Phase 3)
- Pagination / Endless Scrolling / "Mehr laden" (→ Phase 3)

---

## Further Notes

- Die Angular-App bleibt in `legacy/angular/` als Referenzimplementierung erhalten. Keine Löschung vor Abschluss von Phase 3 (Feature-Parität).
- `withCredentials: true` ist am API-Client von Beginn an gesetzt, damit Phase 2 (Cookie-basierte Auth) ohne Client-Anpassung andocken kann.
- `VITE_API_URL` wird in `.env.example` dokumentiert. Lokaler Default: `http://localhost:8080`.
- Domain-Glossar: [CONTEXT.md](../../CONTEXT.md)
- Bewertungsskala-Entscheidung: [ADR-0001](../../docs/adr/0001-bewertungsskala-numerisch.md)

---

## Testing Decisions

### Seam
Der primäre Testseam für Phase 1 ist die **Browser-UI gegen das gemockte Backend-API**. Wir testen ausschließlich sichtbares Verhalten (DOM, Texte, CSS-Klassen), keine interne Composable-Logik direkt.

### Was einen guten Test ausmacht
- Tests prüfen nur externes, beobachtbares Verhalten — was der Nutzer sieht und interagieren kann.
- Kein Mock von Vue-Interna, kein Direktzugriff auf Composable-State.
- Testdaten kommen aus einem MSW (Mock Service Worker) oder Playwright-internen Request-Interceptors.

### Szenarien

```gherkin
Feature: Öffentliche Startseite

  @e2e
  Scenario: Nächster Film wird als Hero angezeigt
    Given das Backend gibt einen Film zurück, dessen besprochenam in der Zukunft liegt
    When ein öffentlicher Besucher die Startseite aufruft
    Then sieht er den Titel dieses Films prominent im Hero-Bereich

  @e2e
  Scenario: Archiv-Filme werden im Grid angezeigt
    Given das Backend gibt mehrere Filme zurück, deren besprochenam in der Vergangenheit liegt
    When ein öffentlicher Besucher die Startseite aufruft
    Then sieht er alle vergangenen Filme als Kacheln unterhalb des Hero-Bereichs

  @e2e
  Scenario: Fehler beim Backend-Aufruf zeigt Toast
    Given das Backend antwortet mit einem 500-Fehler
    When ein öffentlicher Besucher die Startseite aufruft
    Then erscheint eine Fehler-Toast-Meldung

  @e2e
  Scenario: Seite ist ohne Login vollständig lesbar
    Given kein Nutzer ist eingeloggt
    When ein öffentlicher Besucher die Startseite aufruft
    Then sind alle Filmkritiken sichtbar
    And es erscheint kein Login-Modal oder Auth-Redirect
```

### Kein Unit-Test-Setup in Phase 1
- Vitest wird als Dev-Dependency installiert, aber es werden in Phase 1 keine Tests geschrieben.
- E2E-Tests mit Playwright werden ab Phase 3 aktiv.

---

## Out of Scope

- Azure EntraID Login-Flow (→ Phase 2)
- Bewertungs-Formular (→ Phase 3)
- Admin-Funktionen (→ Phase 4)
- TMDB-Integration (→ Phase 4)
- Watchlist / Vorschlags-System (→ Phase 5)
- Statistiken & iCal-Export (→ Phase 6)
- Film-Detailseite als eigene Route (→ Phase 3)
- Suche und Filter im Archiv (→ Phase 3)

---

## Further Notes

- Die Angular-App bleibt in `legacy/angular/` als Referenzimplementierung erhalten. Keine Löschung vor Abschluss von Phase 3.
- Die Öffentlichkeit soll die Seite lesen können — `withCredentials: true` am API-Client ist trotzdem gesetzt, da Phase 2 Cookie-basierte Auth nutzen wird und der Client von Beginn an korrekt konfiguriert sein soll.
- Das `VITE_API_URL`-Environment-Variable wird in einer `.env.example`-Datei dokumentiert.
