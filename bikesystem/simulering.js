const io = require("socket.io-client");
const cyklesModules = require("./controller/externalApi.js");
const usersModules = require("./controller/usersimulering.js");
const travelsModules = require("./controller/travelSimulering.js");
const { moveCykel, getRandomMovement } = require("./movment/bikemovement.js");

class Bike {
  constructor(serialNumber, initialLongitude, initialLatitude) {
    this.serialNumber = serialNumber;
    this.currentLongitude = initialLongitude;
    this.currentLatitude = initialLatitude;
    this.batteryLevel = 100;
    this.isDisabled = false;
    this.travelLogs = [];
  }

  updateLocation(movement) {
    this.currentLongitude += movement.lon;
    this.currentLatitude += movement.lat;
  }
}

class BikeGroupSimulator {
  constructor(groupId, bikeCount, initialLongitude, initialLatitude, number) {
    this.groupId = groupId;
    this.bikes = this.createBikes(
      bikeCount,
      initialLongitude,
      initialLatitude,
      number
    );
    this.socket = io("http://server:3000");
    this.simulatingMovement = false;
    this.statusInterval = null;
    this.isFirstStatusUpdate = true;
    this.initializeSocketEvents();
  }

  createBikes(bikeCount, initialLongitude, initialLatitude, number) {
    const bikes = [];

    for (let i = 0; i < bikeCount; i++) {
      bikes.push(
        new Bike(
          i + number,
          initialLongitude + (Math.random() - 0.5) * 0.05,
          initialLatitude + (Math.random() - 0.5) * 0.05
        )
      );
    }
    return bikes;
  }

  initializeSocketEvents() {
    this.socket.on("connect", () => {
      console.log(`Bike group ${this.groupId} connected to server`);

      this.bikes.forEach(async (bike) => {
        const bikeData = {
          current_location_id: 1,
          battery_level: bike.batteryLevel,
          last_service_date: "2024-12-01",
          current_longitude: bike.currentLongitude,
          current_latitude: bike.currentLatitude,
          bike_serial_number: bike.serialNumber,
          api_key: "key123",
        };
        await cyklesModules.addBikeToDatabase(bikeData, "server");
        this.socket.emit("registerScooter", bikeData.bike_serial_number);
      });

      this.startStatusUpdates("ledig");
    });

    this.socket.on("startRide", () => this.startRide());
    this.socket.on("stopRide", () => this.stopRide());
  }

  simulateGroupMovement() {
    if (!this.simulatingMovement) return;

    this.bikes.forEach((bike) => {
      const movement = getRandomMovement();
      bike.updateLocation(movement);
    });
  }

  startRide() {
    if (this.simulatingMovement) return;
    this.isFirstStatusUpdate = true;
    console.log(`Group ${this.groupId} started a ride`);
    this.simulatingMovement = true;

    this.stopStatusUpdates();
    this.startStatusUpdates("upptagen");
  }

  stopRide() {
    if (!this.simulatingMovement) return;

    console.log(`Group ${this.groupId} stopped the ride`);
    this.simulatingMovement = false;

    this.stopStatusUpdates();
    this.startStatusUpdates("ledig");
  }

  sendStatusUpdate(status, speed = 0, forceUpdate = false) {
    this.simulateGroupMovement();
    const isFirstUpdate = this.isFirstStatusUpdate || forceUpdate;
    const groupData = this.bikes.map((bike) => ({
      bikeSerialNumber: bike.serialNumber,
      longitude: bike.currentLongitude,
      latitude: bike.currentLatitude,
      batteryLevel: bike.batteryLevel,
      status,
      locationId: 1,
      speed,
      isFirstUpdate,
    }));

    this.socket.emit("updateStatus", {
      groupId: this.groupId,
      bikes: groupData,
    });
    if (this.isFirstStatusUpdate) {
      this.isFirstStatusUpdate = false; // Uppdatering skickad, sätt flaggan till false
    }
  }

  startStatusUpdates(status) {
    this.stopStatusUpdates();
    this.statusInterval = setInterval(() => {
      this.sendStatusUpdate(status);
    }, 10000);
  }

  stopStatusUpdates() {
    clearInterval(this.statusInterval);
  }
}

async function startSimulation(totalBikeCount, groupSize = 50) {
  const totalGroups = Math.ceil(totalBikeCount / groupSize);
  const bikeGroups = [];
  let number = 0;
  for (let groupId = 1; groupId <= totalGroups; groupId++) {
    let long, lat;

    if (number < 1000) {
      long = 18.0632;
      lat = 59.3345;
    } else if (number < 2000) {
      long = 11.9746;
      lat = 57.7089;
    } else {
      long = 13.0038;
      lat = 55.605;
    }
    const bikeGroup = new BikeGroupSimulator(
      groupId,
      groupSize,
      long,
      lat,
      number
    );
    bikeGroups.push(bikeGroup);
    number += 50;
    // Fördröjning mellan skapande av grupper för att undvika överbelastning
    await delay(3000);
  }

  console.log(
    `Started simulation with ${totalBikeCount} bikes in ${totalGroups} groups.`
  );
}

// Funktion för att lägga till en fördröjning
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Starta simuleringen
// startSimulation(300);
(async () => {
  try {
    console.log("Starting travel simulation...");
    await startSimulation(3000);
    await delay(10000);
    await usersModules.createUsersInBatches(3000); // 1000 användare i batchar om 100
    await delay(10000);
    await travelsModules.createTravelsInBatches(3000);
  } catch (error) {
    console.error("Error in travel simulation:", error);
  }
})();
