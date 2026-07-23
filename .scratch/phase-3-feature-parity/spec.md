# Phase 3 – Funktionsparität & Angular-Ablösung

**Labels**: `ready-for-agent`  
**Status**: Draft — noch nicht gegrillt

---

## Problem Statement

Nach Phase 2 ist Auth vorhanden, aber der Kernworkflow der Gruppe fehlt noch: Das Bewertungsformular, eine vollständige Archiv-Seite mit Such- und Filterfunktion und eine Film-Detailseite. Erst wenn diese Features vollständig implementiert sind, kann die Angular-App endgültig abgeschaltet werden.

---

## Solution

Re-Implementierung der drei Kern-Features im Vue-Stack. Meilenstein: Vollständige funktionale Parität — danach wird `legacy/angular/` aus dem Repo entfernt.

---

## Rough User Stories

### Bewertungsformular
1. Als Mitglied möchte ich für einen Film mit `bewertungoffen: true` eine Wertung von 1–10 vergeben, sodass meine Bewertung gespeichert wird.
2. Als Mitglied möchte ich nach dem Absenden eine Bestätigung (Toast) sehen, sodass ich weiß, dass meine Bewertung angekommen ist.
3. Als Mitglied möchte ich meine bereits abgegebene Wertung sehen (und ggf. anpassen), sodass ich meinen aktuellen Stand kenne.
4. Als Mitglied möchte ich die Option "Enthaltung" wählen können, sodass ich aktiv auf eine Wertung verzichten kann.
5. Als öffentlicher Besucher möchte ich das Formular sehen, aber nicht absenden können, sodass die Read-Only-Ansicht erhalten bleibt.

### Archiv mit Suche & Filter
6. Als öffentlicher Besucher möchte ich Filme nach Titel suchen können, sodass ich einen bestimmten Film schnell finde.
7. Als öffentlicher Besucher möchte ich Filme nach Jahr, Regie oder Vorschlagendem filtern können.
8. Als öffentlicher Besucher möchte ich die Sortierung ändern können (neueste zuerst, beste zuerst, älteste zuerst).
9. Als öffentlicher Besucher möchte ich durch Pagination oder Endless Scrolling durch das Archiv navigieren.

### Film-Detailseite
10. Als öffentlicher Besucher möchte ich auf eine Filmkarte klicken, sodass ich die Detailseite mit allen Informationen sehe.
11. Als öffentlicher Besucher möchte ich auf der Detailseite alle Bewertungen der Mitglieder einzeln einsehen, sodass ich die Vielfalt der Meinungen nachvollziehen kann.
12. Als öffentlicher Besucher möchte ich alle Filmmetadaten sehen (Laufzeit, Originaltitel, Produktionsland, Altersfreigabe).

---

## Key Decisions (noch offen)

- Bewertungsformular: Direkt auf der Startseite/Detailseite, oder als Modal?
- Skalendarstellung im Formular: 10 Klick-Buttons, ein Slider, oder Sternchen-Auswahl die intern auf 1–10 mappt?
- Detailseite: Eigene Route `/film/{id}` oder Slide-Over-Panel ohne Routenwechsel?
- Endless Scrolling vs. "Mehr laden"-Button vs. klassische Pagination im Archiv?
- Angular-Löschzeitpunkt: Direkt nach Phase-3-Abschluss oder separater Cleanup-Commit?

---

## Out of Scope

- TMDB-Integration (→ Phase 4)
- Admin-UI (→ Phase 4)
- Watchlist (→ Phase 5)
