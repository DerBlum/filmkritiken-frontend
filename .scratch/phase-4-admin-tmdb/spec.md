# Phase 4 – Admin-Flow & TMDB-Anbindung

**Labels**: `ready-for-agent`  
**Status**: Draft — noch nicht gegrillt

---

## Problem Statement

Neue Filme müssen vom Admin manuell eingetragen werden. Dieser Prozess ist aktuell umständlich (Angular-Formular ohne Metadaten-Autofill). Außerdem muss der Admin Bewertungen öffnen und schließen sowie Diskussionsdaten korrigieren können. Die TMDB-API soll die Datenpflege erheblich beschleunigen.

---

## Solution

Ein Admin-Modal zum Hinzufügen neuer Filme mit TMDB-Suche-Autofill. Zusätzlich: Admin-Controls pro Film (Bewertungen öffnen/schließen, `besprochenAm` bearbeiten). Alle Admin-Aktionen sind durch die Route Guard (Phase 2) auf Admin-Mitglieder beschränkt.

---

## Rough User Stories

### Film hinzufügen
1. Als Admin möchte ich ein Modal öffnen, in dem ich einen neuen Film erfassen kann, sodass er als Nächster Film auf der Startseite erscheint.
2. Als Admin möchte ich einen Filmtitel eingeben und automatisch TMDB-Vorschläge sehen, sodass ich Metadaten nicht manuell eintippen muss.
3. Als Admin möchte ich aus den TMDB-Treffern einen auswählen, sodass Felder wie Regie, Jahr, Laufzeit, Originaltitel und Poster automatisch befüllt werden.
4. Als Admin möchte ich alle Felder vor dem Absenden manuell anpassen können, sodass Fehler aus der TMDB-Datenbank korrigiert werden können.
5. Als Admin möchte ich den Vorschlagenden (`beitragvon`) und das Datum (`besprochenAm`) festlegen können.
6. Als Admin möchte ich nach dem Speichern den neuen Film sofort auf der Startseite sehen.

### Bewertungen verwalten
7. Als Admin möchte ich pro Film einen Button sehen, mit dem ich Bewertungen öffnen oder schließen kann (`PATCH /bewertungenoffen/{offen}`), sodass ich den Bewertungszyklus steuern kann.
8. Als Admin möchte ich das `besprochenAm`-Datum eines Films nachträglich anpassen können, sodass Terminänderungen korrekt abgebildet werden.

---

## Key Decisions (noch offen)

- TMDB-API-Key: Wird er im Frontend (via `VITE_TMDB_API_KEY`) oder im Backend als Proxy genutzt? (Sicherheitsrelevant — API-Key sollte nicht im Browser exponiert werden)
- Admin-Einstiegspunkt: Floating Action Button (FAB) auf der Startseite, oder dedizierter Admin-Bereich mit eigener Route?
- Poster-Upload: Direkt aus TMDB (URL → Backend lädt es runter), oder manueller Datei-Upload bleibt erhalten?
- Was passiert, wenn kein TMDB-Treffer gefunden wird? Vollständig manuelles Formular als Fallback?

---

## Out of Scope

- Watchlist / Vorschlags-System (→ Phase 5)
- Statistiken (→ Phase 6)
