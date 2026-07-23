# Phase 5 – Vorschlags-System & Watchlist

**Labels**: `ready-for-agent`  
**Status**: Draft — noch nicht gegrillt

---

## Problem Statement

Der Filmclub hat einen festen Rhythmus: Jedes Mitglied ist reihum dran, einen Film vorzuschlagen. Aktuell wird dieser Prozess außerhalb der App verwaltet (z.B. in einem Chat). Die Plattform soll diesen Workflow digitalisieren: eine zentrale Watchlist, ein klares "Wer ist dran?"-Tracking, und die Möglichkeit für Mitglieder, Filmvorschläge einzureichen.

---

## Solution

Ein neues Feature-Modul `watchlist` mit eigenem Backend (vollständig neu zu entwickeln — kein bestehender API-Endpunkt). Mitglieder können Filme vorschlagen, die in der Watchlist landen. Die App zeigt an, wer als nächstes an der Reihe ist.

> **Hinweis**: Backend-Endpunkte für dieses Feature existieren noch nicht und müssen parallel zum Frontend neu entwickelt werden.

---

## Rough User Stories

### Watchlist
1. Als öffentlicher Besucher möchte ich die Watchlist einsehen können, sodass ich sehe, welche Filme als nächstes kandidieren.
2. Als Mitglied möchte ich einen Film für die Watchlist vorschlagen, sodass er als Kandidat für den nächsten Filmabend sichtbar wird.
3. Als Mitglied möchte ich meinen Vorschlag mit einem Titel und optionalem TMDB-Link einreichen können.
4. Als Admin möchte ich einen Film aus der Watchlist auswählen und als Nächsten Film festlegen, sodass er auf die Startseite rückt.
5. Als Admin möchte ich Vorschläge aus der Watchlist entfernen können (z.B. wenn ein Film bereits woanders gesehen wurde).

### "Wer ist dran?"-Tracking
6. Als Mitglied möchte ich sehen, wer als nächstes an der Reihe ist, einen Film vorzuschlagen, sodass der Rhythmus der Gruppe eingehalten wird.
7. Als Admin möchte ich die Reihenfolge der Mitglieder festlegen und verwalten können.
8. Als Mitglied möchte ich eine Benachrichtigung oder einen deutlichen Hinweis sehen, wenn ich dran bin.

---

## Key Decisions (noch offen)

- Reihenfolge-Logik: Feste Round-Robin-Reihenfolge, oder frei vom Admin bestimmbar?
- Backend-Design: Neue Mongo-Collection `watchlist`, oder als Erweiterung der bestehenden `Filmkritiken`-Struktur?
- Kann ein Mitglied mehrere Vorschläge gleichzeitig in der Watchlist haben?
- Sollen Vorschläge öffentlich sichtbar sein, oder nur für eingeloggte Mitglieder?
- Abstimmung über Vorschläge: Einfache Liste, oder können Mitglieder auf Vorschläge "liken"?

---

## Out of Scope

- Statistiken & Kalender (→ Phase 6)
