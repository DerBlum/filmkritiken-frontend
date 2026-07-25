# Phase 2 – EntraID-Login & Session-Handling

**Labels**: `ready-for-agent`  
**Status**: Draft — noch nicht gegrillt

---

## Problem Statement

Die öffentliche Startseite ist fertig, aber Mitglieder des Filmclubs können sich noch nicht einloggen. Ohne Auth können keine Bewertungen abgegeben werden, und der Admin hat keinen Zugriff auf seine Funktionen. Die Authentifizierung muss sicher, wartbar und auf Cookie-Basis implementiert werden.

---

## Solution

Implementierung des Azure EntraID Login-Flows (Authorization Code Flow) im Vue-Frontend. Nach erfolgreichem Login setzt das Go-Backend eine HttpOnly-Session-Cookie. Der Frontend-Auth-State wird reaktiv aus dem Session-Status abgeleitet. Der `useAuth`-Stub aus Phase 1 wird vollständig implementiert.

---

## Rough User Stories

1. Als Mitglied möchte ich einen "Login"-Button klicken, der mich zu Azure EntraID weiterleitet, sodass ich mich mit meinem bestehenden Microsoft-Konto anmelden kann.
2. Als Mitglied möchte ich nach dem Login automatisch zur Startseite zurückgeleitet werden, sodass ich nahtlos weiterarbeiten kann.
3. Als Mitglied möchte ich meinen Namen in der NavBar sehen, wenn ich eingeloggt bin, sodass ich weiß, dass mein Login erfolgreich war.
4. Als Mitglied möchte ich mich ausloggen können, sodass meine Session beendet wird.
5. Als Admin möchte ich nach dem Login Admin-spezifische UI-Elemente sehen, sodass ich meine Verwaltungsaufgaben erledigen kann.
6. Als öffentlicher Besucher möchte ich, dass die Seite ohne Login weiterhin vollständig lesbar ist, sodass der Auth-Flow das Read-Only-Erlebnis nicht beeinträchtigt.

---

## Key Decisions (noch offen)

- Welche Backend-Endpunkte existieren für Login/Logout/Session? → Backend-Code prüfen vor Grilling
- Wie wird die Admin-Rolle übermittelt (Claim im Token, separate Backend-Antwort)?
- Redirect-URL nach Login: immer `/`, oder zurück zur letzten Seite?
- Verhalten bei abgelaufener Session: stiller Logout oder Toast-Meldung?

---

## UAT – Akzeptanzszenarien

```gherkin
Feature: EntraID-Login & Session-Handling

  @e2e
  Scenario: Mitglied loggt sich erfolgreich ein
    Given ich bin nicht eingeloggt und befinde mich auf der Startseite
    When ich auf den "Login"-Button klicke
    Then werde ich zu Azure EntraID weitergeleitet
    And nach erfolgreichem Anmelden mit meinem Microsoft-Konto lande ich wieder auf der Startseite

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
  Scenario: Abgelaufene Session auf einer öffentlichen Seite
    Given ich war eingeloggt, aber meine Session ist abgelaufen
    When ich eine öffentliche Seite aufrufe und ein API-Request ausgelöst wird
    Then erscheint ein Toast "Deine Session ist abgelaufen"
    And ich werde nicht von der Seite wegnavigiert
    And die Seite bleibt vollständig lesbar

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

  @e2e
  Scenario: Öffentlicher Besucher ohne Login
    Given ich bin nicht eingeloggt
    When ich die Startseite öffne
    Then sehe ich alle öffentlichen Inhalte (Filmkritiken-Liste)
    And kein Login-Pflicht-Dialog oder Fehler erscheint
```

---

## Out of Scope

- Bewertungsformular (→ Phase 3)
- Admin-UI (→ Phase 4)
