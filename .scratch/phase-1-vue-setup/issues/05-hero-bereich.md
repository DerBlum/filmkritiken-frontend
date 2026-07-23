# 05 — Hero-Bereich: Nächster Film & Letzte Besprechung

**What to build:** Der obere Bereich der Startseite besteht aus **zwei Karten nebeneinander** (Desktop) bzw. **gestapelt** (Mobile): Die linke/obere Karte zeigt den Nächsten Film prominent; die rechte/untere Karte zeigt die Letzte Besprechung mit dem Ergebnis und den individuellen Mitglieder-Bewertungen. Beide Karten sind immer vorhanden — sie ersetzen sich nicht gegenseitig.

**Blocked by:** 04 — Filmkritiken-Service

**Status:** ready-for-agent

### Karte A: Nächster Film

- [ ] Zeigt den **Nächsten Film**: frühestes `besprochenam` in der Zukunft oder Filmkritik ohne Datum (via `getNextFilm()` aus Ticket 04)
- [ ] Ist kein Nächster Film vorhanden: Karte A zeigt einen Leer-State ("Kein Film geplant") — kein Fallback auf Letzter Film
- [ ] Bei `bewertungoffen: true`: Amber-Badge „Bewertungen offen“
- [ ] Angezeigte Metadaten: Filmtitel, Erscheinungsjahr, "Beitrag von" (Domain-Glossar), `besprochenam` als **Datum ohne Uhrzeit** (z.B. `Fr, 17. Juli 2026`)
- [ ] Poster (via `getPosterUrl()`) oder Titelkarte-Fallback (Amber→Rose Gradient)
- [ ] Zwei CTA-Buttons als **visuelle Platzhalter** (disabled, kein funktionierender Handler in Phase 1):
  - `[🗓️ Kalender]` — Out of Scope bis Phase 6
  - `[⭐ Bewerten]` — Out of Scope bis Phase 3

### Karte B: Letzte Besprechung (Ergebnis)

- [ ] Zeigt den **Letzten Film**: jüngste Filmkritik mit `besprochenam` in der Vergangenheit (via `getLastFilm()` aus Ticket 04)
- [ ] Ist kein Letzter Film vorhanden: Karte B zeigt einen Leer-State ("Noch keine Besprechungen")
- [ ] Angezeigte Metadaten: Filmtitel, Erscheinungsjahr, Durchschnittsbewertung (`Ø 8.7 Punkte`)
- [ ] **Individuelle Mitglieder-Bewertungen** werden als Liste angezeigt: `👤 Thomas: 9.0  👤 Julia: 8.0` etc.
  - Enthaltungen (`enthaltung: true`) werden als `— Enthaltung` dargestellt (nicht ignoriert — sichtbar aber nicht im Durchschnitt)
  - Reihenfolge: wie vom Backend geliefert
- [ ] Der im Letzte-Besprechung-Block angezeigte Film erscheint **nicht** zusätzlich im Archiv-Grid (er wird aus dem Archiv herausgefiltert)
- [ ] Kleines Poster links, Metadaten + Ratings rechts (horizontales Layout innerhalb der Karte)

### Poster & Bild-Fallback (beide Karten)

- [ ] Poster-URL: `${VITE_API_URL}/api/images/${filmkritik.image.id}` wenn `image.id` vorhanden
- [ ] Fallback: **Titelkarte** — Amber→Rose Gradient mit Filmtitel als typografischem Element

### Bewertungsanzeige (ADR-0001)

- [ ] Durchschnitt: Numerisches Badge `★ 7.4` (1–10 Skala, eine Nachkommastelle)
- [ ] Keine Sterne-Umrechnung (direkt aus Backend)
- [ ] Enthaltungen fließen **nicht** in den Durchschnitt ein
- [ ] Hat ein Film noch keine Bewertungen: Durchschnitts-Badge wird ausgeblendet

### Layout

- [ ] **Desktop**: Karte A und Karte B nebeneinander (z.B. `grid grid-cols-2 gap-6`)
- [ ] **Mobile**: Karte A oben, Karte B darunter (gestapelt)

### Design (Cinema-Glass)

- [ ] Beide Karten: `bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl`
- [ ] Überschriften `cinema-text`, Metadaten `cinema-text-muted`
- [ ] CTA-Buttons in `cinema-red` (disabled-State sichtbar aber ausgegraut)
- [ ] Kein `<style>`-Block in den Komponenten
