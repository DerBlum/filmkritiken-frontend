# Phase 6 – Statistiken & Kalender

**Labels**: `ready-for-agent`  
**Status**: Draft — noch nicht gegrillt

---

## Problem Statement

Die gespeicherte Bewertungshistorie steckt voller interessanter Gruppenstatistiken — welcher Film hat die Gruppe am meisten gespalten? Wer ist der härteste Kritiker? Diese Daten werden bisher gar nicht ausgewertet. Außerdem fehlt eine einfache Möglichkeit, Filmabende in den eigenen Kalender zu exportieren.

---

## Solution

Ein Statistik-Dashboard auf Basis der bestehenden Bewertungsdaten. Alle Berechnungen erfolgen client-seitig aus den bereits geladenen Filmkritiken (kein neuer Backend-Endpunkt nötig). Zusätzlich: iCal-Export für anstehende Filmabende.

---

## Rough User Stories

### Gruppenstatistiken
1. Als öffentlicher Besucher möchte ich den "Spalter-Film" sehen (Film mit der höchsten Standardabweichung der Bewertungen), sodass ich weiß, wo die Gruppe am meisten auseinandergegangen ist.
2. Als öffentlicher Besucher möchte ich den "Konsens-Film" sehen (Film mit der niedrigsten Standardabweichung), sodass ich den Film sehe, über den alle einig waren.
3. Als öffentlicher Besucher möchte ich den "Härtesten Kritiker" sehen (Mitglied mit dem niedrigsten Durchschnittswert aller Bewertungen).
4. Als öffentlicher Besucher möchte ich den "Größten Fan" sehen (Mitglied mit dem höchsten Durchschnittswert).
5. Als öffentlicher Besucher möchte ich den am besten bewerteten Film aller Zeiten sehen.
6. Als öffentlicher Besucher möchte ich den am schlechtesten bewerteten Film sehen.

### Mitglieder-Statistiken
7. Als öffentlicher Besucher möchte ich pro Mitglied eine Übersicht sehen: Anzahl Bewertungen, Durchschnitt, Standardabweichung, Anzahl Enthaltungen.
8. Als öffentlicher Besucher möchte ich sehen, welches Mitglied die meisten Filme vorgeschlagen hat.

### Kalender-Export
9. Als Mitglied möchte ich anstehende Filmabende als `.ics`-Datei herunterladen, sodass ich sie in meinen Kalender (Apple/Google/Outlook) importieren kann.
10. Als Mitglied möchte ich wählen können, ob ich nur den nächsten oder alle geplanten Termine exportieren möchte.

---

## Key Decisions (noch offen)

- Wo leben die Statistiken? Eigene Route `/statistiken`, oder als Abschnitt auf der Startseite?
- Welche weiteren gruppenspezifischen Stats sind gewünscht? (z.B. "Meiste Enthaltungen", "Wer schaut am liebsten ältere Filme?")
- iCal-Export: Client-seitig generiert (keine Server-Abhängigkeit), oder Backend-Endpunkt?
- Zeitraum-Filter: Statistiken für alle Zeiten, oder nur für ein bestimmtes Jahr?

---

## Out of Scope

- Echtzeit-Benachrichtigungen (nicht geplant)
- Externe Kalender-Sync (nur Export, kein Sync)
