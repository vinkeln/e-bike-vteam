const mysql = require("mysql2/promise"); // Importerar MySQL2 med stöd för promises.
const config = require("../../config/db/elsparkcykel.json"); // Importerar databasens konfigurationsfil.

// Funktion för att hämta alla parkeringszoner.
async function getCities() {

    // Skapa en anslutning till databasen.
    let db = await mysql.createConnection(config);

    try {
         // SQL-fråga för att hämta data från cites med en JOIN.
            let sql= `
            SELECT 
                *
            FROM
                city 
            ;`;

        // Kör frågan och hämta resultatet.
        let [result] = await db.query(sql,);

        return result; // Returnerar listan med cities.
    }  catch (error) {

        console.error("Error in getCites:", error.message);
        throw error;

    } finally {

        if (db) await db.end(); // Stäng anslutningen
    }
   
}

// Funktion för att addera en ny stad
async function addCity(name, country) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `INSERT INTO city (name, country) VALUES (?, ?);`;
        await db.query(sql, [name,country]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in addCity:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att hämta städer detaljer med namn
async function checkCities(name) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT name FROM city WHERE name = ?;`;
        let [result] = await db.query(sql, [name]); // Parametriserad fråga
        return result;
    } catch (error) {
        console.error("Error in checkCities:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att hämta städer detaljer med city id
async function checkCitiesById(cityId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT city_id FROM city WHERE city_id = ?;`;
        let [result] = await db.query(sql, [cityId]); // Parametriserad fråga
        return result;
    } catch (error) {
        console.error("Error in checkCities:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att ta bort en stad
async function deleteCity(cityId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `DELETE FROM city WHERE city_id = ?;`;
        await db.query(sql, [cityId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in deleteCity:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att hämta städernas detaljer med city id
async function getCity(cityId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT city_id FROM city WHERE city_id = ?;`;
        let [result] = await db.query(sql, [cityId]); // Parametriserad fråga
        return result;
    } catch (error) {
        console.error("Error in getCity:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


module.exports = {
    getCities,
    addCity,
    checkCities,
    getCity,
    deleteCity,
    checkCitiesById

};
