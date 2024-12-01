const mysql = require("mysql2/promise"); // Importerar MySQL2 med stöd för promises.
const config = require("../../config/db/elsparkcykel.json"); // Importerar databasens konfigurationsfil.


// Funktion för att hämta alla laddningsstationer
async function getchargingStations() {

    let db = await mysql.createConnection(config);
    try {
        let sql = `
            SELECT 
                cs.station_id,
                cs.location_id,
                cs.total_ports,
                cs.available_ports,
                l.latitude,
                l.longitude,
                l.type,
                l.city_id
            FROM 
                chargingstation cs
            INNER JOIN 
                location l 
            ON 
                cs.location_id = l.location_id;`;
        let [result] = await db.query(sql); // Parametriserad fråga utan externa indata
        return result;
    } catch (error) {
        console.error("Error in getUsers:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att kontrollera om en parkeringszon redan finns på en specifik plats.
async function checkChargingStation(latitude, longitude) {
    let db = await mysql.createConnection(config);
    try {
            // SQL-fråga för att söka efter plats med samma latitud och longitud.
            let sql= `
            SELECT *
                FROM location 
            WHERE
                latitude = ?
            AND
                longitude = ?
            ;`
            ;

            let [result] = await db.query(sql, [latitude, longitude]); // Kör frågan.
            
            return result; // Returnera resultatet.
    } catch (error) {
        console.error("Error in checkChargingStation:", error.message);
        throw error;
    } finally {
        if (db) await db.end(); // Stäng anslutningen.
    }
    
}



// Funktion för att lägga till en ny parkeringszon.
async function addChargingStation(latitude, longitude, cityId ,totalPorts) {
    let db = await mysql.createConnection(config);

    try {
        // Startar en transaktion för att säkerställa datakonsistens.
        await db.beginTransaction();

        // Infoga platsen och hämta `insertId` direkt
        const [locationResult] = await db.query(
            "INSERT INTO location (latitude, longitude, type , city_id) VALUES (?, ?, 'laddstation', ?)",
            [latitude, longitude, cityId]
        );
        const locationId = locationResult.insertId; // Hämtar ID för den nyligen tillagda platsen.

        // Infogar en ny laddstation kopplad till plats-ID.
        await db.query(
            "INSERT INTO chargingstation (location_id, total_ports, available_ports) VALUES (?, ?, ?)",
            [locationId, totalPorts, totalPorts]
        );

        // Bekräfta transaktionen
        await db.commit();

        return {
            success: true,
            locationId: locationId,
            message: "Charging station added successfully.",
        };
    } catch (error) {
        // Återställ transaktionen vid fel
        await db.rollback();
        return {
            success: false,
            error: error.message,
        };
    } finally {
        // Stäng anslutningen
        if (db) await db.end();
    }

    
    
}


// Funktion för att hämta information om en specifik laddstation baserat på plats-ID.
async function getChargingStationLocation(locationId) {
    let db = await mysql.createConnection(config);
    try {
        // SQL-fråga för att hämta laddstation med givet ID.
        let sql= `SELECT * FROM chargingstation WHERE location_id = ?;`;

        let [result] = await db.query(sql, [locationId]); // Kör frågan med plats-ID som parameter.
        
        return result; // Returnera resultatet.
    } catch (error) {
        console.error("Error in getChargingStationLocation:", error.message);
        throw error;
    } finally {
        if (db) await db.end(); // Stäng anslutningen.
    }
    
}


// Funktion för att radera en parkeringszon och dess tillhörande plats.
async function deleteChargingStation(locationId) {
    let db = await mysql.createConnection(config);

    try {
            // SQL för att radera en parkeringszon och dess plats.
            let sql= `
            START TRANSACTION;
            DELETE
                FROM chargingstation 
            WHERE
                location_id = ?
            ;

            DELETE
                FROM location 
            WHERE
                location_id = ?
            ;
            COMMIT;
            
            `
            ;

            await db.query(sql, [locationId, locationId]); // Kör frågan med plats-ID.
            
            return { success: true, message: "Charging station deleted successfully" };
    } catch (error) {

        if (db) await db.rollback();
        console.error("Error in deleteChargingStation:", error.message);
        throw error;

    } finally {

        if (db) await db.end(); // Stäng anslutningen.
    }
    
}

// Funktion för att uppdatera en laddstation och dess platsinformation.
async function updateChargingStation(locationId,latitude, longitude, totalPorts) {
    let db = await mysql.createConnection(config);
    try {
        await db.beginTransaction();

        await db.query(
            `UPDATE chargingstation 
             SET total_ports = ?, available_ports = ? 
             WHERE location_id = ?;`,
            [totalPorts, totalPorts, locationId]
        );

        await db.query(
            `UPDATE location 
             SET latitude = ?, longitude = ? 
             WHERE location_id = ?;`,
            [latitude, longitude, locationId]
        );

        await db.commit();
        return { success: true, message: "Charging station updated successfully" };
    } catch (error) {
        if (db) await db.rollback();
        console.error("Error in updateChargingStation:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att addera nya port till en laddstation
async function addport(locationId, newPorts) {
    let db = await mysql.createConnection(config); // Skapa anslutning till databasen
    try {
        let sql = `
            UPDATE chargingstation
            SET 
                total_ports = total_ports + ?,
                available_ports = available_ports + ?
            WHERE location_id = ?;
        `;
        
        // Kör SQL-frågan med parametrar
        await db.execute(sql, [newPorts, newPorts, locationId]);
    } catch (error) {
        console.error("Error adding port:", error);
        throw error; // Rethrow för att hantera felet högre upp i kedjan
    } finally {
        if (db) {
            await db.end(); // Stäng anslutningen
        }
    }
}

// Funktion för att hämta alla laddningsstationer
async function getchargingStationsBycity(cityId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `
            SELECT 
                cs.station_id,
                cs.location_id,
                cs.total_ports,
                cs.available_ports,
                l.latitude,
                l.longitude,
                l.type,
                l.city_id
            FROM 
                chargingstation cs
            INNER JOIN 
                location l 
            ON 
                cs.location_id = l.location_id
            WHERE l.city_id = ?;    
                `;
        let [result] = await db.query(sql,[cityId]); // Parametriserad fråga utan externa indata
        return result;
    } catch (error) {
        console.error("Error in getUsers:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

module.exports = {
    getchargingStations,
    checkChargingStation,
    addChargingStation,
    getChargingStationLocation,
    deleteChargingStation,
    getChargingStationLocation,
    updateChargingStation,
    addport,
    getchargingStationsBycity
    
};
