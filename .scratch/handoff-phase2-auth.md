# Handoff: Phase 2 Auth – Agent-per-Issue Implementation

## Kontext

Phase 2 (EntraID-Login & Session-Handling) wurde vollständig gegrillt und in Tickets zerlegt.
Alle Entscheidungen sind gefallen. Der nächste Agent soll die Issues **einzeln implementieren**.

## Repos

- Backend: `/mnt/c/Users/stefa/Repositories/filmkritiken-backend`
- Frontend: `/mnt/c/Users/stefa/Repositories/filmkritiken-frontend`

## Artefakte (nicht duplizieren, nur referenzieren)

| Dokument | Pfad |
|---|---|
| Spec (inkl. UATs) | `.scratch/phase-2-auth/spec.md` (Frontend-Repo) |
| Implementierungsplan | `implementation_plan.md` in Antigravity-Artifacts |
| Tickets | `.scratch/phase-2-auth/issues/` (Frontend-Repo) |

## Issues & Reihenfolge

```
01-backend-session-repository.md   ← sofort startbar
02-backend-auth-endpoints.md       ← blocked by 01
03-frontend-auth-state-navbar.md   ← blocked by 02
04-frontend-login-view-route-guard.md ← blocked by 03
```

## Wichtigste Entscheidungen (Kurzform)

- BFF-Pattern: Backend übernimmt OAuth, setzt `HttpOnly; Secure; SameSite=None`-Cookie (kein `Domain`-Attr.)
- Session-Store: MongoDB, Collection `sessions`, TTL-Index auf `expiresAt`, 7 Tage sliding window
- Legacy `NewAuthHandler` (Bearer-Token) bleibt parallel erhalten
- Frontend Auth: **Pinia Store** (`defineStore('auth', ...)`, Composition API), bereits in `main.ts` registriert
- `Permission`-Type: `'film.add' | 'bewertung.add' | 'bewertung.openclose'` — kein `isAdmin`
- 401 auf öffentlicher Route: stiller Logout + Toast, kein Redirect
- Redirect nach Login: immer `/` (returnUrl TODO Phase 3)
- Go OAuth-Library: `golang.org/x/oauth2`

## Env / Secrets

- Prod-Vars in CapRover gesetzt (inkl. `ENTRA_CLIENT_SECRET` als Secret)
- `config/caprover.env`: alle nicht-geheimen Vars ✓
- `config/local.env` + `config/local-docker.env`: Placeholder `<fill-in-locally-never-commit>` für Secret
- Secret lokal via `config/local.secrets.env` (gitignored) — siehe `local.secrets.env.example`
- Makefile lädt Secrets-Datei optional nach: `make run` und `make run-docker` ✓
- **NIEMALS `config/local.secrets.env` lesen oder ausgeben**

## Azure App Registration

- Tenant ID: `865638a4-e4fb-4aef-89e1-6824acc3a785`
- Client ID: `b4dcd77f-8bc3-46e4-add1-8a44cd968428`
- Redirect URIs registriert: `http://localhost:8080/auth/callback`, `https://filmkritiken-backend.marsrover.418-teapot.de/auth/callback`

## Suggested Skills

- `vue-frontend-stack` — für alle Frontend-Tickets (Ticket 03, 04)
- `tdd` — für Ticket 01 (Repository Unit-Tests)
