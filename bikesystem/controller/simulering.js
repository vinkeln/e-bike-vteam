const io = require("socket.io-client");
const cyklesModules = require("./externalApi.js");
const moveCycle = require("../movment/bikemovement.js");

class BikeSimulator {
  constructor(bikeSerialNumber, initialLongitude, initialLatitude) {
    this.bikeSerialNumber = bikeSerialNumber;
    this.currentLongitude = initialLongitude;
    this.currentLatitude = initialLatitude;
    this.batteryLevel = 100;
    this.isDisabled = false;
    this.travelLogs = [];
    this.chargingStarted = false;
    this.chargingDuration = 60 * 60 * 1000;
    this.socket = io("http://localhost:3000");
    this.statusInterval = null;
    this.chargingInterval = null;
    this.consumptionInterval = null;
    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.socket.on("connect", async () => {
      console.log(`Bike ${this.bikeSerialNumber} connected to server`);
      const bikeData = {
        current_location_id: 1,
        battery_level: this.batteryLevel,
        last_service_date: "2024-12-01",
        current_longitude: this.currentLongitude,
        current_latitude: this.currentLatitude,
        bike_serial_number: this.bikeSerialNumber,
        api_key: "key123",
      };
      await cyklesModules.addBikeToDatabase(bikeData);
      this.socket.emit("registerScooter", bikeData.bike_serial_number);
      this.sendStatusUpdate("ledig");
      this.simulateBatteryConsumption();
      this.startStatusUpdates("ledig");
    });

    this.socket.on("disconnect", () => {
      console.log(`Bike ${this.bikeSerialNumber} disconnected from server`);
      this.clearIntervals();
    });

    this.socket.on("disableBike", () => this.disableBike());
    this.socket.on("enableBike", () => this.enableBike());
    this.socket.on("startRide", (data) => this.startRide(data));
    this.socket.on("stopRide", () => this.stopRide());
    this.socket.on("startCharging", () => this.startChargingCycle());
  }

  simulateRedLight(isOn) {
    console.log(
      `Red light for bike ${this.bikeSerialNumber}: ${isOn ? "ON" : "OFF"}`
    );
  }

  disableBike() {
    if (this.isDisabled) {
      console.log(`Bike ${this.bikeSerialNumber} is already disabled.`);
      return;
    }
    this.isDisabled = true;
    console.log(`Bike ${this.bikeSerialNumber} has been disabled.`);
    this.stopBatteryConsumption();
    this.startStatusUpdates("avstängd");
  }

  enableBike() {
    if (!this.isDisabled) {
      console.log(`Bike ${this.bikeSerialNumber} is already enabled.`);
      return;
    }
    this.isDisabled = false;
    console.log(`Bike ${this.bikeSerialNumber} has been enabled.`);
    this.stopBatteryConsumption();
    this.sendStatusUpdate("ledig");
    this.simulateBatteryConsumption();
    this.startStatusUpdates("ledig");
  }

  simulateBatteryConsumption() {
    const reductionPerSecond = 5 / 3600;
    this.consumptionInterval = setInterval(() => {
      this.batteryLevel -= reductionPerSecond * 5;
      this.batteryLevel = Math.max(0, this.batteryLevel);
      if (this.batteryLevel < 20) {
        this.socket.emit("batteryWarning", {
          bikeSerialNumber: this.bikeSerialNumber,
          batteryLevel: this.batteryLevel,
          message: `Battery level is low (${this.batteryLevel.toFixed(
            2
          )}%) for bike ${this.bikeSerialNumber}.`,
        });
      }
      if (this.batteryLevel <= 0) {
        this.stopBatteryConsumption();
      }
    }, 5000);
  }

  stopBatteryConsumption() {
    clearInterval(this.consumptionInterval);
  }

  startChargingCycle() {
    if (this.chargingStarted) return;
    this.chargingStarted = true;
    this.simulateRedLight(true);
    this.stopBatteryConsumption();
    this.chargingInterval = setInterval(() => {
      if (this.batteryLevel >= 100) {
        clearInterval(this.chargingInterval);
        this.batteryLevel = 100;
        this.chargingStarted = false;
        this.simulateRedLight(false);
        this.sendStatusUpdate("ledig");
        this.simulateBatteryConsumption();
        this.startStatusUpdates("ledig");
        return;
      }
      this.batteryLevel += 100 / (this.chargingDuration / 5000);
      this.sendStatusUpdate("underhåll");
    }, 5000);
  }

  sendStatusUpdate(status, speed = 0) {
    const data = {
      bikeSerialNumber: this.bikeSerialNumber,
      locationId: 1,
      status,
      speed,
      longitude: this.currentLongitude,
      latitude: this.currentLatitude,
      batteryLevel: this.batteryLevel,
    };
    console.log(data.bikeSerialNumber);
    this.socket.emit("updateStatus", data);
  }

  startStatusUpdates(status) {
    this.stopStatusUpdates();
    this.statusInterval = setInterval(() => {
      this.sendStatusUpdate(status);
    }, 5000);
  }

  stopStatusUpdates() {
    clearInterval(this.statusInterval);
  }

  startRide(data) {
    if (this.isDisabled) return;
    const userId = data.userId;
    const startTime = new Date().toISOString();
    this.travelLogs.push({
      userId,
      start: {
        latitude: this.currentLatitude,
        longitude: this.currentLongitude,
        time: startTime,
      },
      end: null,
      status: "in-progress",
    });
    this.stopStatusUpdates();
    this.startStatusUpdates("upptagen");
  }

  stopRide() {
    const endTime = new Date().toISOString();
    const activeTravel = this.travelLogs.find(
      (travel) => travel.status === "in-progress"
    );
    if (activeTravel) {
      activeTravel.end = {
        latitude: this.currentLatitude,
        longitude: this.currentLongitude,
        time: endTime,
      };
      activeTravel.status = "completed";
    }
    this.stopStatusUpdates();
    this.startStatusUpdates("ledig");
  }

  clearIntervals() {
    this.stopBatteryConsumption();
    this.stopStatusUpdates();
    clearInterval(this.chargingInterval);
  }
}

// Create 1000 bike instances
function startSimulation(bikeCount) {
  const bikes = [];
  for (let i = 0; i < bikeCount; i++) {
    bikes.push(
      new BikeSimulator(
        i,
        18.0632 + Math.random() * 0.01,
        59.3345 + Math.random() * 0.01
      )
    );
  }
  console.log(bikes);
}

startSimulation(10);
