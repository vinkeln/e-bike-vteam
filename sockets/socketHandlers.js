const { Server } = require("socket.io");
const bikeController = require("../src/controller/bikeController.js");
const { notifyAdmins, notifyCustomer } = require("../src/notify/notify");

function initializeSocketHandlers(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // Dictionary för att spåra anslutna scooters
  const connectedScooters = {};

  io.on("connection", (socket) => {
    console.log("A bike connected:", socket.id);

    // När en cykel registrerar sig
    socket.on("registerScooter", async (bikeId) => {
      connectedScooters[bikeId] = socket.id; // Kartlägg cykel-ID till socket-ID
      console.log(`Scooter ${bikeId} registered with socket ${socket.id}`);
    });

    // Ta emot en begäran från frontend (kund)
    socket.on("startCharging", async (data) => {
      const { scooterId, userId } = data;
      console.log(`Kund ${userId} vill ladda cykel ${scooterId}`);
      const scooter = await bikeController.getBusyBike(scooterId);

      // Kontrollera om cykeln är ansluten
      if (connectedScooters[scooterId] && scooter) {
        const scooterSocketId = connectedScooters[scooterId];

        // Skicka ett meddelande till cykeln att starta en resa
        io.to(scooterSocketId).emit("startCharging", { userId });
        console.log(`Meddelande skickat till cykel ${scooterId}`);

        // Skicka tillgänglighetssvar till frontend
        socket.emit("rideResponse", { available: true });
      } else {
        console.log(`Cykel ${scooterId} är inte ansluten`);
        socket.emit("rideResponse", { available: false });
      }
    });

    // Ta emot en begäran från frontend (kund)
    socket.on("requestRide", async (data) => {
      const { scooterId, userId } = data;
      console.log(`Kund ${userId} vill starta resa med cykel ${scooterId}`);
      const scooter = await bikeController.getBike(scooterId);

      // Kontrollera om cykeln är ansluten
      if (connectedScooters[scooterId] && scooter) {
        const scooterSocketId = connectedScooters[scooterId];

        // Skicka ett meddelande till cykeln att starta en resa
        io.to(scooterSocketId).emit("startRide", { userId });
        console.log(`Meddelande skickat till cykel ${scooterId}`);

        // Skicka tillgänglighetssvar till frontend
        socket.emit("rideResponse", { available: true });
      } else {
        console.log(`Cykel ${scooterId} är inte ansluten`);
        socket.emit("rideResponse", { available: false });
      }
    });

    // Stop a bike
    socket.on("stopRide", async (data) => {
      const { scooterId, userId } = data;
      console.log(`Kund ${userId} vill avsluta resa med cykel ${scooterId}`);
      const scooter = await bikeController.getBusyBike(scooterId);
      // Kontrollera om cykeln är ansluten
      if (connectedScooters[scooterId] && scooter) {
        const scooterSocketId = connectedScooters[scooterId];

        // Skicka ett meddelande till cykeln att starta en resa
        io.to(scooterSocketId).emit("stopRide", { userId });
        console.log(`Meddelande skickat till cykel ${scooterId}`);

        // Skicka tillgänglighetssvar till frontend
        socket.emit("rideResponse", { available: true });
      } else {
        console.log(`Cykel ${scooterId} är inte ansluten`);
        socket.emit("rideResponse", { available: false });
      }
    });

    // Update bike status
    socket.on("updateStatus", async (data) => {
      const {
        bikeSerialNumber,
        locationId,
        status,
        speed,
        longitude,
        latitude,
        batteryLevel,
      } = data;
      try {
        const result = await bikeController.updateStatus(
          bikeSerialNumber,
          locationId,
          status,
          speed,
          longitude,
          latitude,
          batteryLevel
        );
        if (result.affectedRows === 0) {
          socket.emit("updateError", { message: "Bike not found" });
        } else {
          socket.emit("updateSuccess", { message: "Bike status updated" });
        }
      } catch (error) {
        console.error("Error updating bike status:", error.message);
        socket.emit("updateError", { message: "Error updating bike status" });
      }
    });

    // Update battery level
    socket.on("updateBatteryLevel", async (data) => {
      const { bikeId, batteryLevel } = data;
      try {
        const result = await bikeController.updateBatteryLevel(
          bikeId,
          batteryLevel
        );
        if (result.affectedRows === 0) {
          socket.emit("updateError", { message: "Bike not found" });
        } else {
          socket.emit("updateBatterySuccess", {
            message: "Battery level updated",
          });
          bikeController.checkBatteryLevel(bikeId, batteryLevel, io);
        }
      } catch (error) {
        console.error("Error updating battery level:", error.message);
        socket.emit("updateBatteryError", {
          message: "Error updating battery level",
        });
      }
    });

    // Lyssna på disableBike-kommandon från servern
    socket.on("disableBike", async () => {
      const { scooterId, userId } = data;
      console.log(`Admin ${userId} vill stoppa cykel ${scooterId}`);
      const scooter = await bikeController.getBusyBike(scooterId);
      // Kontrollera om cykeln är ansluten
      if (connectedScooters[scooterId] && scooter) {
        const scooterSocketId = connectedScooters[scooterId];

        // Skicka ett meddelande till cykeln att starta en resa
        io.to(scooterSocketId).emit("disableBike");
        console.log(`Meddelande skickat till cykel ${scooterId}`);
      } else {
        console.log(`Cykel ${scooterId} är inte ansluten`);
      }
    });

    // Lyssna på enableBike-kommandon från servern
    socket.on("enableBike", async () => {
      const { scooterId, userId } = data;
      console.log(`Admin ${userId} vill starta cykel ${scooterId}`);
      const scooter = await bikeController.getBusyBike(scooterId);
      // Kontrollera om cykeln är ansluten
      if (connectedScooters[scooterId] && scooter) {
        const scooterSocketId = connectedScooters[scooterId];

        // Skicka ett meddelande till cykeln att starta en resa
        io.to(scooterSocketId).emit("enableBike");
        console.log(`Meddelande skickat till cykel ${scooterId}`);
      } else {
        console.log(`Cykel ${scooterId} är inte ansluten`);
      }
    });

    // Get bikes needing maintenance
    socket.on("getBikesForMaintenance", async () => {
      try {
        const bikes = await bikeController.getBikesForMaintenance();
        socket.emit("maintenanceBikes", bikes);
      } catch (error) {
        console.error("Error fetching bikes for maintenance:", error.message);
        socket.emit("maintenanceError", {
          message: "Error fetching bikes for maintenance",
        });
      }
    });

    // Mark a bike for maintenance
    socket.on("markBikeForMaintenance", async (bikeId) => {
      try {
        const result = await bikeController.markBikeForMaintenance(bikeId);
        if (result.affectedRows === 0) {
          socket.emit("maintenanceError", { message: "Bike not found" });
        } else {
          socket.emit("maintenanceSuccess", {
            message: "Bike marked for maintenance.",
          });
          io.emit("maintenanceNotification", {
            bikeId,
            message: `Bike ${bikeId} is marked for maintenance.`,
          });
        }
      } catch (error) {
        console.error("Error marking bike for maintenance:", error.message);
        socket.emit("maintenanceError", {
          message: "Error marking bike for maintenance",
        });
      }
    });

    // Lyssna på batterivarningar från cyklar
    socket.on("batteryWarning", (data) => {
      console.log(`Varning mottagen: ${data.message}`);
      // Skicka meddelande till administratörer eller system
      notifyAdmins(data.bikeSerialNumber, data.batteryLevel);
      notifyCustomer(data.bikeSerialNumber, data.batteryLevel);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A bike disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocketHandlers;
