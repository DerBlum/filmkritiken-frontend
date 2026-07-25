# Bewertungsskala: Numerisch 1–10, keine Sterne-Umrechnung

Das Backend speichert Bewertungen auf einer 1–10 Skala. Wir zeigen diese Werte direkt als numerisches Badge (`★ 7.4`) an, ohne sie auf eine 1–5 Sterne-Skala zu halbieren. Die meisten Rating-UIs nutzen Sterne, aber die Halbierung erzeugt Präzisionsverlust und erfordert Rundungsentscheidungen ohne Mehrwert für die Nutzer des Filmtreffs, die die 1–10 Skala bereits kennen.

## Considered Options

- **Sterne (1–5):** Vertraute UX, aber 7.4/10 → 3.7 Sterne erfordert Rundung und versteckt die tatsächliche Wertung.
- **Numerisch (1–10):** Direkt aus dem Backend, kein Informationsverlust, passt zur mentalen Skala der Mitglieder.

## Consequences

Wenn zukünftig ein Bewertungsformular mit Stern-Klick-UI gebaut wird (Phase 3), muss der UI-Input intern auf 1–10 mappen (z.B. 3 Sterne = 6 Punkte) oder das Formular direkt mit 1–10 arbeiten.
