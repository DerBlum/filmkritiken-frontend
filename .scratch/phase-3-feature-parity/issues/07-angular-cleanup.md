# 07 — Angular-Cleanup: `legacy/angular/` entfernen

**What to build:** Das `legacy/angular/`-Verzeichnis wird aus dem Repository gelöscht. Die `README.md` wird bereinigt. Dies ist ein separater Commit, kein Teil eines Feature-PRs.

**Blocked by:** 06 (alle Phase-3-Features sind live und Backend-Filter läuft) + **⛔ Checkpoint B** (explizite Bestätigung abwarten).

**Status:** ready-for-agent

- [ ] `legacy/angular/` ist vollständig aus dem Repository entfernt
- [ ] `README.md` enthält keinen Verweis mehr auf die Angular-App
- [ ] Alle CI-Checks bleiben grün nach dem Löschen
- [ ] Der Commit-Message folgt dem Format: `chore: remove legacy Angular app (Angular-Ablösung Phase 3 complete)`
- [ ] Kein weiterer Code (Vue-Features, Styles) wird in diesem Commit verändert
