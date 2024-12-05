const mysql = require("mysql2/promise");
const config = require("../../config/db/elsparkcykel.json");


// Get status and location for one specific bike.
async function getBikeStatus(bikeId) {
    let db = await mysql.createConnection(config);
    let [result] = await db.query("SELECT * FROM scooter WHERE scooter_id = ?", [bikeId]);
    await db.end();
    return result;
}

// Updates bikes status and position.
async function updateBikeStatus(bikeId, current_location_id, status) {
    let db = await mysql.createConnection(config);
    let [result] = await db.query(
        "UPDATE scooter SET current_location_id = ?, status = ? WHERE scooter_id = ?",
        [current_location_id, status, bikeId]
    );
    await db.end();
    return result;
}

// Start a bike.
async function startBike(bikeId) {
    let db = await mysql.createConnection(config);
    let [result] = await db.query(
        "UPDATE scooter SET status = 'active' WHERE scooter_id = ?",
        [bikeId]
    );
    await db.end();
    return result;
}

// Stop a bike.
async function stopBike(bikeId) {
    let db = await mysql.createConnection(config);
    let [result] = await db.query(
        "UPDATE scooter SET status = 'idle' WHERE scooter_id = ?",
        [bikeId]
    );
    await db.end();
    return result;
}

    // Get battery level and warnings.


    // Update battery level.


    // Get bikes that needs maintenance.


    // Mark bikes that has current maintenance.


module.exports = {
    getBikeStatus,
    updateBikeStatus,
    startBike,
    stopBike,
}