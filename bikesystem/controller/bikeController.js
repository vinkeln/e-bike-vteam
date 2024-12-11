// Handles all logic for the bike system
const {queryDatabase} = require('./db/database');
const {notifyAdmins, notifyCustomer} = require('./notify/notify');
const io = require("socket.io-client");

// Update the status of a bike
async function updateStatus(bikeId, locationId, status, speed) {
    const query = "UPDATE scooter SET current_location_id = ?, status = ?, speed = ? WHERE scooter_id = ?";
    return await queryDatabase(query, [locationId, status, speed, bikeId]);
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
    return (Math.random() * 25).toFixed(2); // Exempel p책 simulering
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

// Check battery level and notify if it's low
async function checkBatteryLevel(bikeId, batteryLevel, io) {
    if (batteryLevel < 20) {
        console.warn(`Bike ${bikeId} battery level low: ${batteryLevel}%`);
        io.emit("batteryWarning", {
            bikeId,
            batteryLevel,
            message: `Battery level is low (${batteryLevel}%) for bike ${bikeId}.`,
        });

        // Notify the admin
        notifyAdmins(bikeId, batteryLevel);

        // Notify the customer
        notifyCustomer(bikeId, batteryLevel);
    }
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

module.exports = {
    updateStatus,
    startBike,
    stopBike,
    updateBatteryLevel,
    getBikesForMaintenance,
    markBikeForMaintenance,
    isBikeUnderMaintenance,
    checkBatteryLevel,
};
