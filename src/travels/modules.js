const mysql = require("mysql2/promise"); // Importerar MySQL2 med stöd för promises.
const config = require("../../config/db/elsparkcykel.json"); // Importerar databasens konfigurationsfil.

// Funktion för att hämta alla användare
async function getTravels() {
  let db = await mysql.createConnection(config);
  try {
    let sql = `SELECT * FROM ride;`;
    let [result] = await db.query(sql); // Parametriserad fråga utan externa indata
    return result;
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    throw error;
  } finally {
    if (db) await db.end();
  }
}

// Funktion för att skapa en ny resa
async function addTravel(userId, scooterId, startLocationId, startTime, cost) {
  const db = await mysql.createConnection(config);
  try {
    // Starta transaktionen
    await db.beginTransaction();

    // Lägg till en ny resa
    let sql = `INSERT INTO ride (user_id, scooter_id, start_location_id, start_time, cost) VALUES (?, ?, ?, ?, ?)`;
    await db.query(sql, [userId, scooterId, startLocationId, startTime, cost]);

    // Uppdatera scooterns status till "upptagen"
    let updateScooterSql = `UPDATE scooter SET status = "upptagen" WHERE scooter_id = ?`;
    await db.query(updateScooterSql, [scooterId]);

    // Commit transaktionen
    await db.commit();

    return userId; // Returnera userId för vidare användning om det behövs
  } catch (error) {
    // Om något går fel, rulla tillbaka transaktionen
    await db.rollback();
    console.error("Error in addTravel:", error.message);
    throw error;
  } finally {
    // Stäng anslutningen till databasen
    if (db) await db.end();
  }
}
// Funktion för att uppdatera resan
async function updateTravel(endTime, cost, rideId, end_location_id) {
  const db = await mysql.createConnection(config);
  try {
    // Starta transaktionen
    await db.beginTransaction();

    // Uppdatera information om resan
    let sql = `
            UPDATE ride 
            SET
            end_location_id = ?,
            end_time = ?,
            cost = cost + ?
            WHERE ride_id = ?;
        `;
    await db.query(sql, [end_location_id, endTime, cost, rideId]);

    // Hämta scooter_id från resan för att uppdatera status
    let getScooterSql = `SELECT scooter_id FROM ride WHERE ride_id = ?`;
    const [result] = await db.query(getScooterSql, [rideId]);

    if (result.length === 0) {
      throw new Error("Ride not found");
    }

    const scooterId = result[0].scooter_id;

    // Uppdatera scooterns status till "ledig"
    let updateScooterSql = `UPDATE scooter SET status = "ledig" WHERE scooter_id = ?`;
    await db.query(updateScooterSql, [scooterId]);

    // Commit transaktionen
    await db.commit();
  } catch (error) {
    // Om något går fel, rulla tillbaka transaktionen
    await db.rollback();
    console.error("Error in updateTravel:", error.message);
    throw error;
  } finally {
    // Stäng anslutningen till databasen
    if (db) await db.end();
  }
}

// Funktion för att hämta resan detaljer med ride id
async function getByRideId(rideId) {
  let db = await mysql.createConnection(config);
  try {
    let sql = `SELECT * FROM ride WHERE ride_id = ?;`;
    let [result] = await db.query(sql, [rideId]); // Parametriserad fråga
    return result;
  } catch (error) {
    console.error("Error in getByRideId:", error.message);
    throw error;
  } finally {
    if (db) await db.end();
  }
}

// Funktion för att ta bort en användare
async function deleteRide(rideId) {
  let db = await mysql.createConnection(config);
  try {
    let sql = `DELETE FROM ride WHERE ride_id = ?;`;
    await db.query(sql, [rideId]); // Parametriserad fråga
  } catch (error) {
    console.error("Error in deleteRide:", error.message);
    throw error;
  } finally {
    if (db) await db.end();
  }
}

// Funktion för att hämta resan detaljer med ride id
async function getByUserId(userId) {
  let db = await mysql.createConnection(config);
  try {
    let sql = `SELECT * FROM ride WHERE user_id = ?;`;
    let [result] = await db.query(sql, [userId]); // Parametriserad fråga
    return result;
  } catch (error) {
    console.error("Error in getByuserId:", error.message);
    throw error;
  } finally {
    if (db) await db.end();
  }
}

module.exports = {
  getTravels,
  addTravel,
  updateTravel,
  getByRideId,
  deleteRide,
  getByUserId,
};
