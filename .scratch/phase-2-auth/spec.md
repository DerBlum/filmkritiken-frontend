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

## Out of Scope

- Bewertungsformular (→ Phase 3)
- Admin-UI (→ Phase 4)
