const { Server } = require("socket.io");
const bikeController = require('./controller/bikeController');

function initializeSocketHandlers(server) {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("A bike connected:", socket.id);

        // Start move simulation
        socket.on("startMoveSimulation", (data) => {
            const { lat, lon } = data;
            if (simulationInterval) clearInterval(simulationInterval); // Stops earlier simulations
            simulationInterval = moveCykel(lat, lon);
            socket.emit("simulationStarted", { message: "Move simulation started with: " + lat + ", " + lon });
        });
        
        socket.on("stopMoveSimulation", () => {
            if (simulationInterval) {
                clearInterval(simulationInterval);
                simulationInterval = null;
                socket.emit("simulationStopped", { message: "Move simulation stopped" });
            }
        });

        // Update bike status
        socket.on("updateStatus", async (data) => {
            const { bikeId, locationId, status, speed } = data;
            try {
                const result = await bikeController.updateStatus(bikeId, locationId, status, speed);
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

        // Start a bike
        socket.on("startBike", async (bikeId) => {
            try {
                const underMaintenance = await bikeController.isBikeUnderMaintenance(bikeId);
                if (underMaintenance) {
                    socket.emit("startError", { message: "Bike is under maintenance and cannot be rented." });
                    return;
                }
                const result = await bikeController.startBike(bikeId);
                if (result.affectedRows === 0) {
                    socket.emit("startError", { message: "Bike not found" });
                } else {
                    socket.emit("startSuccess", { message: "Bike started" });
                }
            } catch (error) {
                console.error("Error starting bike:", error.message);
                socket.emit("startError", { message: "Error starting bike" });
            }
        });

        // Stop a bike
        socket.on("stopBike", async (bikeId) => {
            try {
                const result = await bikeController.stopBike(bikeId);
                if (result.affectedRows === 0) {
                    socket.emit("stopError", { message: "Bike not found" });
                } else {
                    socket.emit("stopSuccess", { message: "Bike stopped" });
                }
            } catch (error) {
                console.error("Error stopping bike:", error.message);
                socket.emit("stopError", { message: "Error stopping bike" });
            }
        });

        // Update battery level
        socket.on("updateBatteryLevel", async (data) => {
            const { bikeId, batteryLevel } = data;
            try {
                const result = await bikeController.updateBatteryLevel(bikeId, batteryLevel);
                if (result.affectedRows === 0) {
                    socket.emit("updateError", { message: "Bike not found" });
                } else {
                    socket.emit("updateBatterySuccess", { message: "Battery level updated" });
                    bikeController.checkBatteryLevel(bikeId, batteryLevel, io);
                }
            } catch (error) {
                console.error("Error updating battery level:", error.message);
                socket.emit("updateBatteryError", { message: "Error updating battery level" });
            }
        });

        // Get bikes needing maintenance
        socket.on("getBikesForMaintenance", async () => {
            try {
                const bikes = await bikeController.getBikesForMaintenance();
                socket.emit("maintenanceBikes", bikes);
            } catch (error) {
                console.error("Error fetching bikes for maintenance:", error.message);
                socket.emit("maintenanceError", { message: "Error fetching bikes for maintenance" });
            }
        });

        // Mark a bike for maintenance
        socket.on("markBikeForMaintenance", async (bikeId) => {
            try {
                const result = await bikeController.markBikeForMaintenance(bikeId);
                if (result.affectedRows === 0) {
                    socket.emit("maintenanceError", { message: "Bike not found" });
                } else {
                    socket.emit("maintenanceSuccess", { message: "Bike marked for maintenance." });
                    io.emit("maintenanceNotification", {
                        bikeId,
                        message: `Bike ${bikeId} is marked for maintenance.`,
                    });
                }
            } catch (error) {
                console.error("Error marking bike for maintenance:", error.message);
                socket.emit("maintenanceError", { message: "Error marking bike for maintenance" });
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("A bike disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = initializeSocketHandlers;
