# Admin Dashboard för Scooter Rental

## Översikt
Detta branch är en admin-dashboard för **Scooter Rental**, en plattform som möjliggör hantering av städer, parkeringszoner, laddstationer och användare. Applikationen är byggd med **React** och integreras med ett backend-API för att tillhandahålla dynamisk datahantering och realtidsuppdateringar via **Socket.IO**.

---

## Funktioner
- **Stads- och laddstationshantering:**
  - Lägg till, redigera och visa städer och laddstationer.
- **Användarhantering:**
  - Hantera userkonton, inklusive deras balans och reshistorik.
- **Realtidsuppdateringar:**
  - Visa realtidsdata för scooters och laddstationer via WebSocket.
- **Kartfunktionalitet:**
  - Interaktiv karta med marker för scooters, laddstationer och parkeringszoner.

---

## Teknologi
Projektet i admin-branch använder följande teknologier:
- **React**: För att skapa dynamiska och interaktiva komponenter.
- **React Router**: För navigering mellan olika sidor.
- **React-Leaflet**: För att visa kartor och markörer.
- **Socket.IO**: För att hantera realtidsuppdateringar.
- **Axios**: För att kommunicera med backend-API.

---

## Så här kör du projektet

### Krav
- **Node.js** och **npm** installerat.
- Backend-servern igång för att API-anrop ska fungera innan att börja med frontend.

### Starta applikationen
   ```bash
   cd Adminwebbgränssnitt/adminwebbgränssnitt
   npm run dev
  ```

Installera beroenden:
   ```bash
npm install
   ```
Starta server:
   ```bash
npm run dev
```
Applikationen kommer att köras på  http://localhost:5173/

