# Scooter Rental Service - Fullständigt Projekt

## Översikt
Scooter Rental Service är en komplett plattform som tillhandahåller hantering av el-scootrar, städer, parkeringszoner, laddstationer, resor och användarhantering. Projektet består av en **frontend** och en **backend** som arbetar tillsammans för att leverera en skalbar, användarvänlig och säker tjänst. Plattformen är byggd med **Node.js**, **React**, **Express** och **MySQL**, och integrerar realtidskommunikation via **Socket.IO**.

---

[![Code Coverage](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/?branch=main)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/?branch=main)
[![Code Intelligence Status](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/badges/code-intelligence.svg?b=main)](https://scrutinizer-ci.com/code-intelligence)

## Funktioner
- **Frontend:**
  - Interaktiv karta för scooters och laddstationer.
  - Användarvänligt gränssnitt för bokning, betalning och reshistorik.
  - Administratörsgränssnitt för hantering av städer, parkeringszoner och användare.

- **Backend:**
  - RESTful API för hantering av användare, scooters, resor, betalningar och laddstationer.
  - Realtidsuppdateringar för scooterstatus via **Socket.IO**.
  - Stöd för autentisering och behörighetskontroll med **JWT**.

---

## Teknologi
### Frontend
- **React**: Dynamiska och responsiva komponenter.
- **React-Leaflet**: Kartfunktionalitet med markörer för scooters och laddstationer.
- **Axios**: För att hantera API-anrop.


### Test
- **Mocha**: Testframework som används för att skriva och köra tester.
- **Chai**: Assertionbibliotek som används för att verifiera testresultat.
- **chai-http**: Verktyg för att testa HTTP-anrop till backend-API:erna.

  
### Backend
- **Node.js** och **Express**: Bygger och hanterar API:er.
- **MySQL**: Databashantering för användare, resor, betalningar och laddstationer.
- **Socket.IO**: Realtidskommunikation mellan klient och server.
- **bcrypt**: Hashning av lösenord för säker lagring.
- **jsonwebtoken (JWT)**: Autentisering och sessionshantering.
---

## Installation och Användning
### Krav
- **Node.js** och **npm** installerat.
- **MySQL**-databas konfigurerad enligt projektets specifikationer.

### 1.Backend
1. Installera beroenden:
   ```bash
   npm install
   ```
2.Skapa .env-fil:
```bash
PORT=3000
API_KEY=
JWT_KEY=
```
  
3. Starta server:
```bash
npm start
```
### 2.Frontend
1.Gå till frontend-mappen:
```bash
cd scooter-rental
```
2.Installera beroenden:
```bash
npm install
```
3.Starta front-servern:
```bash
npm start
```

## 3.Tester

### Kör följande kommando för att se tester:
```bash
npm test
```
