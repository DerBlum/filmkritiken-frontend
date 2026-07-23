# 07 — HomeView: Zusammenbau Hero + Archiv + Error State + Auth-Stub

**What to build:** Die vollständige, öffentlich zugängliche Startseite. Hero und Archiv-Grid werden zusammengeführt, der Error-State ist sauber (Toast statt leere Seite), und der Auth-Stub (NavBar mit Login-Button, leere Route Guards) ist bereit für Phase 2.

**Blocked by:** 05 — Hero-Bereich, 06 — Archiv-Grid

**Status:** ready-for-agent

### HomeView

- [ ] `src/views/HomeView.vue` kombiniert Hero-Sektion (Karte A + Karte B aus Ticket 05) + Archiv-Grid (Ticket 06)
- [ ] Nutzt `useFilmkritiken()` Composable für Daten
- [ ] Ladezustand: Skeleton/Spinner solange `isLoading: true` — kein Layout-Shift
- [ ] Backend-Fehler (`error` gesetzt): Toast erscheint automatisch via apiClient-Interceptor; kein leerer weißer Screen

### Admin FAB (+)

- [ ] Floating Action Button (`src/components/AdminFab.vue`) erscheint unten rechts, **nur wenn `isAdmin: true`**
- [ ] In Phase 1: `isAdmin` ist immer `false` (Auth-Stub) — FAB ist nicht sichtbar, aber Komponente ist implementiert und bereit für Phase 2
- [ ] FAB-Styling: `bg-cinema-red` runder Button, Shadow, fixiert (`fixed bottom-6 right-6 z-50`), Cinema-Glass-Border
- [ ] Kein `<style>`-Block

### Auth-Stub

- [ ] `src/composables/useAuth.ts` exportiert `isAuthenticated: ref(false)`, `user: ref(null)`, `isAdmin: ref(false)`
- [ ] Route Guards in `src/router/index.ts` als leere Scaffolds vorbereitet (kein Redirect in Phase 1)
- [ ] Öffentlicher Besucher kann die Startseite ohne Login vollständig lesen — kein Auth-Redirect, kein Modal
- [ ] Debug-Button aus Ticket 03 wird entfernt

### Gherkin-Szenarien (müssen im Browser verifizierbar sein)

- [ ] Nächster Film wird in Karte A angezeigt — Titel, Datum (ohne Uhrzeit), "Beitrag von" sichtbar
- [ ] Ist kein Nächster Film vorhanden: Karte A zeigt Leer-State "Kein Film geplant"
- [ ] Letzte Besprechung erscheint in Karte B mit Durchschnitt und individuellen Mitglieder-Bewertungen
- [ ] Archiv-Grid zeigt vergangene Filme; Nächster Film und Letzter Film erscheinen **nicht** doppelt im Grid
- [ ] Backend-500-Fehler → Toast-Fehlermeldung erscheint (kein leerer Screen)
- [ ] Ohne Login sind alle Filmkritiken sichtbar; kein Auth-Redirect
- [ ] Seite ist auf mobilen Geräten korrekt dargestellt: Hero gestapelt, Archiv als horizontaler Scroll, Bottom Tab Bar sichtbar
- [ ] Auf Desktop: Sidebar sichtbar, Hero zweispaltig, Archiv als 4-Spalten-Grid
- [ ] Admin FAB (+) ist bei `isAdmin: false` (Phase 1 Stub) **nicht** sichtbar
