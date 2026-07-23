# 06 — Archiv-Grid: Alle vergangenen Filmkritiken

**What to build:** Das Archiv unterhalb des Hero-Bereichs zeigt alle bereits besprochenen Filme als responsive Grid. Ein öffentlicher Besucher kann auf einen Blick die Film-Geschichte des Clubs nachvollziehen.

**Blocked by:** 04 — Filmkritiken-Service

**Status:** ready-for-agent

### Logik

- [ ] Zeigt alle Filmkritiken mit `besprochenam` in der Vergangenheit — via `getArchivFilme()` aus Ticket 04
- [ ] **Ausgeschlossen**: der Nächste Film (Karte A) und der Letzte Film (Karte B aus Ticket 05) tauchen im Grid nicht auf
- [ ] Standardsortierung: **neueste zuerst** (`besprochenam` absteigend)
- [ ] Keine Filter- oder Sortieroptionen in Phase 1 (Out of Scope)
- [ ] Abschnitts-Header „ZULETZT BESPROCHEN“ + Link „Alle ansehen ›“ rechts (führt zu `/archiv` — Route in späterer Phase)

### FilmCard-Komponente

- [ ] `src/features/filmkritiken/components/FilmCard.vue` rendert:
  - Poster (via Poster-URL) oder Titelkarte-Fallback (Amber→Rose Gradient mit Filmtitel)
  - Filmtitel
  - Erscheinungsjahr
  - Numerisches Rating-Badge `★ 7.4` (ADR-0001: 1–10 direkt, keine Sterne-Umrechnung)
  - Rating-Badge **nur** wenn Bewertungen vorhanden; Enthaltungen ignoriert
- [ ] Props: `filmkritik: Filmkritik`, `apiBaseUrl: string`
- [ ] Kein `<style>`-Block — ausschließlich Tailwind Utility-Klassen

### Grid-Layout

- [ ] **Desktop**: responsives CSS-Grid, 4 Spalten (`grid grid-cols-4 gap-6`)
- [ ] **Mobile**: **horizontaler Scroll-Container** — Karten nebeneinander, rechter Karten-Schnitt signalisiert Swipe-Geste (`flex overflow-x-auto gap-4 snap-x snap-mandatory`); jede Karte `snap-start`
- [ ] 8px-Raster: Gap und Padding ausschließlich via Tailwind Spacing-Klassen

### Design (Cinema-Glass)

- [ ] Karten nutzen Cinema-Glass-Effekt: `bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl`
- [ ] Hover-Effekt: `transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`
- [ ] Überschriften `cinema-text`, Metadaten `cinema-text-muted`
- [ ] Kein `<style>`-Block in der Komponente

### Poster-Fallback

- [ ] Ist `image.id` null/undefined: Titelkarte mit `bg-gradient-to-r from-amber-500 to-rose-600` und Filmtitel als typografischem Element
