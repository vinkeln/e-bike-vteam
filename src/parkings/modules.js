const mysql = require("mysql2/promise"); // Importerar MySQL2 med stöd för promises.
const config = require("../../config/db/elsparkcykel.json"); // Importerar databasens konfigurationsfil.

// Funktion för att hämta alla parkeringszoner.
async function getParkings() {
  // Skapa en anslutning till databasen.
  let db = await mysql.createConnection(config);

  try {
    // SQL-fråga för att hämta data från parkingzone och location med en JOIN.
    let sql = `
            SELECT 
                p.zone_id,
                p.location_id,
                p.max_speed,
                p.capacity,
                l.latitude,
                l.longitude,
                l.type,
                l.city_id
            FROM 
                parkingzone p
            INNER JOIN 
                location l 
            ON 
                p.location_id = l.location_id;`;

    // Kör frågan och hämta resultatet.
    let [result] = await db.query(sql);

    return result; // Returnerar listan med parkeringszoner.
  } catch (error) {
    console.error("Error in getParkings:", error.message);
    throw error;
  } finally {
    if (db) await db.end(); // Stäng anslutningen
  }
}

// Funktion för att lägga till en ny parkeringszon.
async function addPark(latitude, longitude, cityId, maxSpeed, capacity) {
  let db = await mysql.createConnection(config);

  try {
    // Startar en transaktion för att säkerställa datakonsistens.
    await db.beginTransaction();

    // Infoga platsen och hämta `insertId` direkt
    const [locationResult] = await db.query(
      "INSERT INTO location (latitude, longitude, type , city_id) VALUES (?, ?, 'parkeringszon', ?)",
      [latitude, longitude, cityId]
    );
    const locationId = locationResult.insertId; // Hämtar ID för den nyligen tillagda platsen.

    // Infogar en ny parkeringszon kopplad till plats-ID.
    await db.query(
      "INSERT INTO parkingzone (location_id, max_speed, capacity) VALUES (?, ?, ?)",
      [locationId, maxSpeed, capacity]
    );

    // Bekräfta transaktionen
    await db.commit();

    return {
      success: true,
      locationId: locationId,
      message: "Parking zone added successfully.",
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

// Funktion för att hämta information om en specifik parkeringszon baserat på plats-ID.
async function getParkingLocation(locationId) {
  let db = await mysql.createConnection(config);
  try {
    // SQL-fråga för att hämta parkeringszonen med givet ID.
    let sql = `SELECT * FROM parkingzone WHERE location_id = ?;`;

    let [result] = await db.query(sql, [locationId]); // Kör frågan med plats-ID som parameter.

    return result; // Returnera resultatet.
  } catch (error) {
    console.error("Error in getParkingLocation:", error.message);
    throw error;
  } finally {
    if (db) await db.end(); // Stäng anslutningen.
  }
}

// Funktion för att radera en parkeringszon och dess tillhörande plats.
async function deletePark(locationId) {
  let db = await mysql.createConnection(config);

  try {
    // SQL för att radera en parkeringszon och dess plats.
    let sql = `
            START TRANSACTION;
            DELETE
                FROM parkingzone 
            WHERE
                location_id = ?
            ;

            DELETE
                FROM location 
            WHERE
                location_id = ?
            ;
            COMMIT;
            
            `;
    await db.query(sql, [locationId, locationId]); // Kör frågan med plats-ID.

    return { success: true, message: "Parking zone deleted successfully" };
  } catch (error) {
    if (db) await db.rollback();
    console.error("Error in deletePark:", error.message);
    throw error;
  } finally {
    if (db) await db.end(); // Stäng anslutningen.
  }
}

// Funktion för att kontrollera om en parkeringszon redan finns på en specifik plats.
async function checkParkings(latitude, longitude) {
  let db = await mysql.createConnection(config);
  try {
    // SQL-fråga för att söka efter plats med samma latitud och longitud.
    let sql = `
            SELECT *
                FROM location 
            WHERE
                latitude = ?
            AND
                longitude = ?
            ;`;
    let [result] = await db.query(sql, [latitude, longitude]); // Kör frågan.

    return result; // Returnera resultatet.
  } catch (error) {
    console.error("Error in checkParkings:", error.message);
    throw error;
  } finally {
    if (db) await db.end(); // Stäng anslutningen.
  }
}

// Funktion för att uppdatera en parkeringszon och dess platsinformation.
async function updatePark(locationId, latitude, longitude, capacity, maxSpeed) {
  let db = await mysql.createConnection(config);
  try {
    await db.beginTransaction();

    await db.query(
      `UPDATE parkingzone 
             SET capacity = ?, max_speed = ? 
             WHERE location_id = ?;`,
      [capacity, maxSpeed, locationId]
    );

    await db.query(
      `UPDATE location 
             SET latitude = ?, longitude = ? 
             WHERE location_id = ?;`,
      [latitude, longitude, locationId]
    );

    await db.commit();
    return { success: true, message: "Parking zone updated successfully" };
  } catch (error) {
    if (db) await db.rollback();
    console.error("Error in updatePark:", error.message);
    throw error;
  } finally {
    if (db) await db.end();
  }
}

// Funktion för att hämta alla parkeringszoner.
async function getParkBycity(cityId) {
  // Skapa en anslutning till databasen.
  let db = await mysql.createConnection(config);

  try {
    // SQL-fråga för att hämta data från parkingzone och location med en JOIN.
    let sql = `
            SELECT 
                p.zone_id,
                p.location_id,
                p.max_speed,
                p.capacity,
                l.latitude,
                l.longitude,
                l.type,
                l.city_id
            FROM 
                parkingzone p
            INNER JOIN 
                location l 
            ON 
                p.location_id = l.location_id
            WHERE
            l.city_id = ?    
                ;`;

    // Kör frågan och hämta resultatet.
    let [result] = await db.query(sql, cityId);

    return result; // Returnerar listan med parkeringszoner.
  } catch (error) {
    console.error("Error in getParkings:", error.message);
    throw error;
  } finally {
    if (db) await db.end(); // Stäng anslutningen
  }
}

module.exports = {
  getParkings,
  addPark,
  getParkingLocation,
  deletePark,
  checkParkings,
  updatePark,
  getParkBycity,
};
