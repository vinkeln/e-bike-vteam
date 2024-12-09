const { io } = require("socket.io-client");
const mysql = require("mysql2/promise");

// MySQL connection configuration
const config = {
    host: "localhost",
    user: "user",
    password: "password",
    database: "database",
};

// Funktion to query the database
async function queryDatabase(query, params = []) {
    let db;
    try {
        db = await mysql.createConnection(config);
        const [result] = await db.query(query, params);
        return result;
    } finally { // Close the connection
        if (db) await db.end();
    }
}

// Update the status of a bike
async function updateStatus(bikeId, locationId, status, speed) {
    return await queryDatabase(
        "UPDATE scooter SET current_location_id = ?, status = ?, speed = ? WHERE scooter_id = ?",
        [locationId, status, speed, bikeId]
    );
}

// Connect to the WebSocket server
const socket = io("http://localhost:3000");

// Sends a status update to the server
function sendStatusUpdate() {
    const maxSpeed = 30; // Top speed 30
    const realSpeed = getSpeedFromSensor(); // Funktion to get speed from sensor
    const locationId = getCurrentLocationId(); // Funktion to get location ID
    const bikeId = 1; // Exampel bike ID

    // Check if the speed exceeds the limit
    if (realSpeed > maxSpeed) {
        console.warn(`Speed ${realSpeed} exceeds the limit ${maxSpeed}`);
        return; // Skip the rest of the function
    }

    const data = {
        bikeId,
        locationId,
        status: "active",
        speed: realSpeed,
    };
        // Log the data before sending
        console.log("Sending data to server:", data);
    socket.emit("updateStatus", data); // Skicka data till servern
}

// Funktion to get speed from sensor
function getSpeedFromSensor() {
    return (Math.random() * 25).toFixed(2); // Exempel på simulering
}

// Listen for server responses
socket.on("updateSuccess", (message) => {
    console.log("Server response:", message);
});

socket.on("updateError", (error) => {
    console.error("Error response:", error);
});

// Sends a status update to the server every 5 seconds
let statusInterval;

socket.on("connect", () => {
    console.log("Connected to server");
    statusInterval = setInterval(sendStatusUpdate, 5000);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
    clearInterval(statusInterval); // Ends the status update interval
});

// Function to send start command to the server
async function startBike(bikeId) {
    return await queryDatabase(
        "UPDATE scooter SET status = 'active' WHERE scooter_id = ?",
        [bikeId]
    );
}

// Function to send stop command to the server
async function stopBike(bikeId) {
    return await queryDatabase(
        "UPDATE scooter SET status = 'stopped' WHERE scooter_id = ?",
        [bikeId]
    );
}

// Update the status of a bike
async function updateBatteryLevel(bikeId, batteryLevel) {
    return await queryDatabase("UPDATE scooter SET battery_level = ? WHERE scooter_id = ?", [
        batteryLevel,
        bikeId,
    ]);
}

// Get all bikes that need maintenance
async function getBikesForMaintenance() {
    return await queryDatabase("SELECT * FROM scooter WHERE status = 'underhåll'");
}

// Mark a bike for maintenance
async function markBikeForMaintenance(bikeId) {
    return await queryDatabase("UPDATE scooter SET status = 'underhåll' WHERE scooter_id = ?", [
        bikeId,
    ]);
}

// Export the functions to be used in other modules
module.exports = {
    sendStatusUpdate,
    startBike,
    stopBike,
    updateBatteryLevel,
    getBikesForMaintenance,
    markBikeForMaintenance,
    updateStatus,
};