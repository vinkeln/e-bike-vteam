const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");
const parkingsModules = require("../src/parkings/modules.js");


router.get("/", async (req, res) => {
    try {
        const parkingsZones = await parkingsModules.getParkings();
        res.status(200).json({
            
            parkings_zones: parkingsZones[0]
        });
    } catch (error) {
        
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
    }
});



router.post("/add", checkAuth , async (req, res) => {
    try {
        const {latitude, longitude, capacity} = req.body;
        const maxSpeed = req.body.max_speed;

        const existingparks = await parkingsModules.checkParkings(latitude, longitude);
        if (existingparks.length > 0) {
            return res.status(409).json({ message: "parkingzone exists" });
        }


        const result = await parkingsModules.addPark(latitude, longitude, maxSpeed, capacity);
        res.status(200).json({
            message: "parkingzone has been addeddc",
            location_id: result,
        });
    } catch (error) {
        
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
    }
});


router.delete("/:locationId", checkAuth , async (req, res) => {
    const  locationId  = req.params.locationId;  

    

    try {
        

        // Först, kolla om användaren finns genom att hämta användaren med user_id
        const existingPark = await parkingsModules.getParkingLocation(locationId);

        if (!existingPark || existingPark.length === 0) {
            return res.status(404).json({ message: "parkingzone not found" });
        }

        // Om användaren finns, radera användaren baserat på user_id
        parkingsModules.deletePark(locationId);

        res.status(200).json({ message: "Parking has been deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/update", checkAuth , async (req, res) => {
    const  locationId  = req.body.location_id;  
    const {latitude, longitude, capacity} = req.body;
    const maxSpeed = req.body.max_speed;
    

    try {
        

        // Först, kolla om användaren finns genom att hämta användaren med user_id
        const existingPark = await parkingsModules.getParkingLocation(locationId);

        if (!existingPark || existingPark.length === 0) {
            return res.status(404).json({ message: "parkingzone not found" });
        }

        // Om användaren finns, radera användaren baserat på user_id
        parkingsModules.updatePark(locationId,latitude, longitude, capacity,maxSpeed);

        res.status(200).json({ message: "Parking has been updated successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router;
