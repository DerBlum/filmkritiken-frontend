# 03 — Bewertungsformular mit Slider

**What to build:** Auf der Detailseite einer Filmkritik mit `bewertungoffen: true` sieht ein eingeloggtes Mitglied ein Bewertungsformular. Das Formular enthält einen Slider (1–10, Cinema-Red, Snap auf Ganzzahlen) sowie eine Option für Enthaltung. Nach dem Absenden erscheint ein Toast. Eine bereits abgegebene Wertung wird vorausgefüllt. Öffentliche Besucher sehen das Formular als read-only.

**Blocked by:** 02 — Detailseite muss existieren.

**Status:** ready-for-agent

```gherkin
Feature: Bewertungsformular

  @e2e
  Scenario: Mitglied gibt Bewertung ab
    Given ein Mitglied ist eingeloggt
    And die Detailseite einer Filmkritik mit bewertungoffen: true ist geöffnet
    When das Mitglied den Slider auf 8 zieht und auf Absenden klickt
    Then wird die Bewertung gespeichert
    And ein Erfolgs-Toast erscheint

  @e2e
  Scenario: Mitglied wählt Enthaltung
    Given ein Mitglied ist eingeloggt
    And die Detailseite einer Filmkritik mit bewertungoffen: true ist geöffnet
    When das Mitglied die Enthaltungs-Option wählt und auf Absenden klickt
    Then wird die Enthaltung gespeichert
    And ein Erfolgs-Toast erscheint

  @e2e
  Scenario: Bestehende Bewertung wird vorausgefüllt
    Given ein Mitglied hat bereits eine Wertung von 7 abgegeben
    When es die Detailseite öffnet
    Then steht der Slider auf Position 7

  @e2e
  Scenario: Öffentlicher Besucher sieht read-only Formular
    Given ein Besucher ist nicht eingeloggt
    And bewertungoffen: true
    When er die Detailseite öffnet
    Then ist das Formular sichtbar aber deaktiviert (kein Submit möglich)

  @e2e
  Scenario: Formular nicht sichtbar wenn Bewertung geschlossen
    Given bewertungoffen: false
    When ein Mitglied die Detailseite öffnet
    Then ist das Formular nicht sichtbar
```

- [ ] Slider (`<input type="range" min="1" max="10" step="1">`) mit Cinema-Red-Akzentfarbe gestylt
- [ ] Aktueller Wert wird neben dem Slider als große Ziffer angezeigt
- [ ] Enthaltung-Option deaktiviert den Slider (und umgekehrt)
- [ ] Submit → `PUT /api/filmkritiken/{id}/bewertungen/{username}` mit `{ wertung }` oder `{ enthaltung: true }`
- [ ] Erfolgs-Toast und Error-Toast via bestehendem Toast-System
- [ ] Bestehende eigene Bewertung wird als Slider-Startwert vorgeladen
- [ ] Formular ist nur sichtbar wenn `bewertungoffen: true`
- [ ] Für Öffentliche Besucher: Formular sichtbar, aber deaktiviert (kein Submit-Button aktiv)
- [ ] Username aus Auth-Store (`useAuthStore`) wird als Pfadparameter verwendet
