# Backend Test

## Översikt
Denna branch innehåller en test för backend-projektet som implementerar ett REST API. Syftet med testerna är att säkerställa att olika api fungerar som förväntat och täcker viktiga funktioner som användarhantering, stadshantering, parkeringszoner, scooters, resor, betalningar och laddstationer.

Testerna är skrivna med [Mocha](https://mochajs.org/) som testframework och använder [Chai](https://www.chaijs.com/) för assertioner samt [chai-http](https://www.chaijs.com/plugins/chai-http/) för HTTP-förfrågningar.

---

## Badges
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/<vinkeln>/<e-bike-vteam>/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/<vinkeln>/<e-bike-vteam>/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/<vinkeln>/<e-bike-vteam>/badges/build.png?b=main)](https://scrutinizer-ci.com/g/<vinkeln>/<e-bike-vteam>/build-status/main)


## Syfte med tester

### 1. `cities.test.js`
- **Syfte:** hanterar städer.
- **API-funktioner:**
  - `GET /v1/cities`: Hämtar alla städer.
  - `POST /v1/cities/add`: Lägger till en ny stad.
  - `DELETE /v1/cities/:cityId`: Tar bort en stad.

---

### 2. `parking.test.js`
- **Syfte:** hanterar parkeringszoner kopplade till städer.
- **API-funktioner:**
  - `GET /v1/parkings`: Hämtar alla parkeringszoner.
  - `GET /v1/parkings/:cityId`: Hämtar parkeringszoner för en specifik stad.
  - `POST /v1/parkings/add`: Lägger till en ny parkeringszon.
  - `DELETE /v1/parkings/:locationId`: Tar bort en parkeringszon.
  - `PUT /v1/parkings/update`: Uppdaterar detaljer för en parkeringszon.

---

### 3. `payment.test.js`
- **Syfte:** hanterar betalningar kopplade till user och betalningar.
- **API-funktioner:**
  - `GET /v1/payments`: Hämtar alla betalningar.
  - `GET /v1/payments/:paymentId`: Hämtar en specifik betalning.
  - `POST /v1/payments`: Skapar en ny betalning.
  - `PUT /v1/payments/:paymentId`: Uppdaterar en betalning.
  - `DELETE /v1/payments/:paymentId`: Tar bort en betalning.
  - `GET /v1/payments/user/:userId`: Hämtar betalningar för en specifik user.

---

### 4. `scooter.test.js`
- **Syfte:** hanterar scooters i systemet.
- **API-funktioner:**
  - `GET /v1/scooters`: Hämtar alla scooters.
  - `GET /v1/scooters/:bikeId`: Hämtar en specifik scooter.

---

### 5. `travels.test.js`
- **Syfte:** hanterar resor.
- **API-funktioner:**
  - `GET /v1/travels`: Hämtar alla resor.
  - `POST /v1/travels`: Startar en ny resa.
  - `PUT /v1/travels`: Avslutar en resa.
  - `GET /v1/travels/:rideId`: Hämtar detaljer för en specifik resa.
  - `GET /v1/travels/user/:userId`: Hämtar resor för en specifik user.
  - `DELETE /v1/travels/:rideId`: Tar bort en resa.

---

### 6. `user.test.js`
- **Syfte:** Hanterar user/kund
- **API-funktioner:**
  - `GET /v1/user/users`: Hämtar alla user.
  - `POST /v1/user/signup`: Skapar en ny user.
  - `DELETE /v1/user/users/:userId`: Tar bort en user.
  - `PUT /v1/user/update/password`: Uppdaterar en users lösenord.

---

### 7. `chargingstations.test.js`
- **Syfte:** Hanterar elektriska laddstationer.
- **API-funktioner:**
  - `GET /v1/chargingstations`: Hämtar alla laddstationer.
  - `GET /v1/chargingstations/:cityId`: Hämtar laddstationer för en specifik stad.
  - `POST /v1/chargingstations/add`: Lägger till en ny laddstation.
  - `DELETE /v1/chargingstations/:locationId`: Tar bort en laddstation.
  - `PUT /v1/chargingstations/update`: Uppdaterar detaljer för en laddstation.
  - `PUT /v1/chargingstations/update/port`: Uppdaterar antalet portar i en laddstation.

---

## Så här kör du tester

1. **Installera beroenden:**
   Kör följande kommando i projektets rotmapp:
   ```bash
   npm install

2. **Köra testerna**
   ```bash
   npm test
```
Detta kommando använder mocha, som är specificerat i package.json.

