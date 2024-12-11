const mysql = require("mysql2/promise"); // Importerar MySQL2 med stöd för promises.
const config = require("../../config/db/elsparkcykel.json"); // Importerar databasens konfigurationsfil.

// Funktion för att hämta alla elspark cyklar
async function getBikes() {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT * FROM scooter;`;
        let [result] = await db.query(sql); // Parametriserad fråga utan externa indata
        return result;
    } catch (error) {
        console.error("Error in getBikes:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att hämta resan detaljer med scooter id
async function getByBikeId(bikeId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT * FROM scooter WHERE scooter_id = ?;`;
        let [result] = await db.query(sql, [bikeId]); // Parametriserad fråga
        return result;
    } catch (error) {
        console.error("Error in getByBikeId:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att skapa en ny resa
async function addScooter(currentLocationId, batteryLevel, lastServiceDate, currentLongitude, currentLatitude) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `INSERT INTO scooter (current_location_id, battery_level, last_service_date, current_longitude, current_latitude) VALUES ( ?, ?, ?, ?, ?)`;
        await db.query(sql, [currentLocationId, batteryLevel, lastServiceDate, currentLongitude, currentLatitude]); // Parametriserad fråga
        // return userId;
    } catch (error) {
        console.error("Error in addTravel:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att uppdatera resan
async function updateScooter(currentLocationId, batteryLevel, status, lastServiceDate, scooterId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `
            UPDATE scooter
            SET
            current_location_id = ?,
            battery_level = ?,
            status = ?,
            last_service_date = ?
            WHERE
            scooter_id = ?;
        `;
        await db.query(sql, [currentLocationId, batteryLevel, status, lastServiceDate, scooterId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in updateScooter:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}




// Funktion för att ta bort en användare
async function deleteScooter(scooterId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `DELETE FROM scooter WHERE scooter_id = ?;`;
        await db.query(sql, [scooterId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in deleteScooter:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att uppdatera resan
async function updateStatus(status, bikeId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `
            UPDATE scooter
            SET
            status = ?
            WHERE
            scooter_id = ?;
        `;
        await db.query(sql, [status, bikeId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in updateScooter:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


module.exports = {
    getBikes,
    getByBikeId,
    addScooter,
    updateScooter,
    deleteScooter,
    updateStatus
};
