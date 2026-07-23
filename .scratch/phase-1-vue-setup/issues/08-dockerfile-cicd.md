# 08 — Dockerfile & CI/CD auf Vue umstellen

**What to build:** Das Produktions-Deployment zeigt auf das Vue-Projekt. Nach einem Push auf `master` baut die CI/CD-Pipeline automatisch das Vue-Projekt und deployed es via CapRover. Der Smoke-Test beweist: `index.html` wird von nginx ausgeliefert.

**Blocked by:** 07 — HomeView Zusammenbau

**Status:** ready-for-agent

### Dockerfile

- [ ] Multi-Stage Dockerfile:
  - Build-Stage: `COPY ./ ./`, `npm ci`, `npm run build` (Vite Output: `dist/`)
  - Serve-Stage: nginx — `COPY dist/ /usr/share/nginx/html/`
- [ ] `.dockerignore` schließt `legacy/`, `node_modules/`, `.angular/`, `.scratch/`, `.agents/` aus (Build-Kontext klein halten)

### nginx.conf

- [ ] Vue Router SPA-Fallback: alle nicht-statischen Pfade → `index.html` (`try_files $uri $uri/ /index.html`)
- [ ] Statische Assets (JS, CSS, Bilder) mit korrekten Cache-Headern

### captain-definition

- [ ] `captain-definition` bleibt unverändert (zeigt bereits auf `Dockerfile` im Root)

### CI/CD-Pipeline

- [ ] `.github/workflows/` Workflow baut und deployed nach Push auf `master`
- [ ] `npm ci && npm run build` läuft grün in der Pipeline (kein Angular-Build-Schritt mehr)
- [ ] `VITE_API_URL` als CI/CD-Secret/Environment-Variable konfiguriert

### Verifikation

- [ ] `docker build -t filmkritiken-vue .` läuft lokal ohne Fehler
- [ ] `docker run -p 8081:80 filmkritiken-vue` → `http://localhost:8081` liefert die Vue-Startseite
- [ ] CapRover-Deployment antwortet mit HTTP 200 auf der Produktions-URL
- [ ] `legacy/angular/` ist **nicht** Teil des Docker-Builds (`.dockerignore` greift)
