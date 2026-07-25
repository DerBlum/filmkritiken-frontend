# 04 — Frontend: Login-View, Route Guard & 401-Handler

## UAT

```gherkin
  @e2e
  Scenario: Mitglied loggt sich erfolgreich ein
    Given ich bin nicht eingeloggt und befinde mich auf der Startseite
    When ich auf den "Login"-Button klicke
    Then werde ich zu Azure EntraID weitergeleitet
    And nach erfolgreichem Anmelden mit meinem Microsoft-Konto lande ich wieder auf der Startseite

  @e2e
  Scenario: Abgelaufene Session auf einer öffentlichen Seite
    Given ich war eingeloggt, aber meine Session ist abgelaufen
    When ich eine öffentliche Seite aufrufe und ein API-Request ausgelöst wird
    Then erscheint ein Toast "Deine Session ist abgelaufen"
    And ich werde nicht von der Seite wegnavigiert
    And die Seite bleibt vollständig lesbar

  @e2e
  Scenario: Öffentlicher Besucher ohne Login
    Given ich bin nicht eingeloggt
    When ich die Startseite öffne
    Then sehe ich alle öffentlichen Inhalte (Filmkritiken-Liste)
    And kein Login-Pflicht-Dialog oder Fehler erscheint
```

**What to build:** Die `/login`-Route zeigt eine dedizierte Seite mit einem „Mit Microsoft anmelden"-Button. Bei abgelaufener Session während einer öffentlichen Seite erscheint ein Toast, und der Nutzer bleibt auf der Seite. Zukünftige geschützte Routen werden automatisch zur Login-Seite umgeleitet.

**Blocked by:** 03 — Frontend: Auth-State & NavBar

**Status:** ready-for-agent

- [ ] `src/views/LoginView.vue` (neu): Zeigt einen „Mit Microsoft anmelden"-Button (ruft `login()` aus `useAuth` auf), einen Hinweis dass öffentliche Inhalte ohne Login lesbar sind, und einen Link zurück zur Startseite
- [ ] `/login`-Route in `router/index.ts` auf `LoginView` statt `PlaceholderView` umstellen
- [ ] `meta.requiresAuth: boolean` zu Vue Router TypeScript-Typen ergänzen (`declare module 'vue-router'`)
- [ ] `router.beforeEach`-Guard aktivieren: wenn `to.meta.requiresAuth === true` und `!isAuthenticated.value` → redirect zu `/login` (ohne returnUrl vorerst); Kommentar `// TODO(Phase 3): returnUrl einbauen wenn geschützte Routen kommen`
- [ ] `apiClient.ts` 401-Handler überarbeiten: `logout()` aus `useAuth` aufrufen (State leeren + Toast „Deine Session ist abgelaufen"); wenn `router.currentRoute.value.meta.requiresAuth` → zusätzlich redirect zu `/login`; bei öffentlichen Routen kein Redirect
- [ ] Verifikation: Login-Seite zeigt Microsoft-Button; Klick startet OAuth-Flow; abgelaufener Cookie auf öffentlicher Seite → Toast, kein Seitensprung; (manuell testbar: Route mit `meta.requiresAuth: true` anlegen und prüfen dass Redirect passiert)
