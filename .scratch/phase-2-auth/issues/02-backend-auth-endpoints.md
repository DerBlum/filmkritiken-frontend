# 02 — Backend: Auth Endpunkte (BFF OAuth Flow)

**What to build:** Das Backend übernimmt den vollständigen Azure EntraID Authorization Code Flow. Ein Mitglied kann sich über das Backend bei EntraID anmelden und erhält danach einen `HttpOnly`-Session-Cookie. Das Backend exponiert außerdem `/auth/me` (aktuelle Session abfragen) und `/auth/logout` (Session beenden).

**Blocked by:** 01 — Backend: MongoDB Session Repository

**Status:** ready-for-agent

- [ ] `AuthConfig`-Struct mit Env-Variablen: `ENTRA_TENANT_ID`, `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET` (mit `unset`-Flag, damit es nach dem Parsen aus dem Prozess-Env verschwindet), `ENTRA_REDIRECT_URI`, `FRONTEND_URL`, `SESSION_DURATION_DAYS`
- [ ] `GET /auth/login`: Generiert einen zufälligen `state`-Parameter (CSRF-Schutz, als kurzlebiger Cookie gespeichert), redirected zur Azure EntraID Authorization URL. Scopes: `openid profile offline_access`
- [ ] `GET /auth/callback`: Validiert `state` gegen Cookie; tauscht den Auth-Code via `golang.org/x/oauth2` gegen Tokens; parst den `id_token` (JWT) und extrahiert `name` + `roles`-Claims; erstellt eine neue Session über das `SessionRepository`; setzt `HttpOnly; Secure; SameSite=None`-Cookie (kein `Domain`-Attribut) mit der Session-ID; redirected Browser zu `{FRONTEND_URL}/`
- [ ] `GET /auth/me`: Liest Session-ID aus Cookie; schlägt Session im Repository nach; ruft `RefreshSession` (Sliding Window); gibt `{ name: string, permissions: []string }` als JSON zurück — bei fehlender/abgelaufener Session `401`
- [ ] `POST /auth/logout`: Löscht Session aus Repository; setzt Cookie mit `Max-Age=0`; antwortet mit `204 No Content`
- [ ] `authHandler` und `/auth/*`-Routen in `Server.go` einbinden (ohne `TraceId`-Middleware, da kein Business-Endpunkt)
- [ ] `AuthConfig` in `main.go` parsen und an `StartServer` übergeben
- [ ] Neue Env-Variablen (Placeholder) zu `config/local.env` und `config/local-docker.env` hinzufügen; `caprover.env` erhält nur die nicht-geheimen Variablen (Secret wird manuell in CapRover gesetzt)
- [ ] `/auth/*`-Endpunkte in `api/openapi.yaml` dokumentieren (inkl. Response-Schema für `/auth/me` und den Cookie-Parameter)
- [ ] `golang.org/x/oauth2` zu `go.mod` hinzufügen
- [ ] Der bestehende `NewAuthHandler` (Bearer-Token) bleibt unverändert — alle bisherigen Tests müssen weiterhin grünen
- [ ] Manuelle Verifikation: Login-Flow im Browser durchführen; Cookie in DevTools prüfen; `/auth/me` mit aktivem Cookie antwortet mit Name + Permissions; `/auth/logout` löscht Cookie
