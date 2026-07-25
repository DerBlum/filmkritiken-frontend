# 03 — Frontend: Auth-State & NavBar

## UAT

```gherkin
  @e2e
  Scenario: Eingeloggtes Mitglied sieht seinen Namen in der NavBar
    Given ich habe mich erfolgreich mit EntraID angemeldet
    When ich die Startseite öffne
    Then sehe ich meinen Namen in der NavBar (Desktop-Sidebar bzw. Mobile-BottomBar)

  @e2e
  Scenario: Mitglied loggt sich aus
    Given ich bin eingeloggt
    When ich auf den "Logout"-Button klicke
    Then wird meine Session beendet
    And mein Name verschwindet aus der NavBar
    And ich verbleibe auf der aktuellen Seite

  @e2e
  Scenario: Permission-abhängige UI-Elemente
    Given ich bin mit dem Konto eines Mitglieds mit der Permission "film.add" eingeloggt
    When ich die Startseite öffne
    Then sehe ich den "Film hinzufügen"-Button in der NavBar

  @e2e
  Scenario: Kein Permission-abhängiges UI für Mitglieder ohne film.add
    Given ich bin eingeloggt, aber mein Konto besitzt nicht die Permission "film.add"
    When ich die Startseite öffne
    Then ist der "Film hinzufügen"-Button nicht sichtbar
```

**What to build:** Nach dem Seitenaufruf wird die aktuelle Session automatisch vom Backend abgefragt. Eingeloggte Mitglieder sehen ihren Namen in der NavBar. Die Anzeige von permissions-abhängigen Elementen (z.B. „Film hinzufügen") basiert auf den tatsächlichen Berechtigungen aus der Session. Ausloggen per Button in der NavBar ist möglich.

**Blocked by:** 02 — Backend: Auth Endpunkte

**Status:** ready-for-agent

- [ ] `src/services/authService.ts` (neu): Axios-Calls `fetchMe()` → `GET /auth/me` (gibt `{ name, permissions }` oder `null` bei 401 zurück) und `postLogout()` → `POST /auth/logout`
- [ ] `src/composables/useAuth.ts` in einen **Pinia Store** (`defineStore`) umbauen — Pinia ist bereits in `main.ts` registriert. Composition-API-Schreibweise (`defineStore('auth', () => { ... })`); der Store ist von Natur aus ein Singleton und im Vue DevTools inspizierbar
- [ ] `Permission`-Type als Union: `'film.add' | 'bewertung.add' | 'bewertung.openclose'`
- [ ] `hasPermission(perm: Permission): boolean` — prüft ob `perm` in `permissions.value` enthalten ist
- [ ] `fetchSession(): Promise<void>` — ruft `fetchMe()` auf und befüllt den Singleton-State; bei 401/Fehler bleibt State unauthentifiziert
- [ ] `login(): void` — `window.location.href = ${VITE_API_URL}/auth/login`
- [ ] `logout(): Promise<void>` — ruft `postLogout()` auf, setzt State zurück (isAuthenticated=false, user=null, permissions=[]), zeigt Toast „Du wurdest abgemeldet"
- [ ] `App.vue`: `fetchSession()` im `onMounted`-Hook aufrufen
- [ ] `SideNav.vue`: `isAdmin` durch `hasPermission('film.add')` ersetzen; Logout-Button im authentifizierten State ergänzen (ruft `logout()` auf)
- [ ] `BottomTabBar.vue`: Login-Link wenn nicht eingeloggt, Logout-Button wenn eingeloggt
- [ ] Nach dem Logout: Nutzer bleibt auf der aktuellen Seite (kein harter Redirect), da alle Inhalte öffentlich lesbar sind
- [ ] Verifikation: Name erscheint in NavBar nach Login; „Film hinzufügen"-Button nur sichtbar wenn `film.add` in Permissions; Logout-Button löscht Name aus NavBar sofort reaktiv
