const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");
const checkAdmin = require("../middleware/check-admin.js"); // Middleware för att kontrollera administratörsbehörighet
const scooterModules = require("../src/scooter/modules.js"); // Moduler för databashantering relaterade till scooter
// Get all bikes from the database.
router.get("/", async (req, res) => {
    try {
        let bikes = await scooterModules.getBikes();
        return res.status(200).json({
            Message: "Success",
            bikes:bikes
        });
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Get details of a specific bike from the database.
router.get("/:bikeId", checkAuth, async (req, res) => {
    let bikeId = req.params.bikeId;
    try {
        let scooter = await scooterModules.getByBikeId(bikeId);
        if (scooter.length === 0) {
            return res.status(404).json({ message: "Scooter not found" });
        }
        return res.status(200).json(scooter[0]);
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Add a bike to the database.
router.post("/", checkAuth, checkAdmin, async (req, res) => {
    let { current_location_id , battery_level,last_service_date, current_longitude, current_latitude } = req.body;
    try {

        await scooterModules.addScooter(current_location_id , battery_level,last_service_date, current_longitude, current_latitude )

        return res.status(201).json({ message: "Scooter added"});
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Update a bike in the database.
router.put("/", checkAuth, checkAdmin,async (req, res) => {
    let scooterId = req.body.scooter_id;
    let { current_location_id, battery_level, status, last_service_date} = req.body;
    try {
        // Hämta scooter baserat på bikeId
        const existingScooters = await scooterModules.getByBikeId(scooterId);

      
        // Kontrollera om scooter existerar
        // Om ingen scooter hittas, returnera 401
        if (existingScooters.length === 0) {
            return res.status(404).json({
                message: "Scooter not found"
            });
        }

        await scooterModules.updateScooter(current_location_id, battery_level, status, last_service_date, scooterId)

        return res.status(200).json({ message: "Scooter updated" });
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Remove a bike from the database.
router.delete("/:bikeId", checkAuth, checkAdmin,async (req, res) => {
    let scooterId = req.params.bikeId;
    try {
        

        // Hämta scooter baserat på bikeId
        const existingScooters = await scooterModules.getByBikeId(scooterId);

      
        // Kontrollera om scooter existerar
        // Om ingen scooter hittas, returnera 401
        if (existingScooters.length === 0) {
            return res.status(404).json({
                message: "Scooter not found"
            });
        }

        // Radera användaren
        await scooterModules.deleteScooter(scooterId);

        return res.status(200).json({ message: "Scooter deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Update a bike status in the database.
router.put("/status/:bikeId", async (req, res) => {
    let bikeId = req.params.bikeId;
    let { status} = req.body;
    try {
        // Hämta scooter baserat på bikeId
        const existingScooters = await scooterModules.getByBikeId(bikeId);

      
        // Kontrollera om scooter existerar
        // Om ingen scooter hittas, returnera 401
        if (existingScooters.length === 0) {
            return res.status(404).json({
                message: "Scooter not found"
            });
        }

        await scooterModules.updateStatus(status, bikeId)

        return res.status(200).json({ message: "Scooter updated" });
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

module.exports = router;