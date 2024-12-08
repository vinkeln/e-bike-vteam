const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const {
    updateStatus,
    updateBatteryLevel,
    getBikesForMaintenance,
    markBikeForMaintenance,
    startBike,
    stopBike,
} = require("../src/bikesystem/modules.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Accept all origins
    },
});

// Websocket server
io.on("connection", (socket) => {
    console.log("A bike connected:", socket.id);

    // Uppdatera status för en cykel
    socket.on("updateStatus", async (data) => {
        const { bikeId, locationId, status, speed } = data;
        try {
            const result = await updateStatus(bikeId, locationId, status, speed);
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

    // Listen for request to start a bike
    socket.on("startBike", async (bikeId) => {
        try {
            const result = await startBike(bikeId);
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


    // Listen for request to stop a bike
    socket.on("stopBike", async (bikeId) => {
        try {
            const result = await stopBike(bikeId);
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


    // Socket to update battery level.
    socket.on("updateBatteryLevel", async (data) => {
        const { bikeId, batteryLevel } = data;
        try {
            const result = await updateBatteryLevel(bikeId, batteryLevel);
            if (result.affectedRows === 0) {
                socket.emit("updateError", { message: "Bike not found" });
            } else {
                socket.emit("updateBatterySuccess", { message: "Battery level updated" });
            }
        } catch (error) {
            console.error("Error updating battery level:", error.message);
            socket.emit("updateBatteryError", { message: "Error updating battery level" });
        }
    });

    // Socket to get bikes that needs maintenance.
    socket.on("getBikesForMaintenance", async () => {
        try {
            const bikes = await getBikesForMaintenance();
            socket.emit("maintenanceBikes", bikes);
        } catch (error) {
            console.error("Error fetching bikes for maintenance:", error.message);
            socket.emit("maintenanceError", { message: "Error fetching bikes for maintenance" });
        }
    });

    // Socket to mark bikes that has current maintenance.
    socket.on("markBikeForMaintenance", async (bikeId) => {
        try {
            const result = await markBikeForMaintenance(bikeId);
            if (result.affectedRows === 0) {
                socket.emit("maintenanceError", { message: "Bike not found" });
            } else {
                socket.emit("maintenanceSuccess", { message: "Bike marked for maintenance" });
            }
        } catch (error) {
            console.error("Error marking bike for maintenance:", error.message);
            socket.emit("maintenanceError", { message: "Error marking bike for maintenance" });
        }
    });

    // Listen for request to get battery level and warnings
    socket.on("disconnect", () => {
        console.log("A bike disconnected:", socket.id);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export app
module.exports = { app };
