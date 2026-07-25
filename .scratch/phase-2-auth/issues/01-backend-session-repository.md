# 01 — Backend: MongoDB Session Repository

**What to build:** Eine neue MongoDB-Collection `sessions` mit vollständigem CRUD-Interface, sodass das Backend Benutzer-Sessions persistieren und wiederfinden kann. Abgelaufene Sessions sollen automatisch von MongoDB gelöscht werden.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `Session`-Struct mit den Feldern: `ID` (Session-ID, UUID), `Name` (Anzeigename aus EntraID), `Permissions` (Liste der Rollen aus dem JWT-`roles`-Claim), `AccessToken` (für zukünftige Token-Refresh-Flows), `ExpiresAt` (Ablaufzeitpunkt), `CreatedAt`
- [ ] `SessionRepository`-Interface mit: `SaveSession`, `FindSession` (gibt Fehler zurück wenn nicht vorhanden oder abgelaufen), `DeleteSession`, `RefreshSession` (setzt `ExpiresAt` auf jetzt + Session-Dauer)
- [ ] Implementation des Interface in `infrastructure/db/mongo/SessionRepository.go`, analog zu `MongoRepository.go`
- [ ] MongoDB TTL-Index auf dem `expiresAt`-Feld, sodass abgelaufene Session-Dokumente automatisch gelöscht werden
- [ ] `mongoDbRepository` implementiert das `SessionRepository`-Interface (oder separates Struct — konsistent mit bestehendem Muster wählen)
- [ ] Unit-Tests für alle Repository-Methoden (gemockte MongoDB-Collection)
