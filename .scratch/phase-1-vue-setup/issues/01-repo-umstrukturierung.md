# 01 — Repo-Umstrukturierung: Angular nach `legacy/angular/` verschieben

**What to build:** Die bestehende Angular-App wird mittels `git mv` nach `legacy/angular/` verschoben, ohne dass Git-History verloren geht. Danach ist der Root sauber und bereit für das Vue-Projekt. Das Dockerfile und CI/CD zeigen noch auf nichts — das ist Ticket 08.

**Blocked by:** None — kann sofort starten

**Status:** ready-for-agent

- [ ] `git mv` verschiebt Angular-Quellen (`src/`, `e2e/`, `angular.json`, `tsconfig*.json`, `tslint.json`, `package.json`, `package-lock.json`, `openapitools.json`) nach `legacy/angular/`
- [ ] Root-Dateien bleiben unberührt: `.github/`, `.agents/`, `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `renovate.json`, `README.md`, `.gitignore`, `captain-definition`, `Dockerfile`, `nginx.conf`, `docs/`
- [ ] `node_modules/`, `dist/`, `.angular/` werden gelöscht (nicht verschoben)
- [ ] Das Hintergrundbild `src/assets/images/Cinema.jpg` wird **vor** dem `git mv` nach `legacy/angular/src/assets/images/Cinema.jpg` mitgenommen — es ist die Quelle für Ticket 02
- [ ] Ein `legacy/angular/README.md` beschreibt kurz: „Referenzimplementierung, nicht löschen vor Phase 3"
- [ ] `git status` zeigt keinen ungetrakten Müll; `git log --follow legacy/angular/src/app/app.component.ts` beweist erhaltene History
