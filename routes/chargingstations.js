const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js"); // Middleware för att verifiera om användaren är inloggad
const chargingStationsModules = require("../src/chargingstations/modules.js"); // Import av moduler som hanterar charging i databasen
const citiesModules = require("../src/cities/modules.js"); // Import av moduler som hanterar cities i databasen
const checkAdmin = require("../middleware/check-admin.js"); // Middleware för att kontrollera administratörsbehörighet

// Endpoint för att hämta alla laddningsstationer
router.get("/", async (req, res) => {
    try {
        // Hämtar alla laddningsstationer från databasen via modulen
        const chargingStations = await chargingStationsModules.getchargingStations();
        // Returnerar resultatet som JSON med statuskod 200
        res.status(200).json({
            status: "success",
            chargingStations: chargingStations
        });
    } catch (error) {
            // Vid fel skickas statuskod 500 och ett felmeddelande
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
    }
});


// Endpoint för att hämta alla laddstationer för en viss stad.
router.get("/:cityId", async (req, res) => {

    const cityId = req.params.cityId;
    try {


        // Kontrollerar om den stad finns
        const existingpcities = await citiesModules.checkCitiesById(cityId);
        if (!existingpcities || existingpcities.length === 0) {
            return res.status(409).json({ message: "city has no charging stations" }); // Konflikt om staden redan finns
        }

        // Hämtar alla laddningsstationer från databasen via modulen
        const chargingStations = await chargingStationsModules.getchargingStationsBycity(cityId);
        // Returnerar resultatet som JSON med statuskod 200
        res.status(200).json({
            status: "success",
            chargingStations: chargingStations
        });
    } catch (error) {
            // Vid fel skickas statuskod 500 och ett felmeddelande
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
    }
});



// Endpoint för att lägga till en ny laddingsstation
router.post("/add", checkAuth, checkAdmin, async (req, res) => {
    try {
        // Extraherar data från request-body
        const {latitude, longitude} = req.body;
        const totalPorts = req.body.total_ports;
        const cityId = req.body.city_id;
        // Kontrollerar om det redan finns en laddningsstation på den platsen
        const existingChargingStations = await chargingStationsModules.checkChargingStation(latitude, longitude);
        if (existingChargingStations.length > 0) {
            return res.status(409).json({ message: "Chargingstation exists" }); // Konflikt om platsen redan finns
        }


        // Lägger till den nya laddningsstation i databasen
        const result = await chargingStationsModules.addChargingStation(latitude, longitude, cityId ,totalPorts);

        if (result.error) {
            // Vid fel skickas statuskod 500 och ett felmeddelande
            return res.status(500).json({
                message: "Server error",
                error: result.error,
            });
        }

        res.status(200).json({
            status: "success",
            message: "chargingstation has been added",
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


// Endpoint för att ta bort en laddstaion baserat på dess ID
router.delete("/:locationId", checkAuth , checkAdmin, async (req, res) => {
    const  locationId  = req.params.locationId; // Hämtar locationId från URL-parametern



    try {


        // Kontrollera om laddstaion finns
        const existingChargingStations = await chargingStationsModules.getChargingStationLocation(locationId);

        if (!existingChargingStations || existingChargingStations.length === 0) {
            return res.status(404).json({ message: "Charging station not found" });
        }

        // Tar bort laddstaion från databasen
        await chargingStationsModules.deleteChargingStation(locationId);

        res.status(200).json({ message: "Charging station deleted successfully" });
    } catch (error) {
        // Vid fel skickas statuskod 500 och ett felmeddelande
        console.error("Error deleting charging station:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// Endpoint för att uppdatera en befintlig laddstation
router.put("/update", checkAuth , checkAdmin, async (req, res) => {
    const  locationId  = req.body.location_id; // Hämtar locationId från request-body
    const {latitude, longitude} = req.body; // Extraherar uppdaterad data
    const totalPorts = req.body.total_ports;


    try {


        // Kontrollera om laddstation finns
        const existingChargingStations = await chargingStationsModules.getChargingStationLocation(locationId);

        if (!existingChargingStations || existingChargingStations.length === 0) {
            return res.status(404).json({ message: "Charging station not found" });  // Returnera 404 om inte hittad
        }

        // Uppdatera laddstation med ny data
        await chargingStationsModules.updateChargingStation(locationId,latitude, longitude, totalPorts);

        res.status(200).json({ message: "Charging station updated successfully" });
    } catch (error) {
        console.error("Error updating charging station:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Endpoint för att addera nya port till laddstation
router.put("/update/port", checkAuth , checkAdmin, async (req, res) => {
    const  locationId  = req.body.location_id; // Hämtar locationId från request-body
    const newPorts = req.body.new_ports;


    try {


        // Kontrollera om laddstation finns
        const existingChargingStations = await chargingStationsModules.getChargingStationLocation(locationId);

        if (!existingChargingStations || existingChargingStations.length === 0) {
            return res.status(404).json({ message: "Charging station not found" });  // Returnera 404 om inte hittad
        }

        // Addera nya port till en laddstation
        await chargingStationsModules.addport(locationId, newPorts);

        res.status(200).json({ message: "Charging station port updated successfully" });
    } catch (error) {
        console.error("Error updating charging station port:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;