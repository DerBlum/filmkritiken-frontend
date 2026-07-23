---
name: frontend-e2e-tester
description: Führt automatisiert Ende-zu-Ende-Tests mit Playwright und Docker Compose aus.
disable-model-invocation: true
---

# Frontend E2E-Tester (Headless-UAT-Loop)

Automatisiert die Ausführung von Playwright E2E-Tests in einer isolierten Docker-Testumgebung.

## Leading Word
*Headless-UAT-Loop* — Führe die gesamte Test-Pipeline deterministisch in isolierten Test-Containern aus und garantiere nach der Ausführung einen sauberen Teardown.

## Ablauf (Legwork)

1. **UAT Extraktion**: Liest `@e2e`-Szenarien aus Spezifikations- oder Ticket-Dateien (siehe `docs/agents/issue-tracker.md` und `docs/agents/uat-standards.md`).
2. **Environment Boot**: Starte Testumgebung im Hintergrund:
   ```bash
   rtk docker compose up -d --build
   ```
3. **Test-Execution**: Führe Playwright-Suite aus:
   ```bash
   rtk npx playwright test
   ```
4. **Artifact Capture**: Bei Fehlern Screenshots & Traces aus `e2e/test-results/` bzw. `playwright-report/` erfassen.
5. **Teardown**: Fahre Testumgebung geordnet herunter:
   ```bash
   rtk docker compose down -v
   ```

## Completion Criteria (Prüfbar)
1. `rtk npx playwright test` meldet 0 Fehler.
2. `rtk docker compose down -v` wurde ausgeführt.
3. Test-Report liegt unter `playwright-report/`.
