const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js"); // Middleware för att verifiera om användaren är inloggad
const parkingsModules = require("../src/parkings/modules.js"); // Import av moduler som hanterar parkeringar i databasen

// Endpoint för att hämta alla parkeringszoner
router.get("/", async (req, res) => {
    try {
        // Hämtar alla parkeringszoner från databasen via modulen
        const parkingsZones = await parkingsModules.getParkings();
        // Returnerar resultatet som JSON med statuskod 200
        res.status(200).json({
            
            parkings_zones: parkingsZones
        });
    } catch (error) {
            // Vid fel skickas statuskod 500 och ett felmeddelande
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
    }
});


// Endpoint för att lägga till en ny parkeringszon
router.post("/add", checkAuth , async (req, res) => {
    try {
        // Extraherar data från request-body
        const {latitude, longitude, capacity} = req.body;
        const maxSpeed = req.body.max_speed;
        // Kontrollerar om det redan finns en parkeringszon på den platsen
        const existingparks = await parkingsModules.checkParkings(latitude, longitude);
        if (existingparks.length > 0) {
            return res.status(409).json({ message: "parkingzone exists" }); // Konflikt om platsen redan finns
        }

        // Lägger till den nya parkeringszonen i databasen
        const result = await parkingsModules.addPark(latitude, longitude, maxSpeed, capacity);
        res.status(200).json({
            message: "parkingzone has been addeddc",
            location_id: result,
        });
    } catch (error) {
            // Vid fel skickas statuskod 500 och ett felmeddelande
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
    }
});

// Endpoint för att ta bort en parkeringszon baserat på dess ID
router.delete("/:locationId", checkAuth , async (req, res) => {
    const  locationId  = req.params.locationId; // Hämtar locationId från URL-parametern

    

    try {
        

        // Kontrollera om parkeringszonen finns
        const existingPark = await parkingsModules.getParkingLocation(locationId);

        if (!existingPark || existingPark.length === 0) {
            return res.status(404).json({ message: "parkingzone not found" });
        }

        // Tar bort parkeringszonen från databasen
        await parkingsModules.deletePark(locationId);

        res.status(200).json({ message: "Parking has been deleted successfully" });
    } catch (error) {
        // Vid fel skickas statuskod 500 och ett felmeddelande
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Endpoint för att uppdatera en befintlig parkeringszon
router.put("/update", checkAuth , async (req, res) => {
    const  locationId  = req.body.location_id; // Hämtar locationId från request-body
    const {latitude, longitude, capacity} = req.body; // Extraherar uppdaterad data
    const maxSpeed = req.body.max_speed;
    

    try {
        

        // Kontrollera om parkeringszonen finns
        const existingPark = await parkingsModules.getParkingLocation(locationId);

        if (!existingPark || existingPark.length === 0) {
            return res.status(404).json({ message: "parkingzone not found" });  // Returnera 404 om inte hittad
        }

        // Uppdatera parkeringszonen med ny data
        await parkingsModules.updatePark(locationId,latitude, longitude, capacity,maxSpeed);

        res.status(200).json({ message: "Parking has been updated successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router;
