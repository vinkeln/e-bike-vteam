// Handles all logic for the bike system
const io = require("socket.io-client");
const cyklesModules = require("./externalApi.js"); // Moduler för scooter
const moveCycle = require("../movment/bikemovement.js");
let isDisabled = false;
// Connect to the WebSocket server
const socket = io("http://localhost:3000");
const travelLogs = []; 
const bikeSerialNumber = "12345"; 
let currentLongitude = 18.0632;
let currentLatitude = 59.3345;
let batteryLevel = 100;
let statusInterval; // För att hålla koll på statusuppdateringar
let chargingInterval; // För att hålla koll på laddningen
let consumptionInterval;
let chargingStarted = false; // För att hålla reda på om laddningen redan har startat
let chargingDuration = 60 * 60 * 1000; 



// Simulera röd lampa
function simulateRedLight(isOn) {
    if (isOn) {
        console.log("Red light is ON: Bike is not available.");
    } else {
        console.log("Red light is OFF: Bike is available.");
    }
}

// Funktion för att stoppa cykeln
function disableBike() {
    if (isDisabled) {
        console.log("Bike is already disabled.");
        return;
    }

    isDisabled = true; // Markera cykeln som avstängd
    console.log("Bike has been disabled and can no longer be used.");

    stopBatteryConsumption();

    // Skicka statusuppdatering till servern
    sendStatusUpdate("avstängd", currentLongitude, currentLatitude, batteryLevel);
    statusInterval = setInterval(() => sendStatusUpdate("avstängd", currentLongitude, currentLatitude, batteryLevel), 5000);
    // Eventuellt: Logga att cykeln är avstängd i en databas
}

// Funktion för att aktivera cykeln igen
function enableBike() {
    if (!isDisabled) {
        console.log("Bike is already enabled.");
        return;
    }

    isDisabled = false; // Återaktivera cykeln
    console.log("Bike has been enabled and is ready for use.");

    stopBatteryConsumption();
    // Skicka statusuppdatering till servern
    sendStatusUpdate("ledig", currentLongitude, currentLatitude, batteryLevel);

    // Återuppta batteriförbrukning och statusuppdateringar
    simulateBatteryConsumption();
    statusInterval = setInterval(() => sendStatusUpdate("ledig", currentLongitude, currentLatitude, batteryLevel), 5000);
}


// Funktion för att simulera batteriförbrukning (som ska stoppas vid laddning)
function simulateBatteryConsumption() {
    const reductionPerSecond = 5 / 3600; // 5% per timme, fördelat på sekunder

    
        // Uppdatera batterinivån var 5:e sekund
        consumptionInterval = setInterval(() => {
        batteryLevel -= reductionPerSecond * 5; // Minska med 5 sekunders förbrukning
        batteryLevel = Math.max(0, batteryLevel); // Förhindra att batterinivån går under 0

        console.log(`Batterinivå: ${batteryLevel.toFixed(2)}%`);
        
        // Kontrollera om batterinivån är låg
        if (batteryLevel < 20) {
            console.warn(`Varning: Batterinivå låg! (${batteryLevel.toFixed(2)}%)`);

        // Skicka varning till servern
        socket.emit("batteryWarning", {
            bikeSerialNumber,
            batteryLevel,
            message: `Battery level is low (${batteryLevel.toFixed(2)}%) for bike ${bikeSerialNumber}.`
        });

        // Logga varningen
        console.log(`Battery warning sent for bike ${bikeSerialNumber}`);
        }
        if (batteryLevel <= 0) {
            console.error("Batteriet är helt slut! Cykeln måste laddas.");
            stopBatteryConsumption(); // Stoppa batteriförbrukning
        }

    }, 5000);

    
}

// Funktion för att stoppa batteriförbrukningen
function stopBatteryConsumption() {
    
        if (statusInterval) clearInterval(statusInterval);
        if (consumptionInterval) clearInterval(consumptionInterval);
    
}

// Funktion för att starta laddning
function startChargingCycle(bikeId) {

    if (chargingStarted) {
        console.log(`Bike ${bikeId} is already charging.`);
        return; // Om laddningen redan pågår, gör ingenting
    }

    console.log(`Bike ${bikeId} is now under maintenance for charging.`);
    
    // Markera att laddningen har startat
    chargingStarted = true;

    simulateRedLight(chargingStarted);
    // Stoppa batteriförbrukning och uppdateringsintervall för status
    stopBatteryConsumption();

    // Starta laddning i ett intervall (laddar i 1 timme)
    chargingInterval = setInterval(() => {
        if (batteryLevel >= 100) {
            clearInterval(chargingInterval); // Stoppa laddningen när batterinivån är 100%
            console.log(`Bike ${bikeId} has been fully charged to 100%.`);
            batteryLevel = 100;
            // Skicka statusuppdatering till servern att cykeln är "ledig"
            sendStatusUpdate("ledig", currentLongitude, currentLatitude, batteryLevel);
            // Starta batteriförbrukning igen
            simulateBatteryConsumption();

            statusInterval = setInterval(() => sendStatusUpdate("ledig", currentLongitude, currentLatitude, batteryLevel), 5000);

            // Återställ flagga för laddning
            chargingStarted = false;
            simulateRedLight(chargingStarted);

            return; // Avsluta laddningsintervallet
        }

        // Ladda batteriet (addera till batterinivån)
        batteryLevel += (100 / (chargingDuration / 5000)); // Addera batteri proportionellt över en timme

        sendStatusUpdate("underhåll", currentLongitude, currentLatitude, batteryLevel);

        
        // Skriv ut aktuell batterinivå
        console.log(`Bike ${bikeId} charging... Current level: ${batteryLevel.toFixed(2)}%`);
    }, 5000); // Uppdatera varje 5:e sekund
}

const bikeData = {
    current_location_id: 1,
    battery_level: batteryLevel,
    last_service_date: "2024-12-01",
    current_longitude: currentLongitude,
    current_latitude: currentLatitude,
    bike_serial_number: bikeSerialNumber,
    api_key: "key123"
};
// Sends a status update to the server
function sendStatusUpdate(status, currentLongitude, currentLatitude,batteryLevel ,speed = 0) {
    const maxSpeed = 30; // Top speed 30
    const realSpeed = speed// Funktion to get speed from sensor
    const locationId = 1 // Funktion to get location ID
    const longitude = currentLongitude; 
    const latitude = currentLatitude;
    const battery = batteryLevel;
    // Exampel bike ID

    // Check if the speed exceeds the limit
    if (realSpeed > maxSpeed) {
        console.warn(`Speed ${realSpeed} exceeds the limit ${maxSpeed}`);
        return; // Skip the rest of the function
    }

    const data = {
        bikeSerialNumber,
        locationId,
        status: status,
        speed: realSpeed,
        longitude: longitude,
        latitude: latitude,
        batteryLevel: battery

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

socket.on("connect", async () => {
    console.log("Connected to server");
    await cyklesModules.addBikeToDatabase(bikeData);
    socket.emit("registerScooter", bikeData.bike_serial_number);
    sendStatusUpdate("ledig", currentLongitude, currentLatitude, batteryLevel);
    // Starta batterisimuleringen
    simulateBatteryConsumption();
    statusInterval = setInterval(() => sendStatusUpdate("ledig", currentLongitude, currentLatitude, batteryLevel), 5000);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
    clearInterval(statusInterval); // Ends the status update interval
});


// Lyssna på disableBike-kommandon från servern
socket.on("disableBike", () => {
    disableBike(); // Kör disable-funktionen
});

// Lyssna på enableBike-kommandon från servern
socket.on("enableBike", () => {
    enableBike(); // Kör enable-funktionen
});

// Ta emot startRide-begäran från servern
socket.on('startRide', (data) => {
    if (isDisabled) {
        console.warn("Ride cannot be started. Bike is disabled.");
        return; // Förhindra start av resa
    }

    const userId = data.userId;
    console.log(`Starta resa för användare ${userId}`);

    // Logga startplats och tid
    const startTime = new Date().toISOString();
    const newTravel = {
        userId,
        start: {
            latitude: currentLatitude,
            longitude: currentLongitude,
            time: startTime
        },
        end: null, // Fylls i vid `stopRide`
        status: "in-progress" // Status för att spåra aktiv resa
    };

    // Lägg till den nya resan i reseloggen
    travelLogs.push(newTravel);

    // Avbryt tidigare statusintervall
    if (statusInterval) clearInterval(statusInterval);
    sendStatusUpdate("upptagen", currentLongitude, currentLatitude, batteryLevel);
    // Starta rörelsesimulering
    statusInterval = setInterval(() => {
        const movement = moveCycle.getRandomMovement();
        currentLatitude += movement.lat;
        currentLongitude += movement.lon;
        let speed = getSpeedFromSensor();
        // Skicka uppdaterad position med status 'upptagen'
        sendStatusUpdate("upptagen", currentLongitude, currentLatitude,batteryLevel, speed);
    }, 5000);
});


// Lyssna på stopRide från servern
socket.on("stopRide", () => {
    // Avbryt tidigare statusintervall
    console.log("Stopping ride");

    // Logga slutplats och tid
    const endTime = new Date().toISOString();
    const activeTravel = travelLogs.find(travel => travel.status === "in-progress");
    if (activeTravel) {
        activeTravel.end = {
            latitude: currentLatitude,
            longitude: currentLongitude,
            time: endTime
        };
        activeTravel.status = "completed"; // Uppdatera status
    }
    if (statusInterval) clearInterval(statusInterval);
    sendStatusUpdate("ledig", currentLongitude, currentLatitude, batteryLevel);
    // Starta nytt intervall
    statusInterval = setInterval(() => {
        sendStatusUpdate("ledig", currentLongitude, currentLatitude, batteryLevel);
    }, 5000);
});

// Lyssna på stopRide från servern
socket.on("startCharging", () => {
    startChargingCycle(bikeData.bike_serial_number);
});
