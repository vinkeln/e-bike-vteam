# Backend för Scooter Rental

## Översikt
Denna branch innehåller backend för **Scooter Rental**, som möjliggör hantering av städer, parkeringszoner, laddstationer, användare, resor, betalningar och scooters. Applikationen är byggd med **Node.js**, **Express** och integrerar **Socket.IO** för aktiva uppdateringar.

---

## Funktioner
- **Stads- och laddstationshantering:**
  Lägg till, uppdatera och ta bort städer och laddstationer.
- **Parkeringshantering:**
  Hantera parkeringszoner med kapacitet och maxhastighet.
- **Scooters och resor:**
  Hantera scooters, starta och avsluta resor, och spåra batterinivå.
- **Användarhantering:**
  Registrera och autentisera användare samt hantera deras saldo.
- **Betalningar:**
  Skapa, uppdatera och spåra betalningar för användare.
- **Realtidsfunktioner:**
  Socket.IO används för att kontrollera tillgängligheten på scooters i realtid.

---

## Teknologi
Backend är byggt med:
- **Node.js** och **Express**: För att skapa RESTful API:er.
- **MySQL**: Databashantering med hjälp av `mysql2/promise`.
- **Socket.IO**: Realtidskommunikation mellan klient och server.
- **bcrypt** och **jsonwebtoken**: För lösenordshantering och autentisering.
---


## Så här funkar projektet

### Krav
- **Node.js** och **npm** installerat.
```bash
  npm install
```
- En **MySQL-databas** med rätt konfigurationsdetaljer i `elsparkcykel.json`.
- En `.env`-fil med följande variabler:
```bash
API_KEY=key12
JWT_KEY=secret
```
Starta servern:
```bash
npm start
```
Servern körs på http://localhost:3000.
