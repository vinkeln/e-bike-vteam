# Scooter Rental Service - Fullständigt Projekt

## Översikt
Scooter Rental Service är en komplett plattform som tillhandahåller hantering av el-scootrar, städer, parkeringszoner, laddstationer, resor och användarhantering. Projektet består av en **frontend** och en **backend** som arbetar tillsammans för att leverera en skalbar, användarvänlig och säker tjänst. Plattformen är byggd med **Node.js**, **React**, **Express** och **MySQL**, och integrerar realtidskommunikation via **Socket.IO**.

---

[![Code Coverage](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/?branch=main)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/?branch=main)
[![Code Intelligence Status](https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/badges/code-intelligence.svg?b=main)](https://scrutinizer-ci.com/code-intelligence)

# Starta E-Bike VTeam Projektet
## 1.Klona Repot
 - För att börja måste du klona projektets repository från GitHub till din lokala maskin.
 - Öppna terminalen och kör följande kommando:
   ```bash
   git clone -b main --single-branch https://github.com/vinkeln/e-bike-vteam
   ```
## 2.Navigera till Projektmappen
 - När repot har klonats, navigera till projektmappen med följande kommando:
   ```bash
   cd e-bike-vteam
   ```
## 3.Docker Engine
 - Se till att du har Docker Engine installerad och igång på din maskin. Om du inte har Docker installerat kan du ladda ner och installera det från Dockers officiella webbplats.

## 4.Node.js (Om du behöver köra simuleringen utan Docker)
 ### Om du inte har Node.js installerat, följ dessa steg:
 - Ladda ner Node.js från Node.js officiella webbplats.
 - Installera Node.js genom att följa installationsguiden.
 - Verifiera installationen genom att köra följande kommando i terminalen:
 
    
  #### Linux
  ```bash
   sudo apt-get install -y nodejs
   ```
  
# Starta Projektet
## 1.Starta Docker Containers
 - För att starta alla servrar och tjänster, kör följande kommando:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```
## 2.Öppna Projektet i Webbläsaren
 - När alla tjänster har startats kan du öppna projektet i din webbläsare med följande URL:er:
  #### Admin-sida: http://localhost:8080
  #### User-sida: http://localhost:3002
  #### User-app: http://localhost:8081

## 3.Simulera en cykelhyra
 - Om du vill simulera hur en cykel hyrs ut, navigera till bikesystem och starta nödvändiga tjänster:
```bash
cd bikesystem
npm install
cd controller
node bikeController.js
```

# Starta simulering
- För att simulera uthyrning av 3000 cyklar i 3 olika städer, samt lägga till 3000 användare och skapa 3000 resor, kör:
  ```bash
  docker-compose -f docker-compose.sim.yml up
```
- Om du vill starta simuleringen i bakgrunden kör:
```bash
  docker-compose -f docker-compose.sim.yml up -d
```

# stoppa Docker-containers
  ```bash
  docker-compose -f docker-compose.dev.yml down
  docker-compose -f docker-compose.dev.yml down
```
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
### För att kontrollera github/worflows flödet med ci-cd:
```
https://github.com/vinkeln/e-bike-vteam/
actions
```
### Kontrollera automatiska tester med Scrutinizer
```
https://scrutinizer-ci.com/g/vinkeln/e-bike-vteam/
```
