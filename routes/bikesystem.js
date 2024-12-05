const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");
const bikeProgramModule = require("../src/bikesystem/modules.js");

// Route to get bike status and location.
router.get("/:bikeId/status", checkAuth, async(req, res)=> {
    const bikeId = req.params.bikeId;

    try {
        const bikeStatus = await bikeProgramModule.getBikeStatus(bikeId);
        if (bikeStatus.length === 0) {
            return res.status(404).json({ message: "Bike not found" });
        }
        res.status(200).json(bikeStatus[0]);
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Route to update bike status and location.
router.put("/:bikeId/status", checkAuth, async(req, res)=> {
    const {bikeId} = req.params;
    const {locationId, status} = req.body; // Get locationId and status from the body.

    if (!locationId || !status) {
        return res.status(400).json({ error: "All inputs are needed!" });
    }

    try {
        const result = await bikeProgramModule.updateBikeStatus(bikeId, locationId, status);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bike not found" });
        }
        res.status(200).json({ message: "Bike status updated" });
    } catch (error) {
        res.status(500).json({ error: "Error with updating bike status", details: error.message });
    }
});

// Route to start a bike.
router.post("/:bikeId/start", checkAuth, async(req, res) => {
    const {bikeId} = req.params;

    try {
        const result = await bikeProgramModule.startBike(bikeId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bike not found" });
        }
        res.status(200).json({ message: "Bike started" });
    } catch (error) {
        res.status(500).json({ error: "Error with starting bike", details: error.message });
    }
});

// Route to stop a bike.
router.post("/:bikeId/stop", checkAuth, async(req, res) => {
    const {bikeId} = req.params;

    try {
        const result = await bikeProgramModule.stopBike(bikeId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bike not found" });
        }
        res.status(200).json({ message: "Bike stopped" });
    } catch (error) {
        res.status(500).json({ error: "Error with stopping bike", details: error.message });
    }
});

// Route to get battery level and warnings.


// Route to update battery level.


// Route to get bikes that needs maintenance.


// Route to mark bikes that has current maintenance.


module.exports = router;