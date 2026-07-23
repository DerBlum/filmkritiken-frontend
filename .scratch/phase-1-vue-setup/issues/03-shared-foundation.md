# 03 — Shared Foundation: apiClient + useToast + ToastContainer

**What to build:** Die zwei geteilten Infrastruktur-Bausteine, auf die alle Feature-Slices aufbauen: der zentrale Axios-Client und das Toast-System. Ein manueller Fehler-Trigger auf der Startseite beweist, dass Toasts korrekt erscheinen und Cinema-Glass aussehen.

**Blocked by:** 02 — Vue 3 Projekt-Bootstrap

**Status:** ready-for-agent

### API Client

- [ ] `src/services/apiClient.ts` erstellt mit:
  - `baseURL: import.meta.env.VITE_API_URL`
  - `withCredentials: true`
  - Response-Interceptor: `401` → Redirect zur Login-Route (Stub: `router.push('/login')`)
  - Response-Interceptor: `403` / `5xx` → `showToast(message, 'error')`
- [ ] Kein direkter API-Aufruf in einer `.vue`-Datei — nur über Feature-Services

### Toast-System

- [ ] `src/composables/useToast.ts` implementiert `showToast(message: string, type: 'info' | 'success' | 'warning' | 'error', duration?: number)`
- [ ] `src/components/ToastContainer.vue` rendert aktive Toasts mit Cinema-Glass-Styling (`bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl`) — **kein `<style>`-Block**
- [ ] `ToastContainer.vue` in `App.vue` eingebunden (genau einmal, im Root-Template)
- [ ] Toast erscheint animiert (fade-in / slide-in via Tailwind transitions)

### Verifikation

- [ ] Temporärer Debug-Button auf der Startseite (wird in Ticket 07 entfernt) triggert manuell `showToast('Test', 'error')` — Toast erscheint im Cinema-Glass-Look über dem Hintergrundbild
