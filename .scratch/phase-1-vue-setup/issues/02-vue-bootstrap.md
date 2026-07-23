# 02 — Vue 3 Projekt-Bootstrap (Vite + Tailwind v4 + Pinia + Vue Router)

**What to build:** Das leere Vue 3 Projekt wird im Root des Repositories initialisiert. Am Ende dieser Slice läuft `npm run dev` und zeigt eine funktionsfähige Seite. Das Design System (Cinema-Tokens, Tailwind-Config, Hintergrundbild) ist eingerichtet, sodass alle folgenden Tickets direkt auf den richtigen Klassen aufbauen können.

**Blocked by:** 01 — Repo-Umstrukturierung

**Status:** ready-for-agent

- [ ] `npm create vue@latest` scaffoldet das Projekt im Root mit TypeScript, Pinia, Vue Router (kein Testing-Framework-Dialog — Vitest als Dev-Dependency manuell hinzufügen)
- [ ] Tailwind CSS v4 installiert und konfiguriert
- [ ] `tailwind.config.js` definiert Custom Colors als einzige Farbquelle:
  - `cinema-dark: '#121212'` (Page Background)
  - `cinema-red: '#e50914'` (Primary CTA, aktive Nav-Punkte, Akzent-Ränder)
  - `cinema-text: '#ffffff'` (Überschriften)
  - `cinema-text-muted: '#e0e0e0'` (Fließtext)
- [ ] Tailwind-Config verankert das 8px-Spacing-Raster als alleinige Spacing-Quelle
- [ ] `Cinema.jpg` aus `legacy/angular/src/assets/images/Cinema.jpg` wird nach `src/assets/images/Cinema.jpg` kopiert
- [ ] `index.css` / globales Stylesheet setzt `Cinema.jpg` als Body-Hintergrund mit dunklem Overlay (`bg-cinema-dark`, Bild-Overlay via Tailwind), sodass Text lesbar bleibt — **keine `<style>`-Blöcke in `.vue`-Dateien**
- [ ] `.env.example` mit `VITE_API_URL=http://localhost:8080` angelegt
- [ ] Vitest als Dev-Dependency installiert (keine Tests geschrieben)
- [ ] `npm run dev` startet ohne Fehler; `npm run build` produziert `dist/` grün
- [ ] Kein Angular-Artefakt im Root (`angular.json`, `tsconfig.app.json`, etc. existieren nicht mehr im Root)

### App-Shell Layout-Architektur

Die Anwendung verwendet zwei unterschiedliche Layout-Muster je nach Viewport — die Shell wird einmal in `App.vue` definiert:

**Mobile (< lg):**
- Kein seitlicher Navigations-Bereich
- **Bottom Tab Bar** (`src/components/BottomTabBar.vue`) fixiert am unteren Bildschirmrand mit 4 Tabs: Home, Archiv, Watchlist, Stats
- Tab-Bar Cinema-Glass: `bg-black/75 backdrop-blur-md border-t border-white/10`
- Aktiver Tab in `cinema-red`

**Desktop (≥ lg):**
- **Linke Sidebar** (`src/components/SideNav.vue`), fixierte Breite, mit: Logo / App-Name, Nav-Links (Home, Archiv, Watchlist, Statistiken), User-Info-Bereich unten (Username, Admin-Badge), `[+ Film hinzufügen]`-Button (nur für Admins sichtbar — in Phase 1 Stub)
- Sidebar Cinema-Glass: `bg-black/75 backdrop-blur-md border-r border-white/10`
- Aktiver Nav-Link markiert mit `cinema-red` Akzent
- Kein Bottom Tab Bar

- [ ] `src/components/BottomTabBar.vue` erstellt (Mobile)
- [ ] `src/components/SideNav.vue` erstellt (Desktop)
- [ ] `App.vue` schaltet via Tailwind `lg:`-Prefix zwischen den Layouts um — kein JavaScript-basiertes Breakpoint-Detection
- [ ] Watchlist- und Stats-Links in Phase 1 als `router-link` mit Ziel `/watchlist` und `/stats` angelegt (Routen existieren noch nicht — führen zu einer leeren Seite oder 404, wird in späteren Phasen befüllt)
