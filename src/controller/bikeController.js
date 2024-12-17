const mysql = require("mysql2/promise");
const dbConfig = require("../../config/db/elsparkcykel.json");

// Handle all database requets.
async function queryDatabase(query, params = []) {
  let db;
  try {
    db = await mysql.createConnection(dbConfig);
    const [result] = await db.query(query, params);
    return result;
  } finally {
    if (db) await db.end();
  }
}

// Update the status of a bike
async function updateStatus(
  bikeSerialNumber,
  locationId,
  status,
  speed,
  longitude,
  latitude,
  batteryLevel
) {
  const query =
    "UPDATE scooter SET current_location_id = ?, status = ?, speed = ?, current_longitude = ?, current_latitude = ?, battery_level = ? WHERE bike_serial_number = ?";
  return await queryDatabase(query, [
    locationId,
    status,
    speed,
    longitude,
    latitude,
    batteryLevel,
    bikeSerialNumber,
  ]);
}

// Start a bike
async function startBike(bikeId) {
  const query = "UPDATE scooter SET status = 'upptagen' WHERE scooter_id = ?";
  return await queryDatabase(query, [bikeId]);
}

// Stop a bike
async function stopBike(bikeId) {
  const query = "UPDATE scooter SET status = 'ledig' WHERE scooter_id = ?";
  return await queryDatabase(query, [bikeId]);
}

// Update the battery level of a bike
async function updateBatteryLevel(bikeId, batteryLevel) {
  const query = "UPDATE scooter SET battery_level = ? WHERE scooter_id = ?";
  return await queryDatabase(query, [batteryLevel, bikeId]);
}

// Get all bikes that need maintenance
async function getBikesForMaintenance() {
  const query = "SELECT * FROM scooter WHERE status = 'underhåll'";
  return await queryDatabase(query);
}

// Mark a bike for maintenance
async function markBikeForMaintenance(bikeId) {
  const query = "UPDATE scooter SET status = 'underhåll' WHERE scooter_id = ?";
  return await queryDatabase(query, [bikeId]);
}

// Check if a bike is under maintenance
async function isBikeUnderMaintenance(bikeId) {
  const query = "SELECT status FROM scooter WHERE scooter_id = ?";
  const results = await queryDatabase(query, [bikeId]);
  return results.length > 0 && results[0].status === "underhåll";
}

// Check if a bike is under maintenance
async function getBike(bikeId) {
  const query = "SELECT * FROM scooter WHERE bike_serial_number = ?";
  const results = await queryDatabase(query, [bikeId]);
  return results.length > 0 && results[0].status === "ledig";
}

// Check if a bike is under maintenance
async function getBusyBike(bikeId) {
  const query = "SELECT * FROM scooter WHERE bike_serial_number = ?";
  const results = await queryDatabase(query, [bikeId]);
  return results.length > 0 && results[0].status === "upptagen";
}

module.exports = {
  updateStatus,
  startBike,
  stopBike,
  updateBatteryLevel,
  getBikesForMaintenance,
  markBikeForMaintenance,
  isBikeUnderMaintenance,
  getBike,
  getBusyBike,
};
