// Created by Jacob
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");
const mysql = require("mysql2/promise");
const config = require("../config/db/elsparkcykel.json");

// Get a list over all the travels in the system.
router.get("/", checkAuth, async (req, res) => { // Requires authentication = checkAuth
    try { // Get all travels data.
        let db = await mysql.createConnection(config);
        const [travels] = await db.query("SELECT * FROM ride");
        await db.end();
        res.status(200).json(travels);
    } catch (error) { // When a error, get details about the error.
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Create a new trip when a customer hires a bike.
router.post("/", checkAuth, async (req, res) => {
    // Accepts user_id, scooter_id, start_location_id, start_time as body parameters.
    let  { user_id, scooter_id, start_location_id, start_time } = req.body;

    if (!user_id || !scooter_id || !start_location_id || !start_time) {
        return res.status(400).json({ error: "All inputs are needed!" });
    }

    try {
        let db = await mysql.createConnection(config);
        const [result] = await db.query(
            "INSERT INTO ride (user_id, scooter_id, start_location_id, start_time) VALUES (?, ?, ?, ?)",
            [user_id, scooter_id, start_location_id, start_time]
        );
        await db.end();

        res.status(201).json({ message: "New trip has been added", rideId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Server Error with new trip", details: error.message });
    }
});

// Update a specific travel.
router.put("/:rideId", checkAuth, async (req, res) => {
    let { rideId } = req.params;
    let { end_location_id, end_time, cost} = req.body;

    if (!end_location_id || !end_time || !cost) {
        return res.status(400).json({ error: "All inputs are needed!" });
    }

    try {
        let db = await mysql.createConnection(config);
        let [result] = await db.query(
            "UPDATE ride SET end_location_id = ?, end_time = ?, cost = ? WHERE ride_id = ?",
            [end_location_id, end_time, cost, rideId]
        );
        await db.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Trip could not be updated!" });
        }

        res.status(200).json({ message: "Trip has been updated!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error with updating trip", details: error.message });
    }
});

// Get details about a specific travel.
router.get("/:rideId", checkAuth, async (req, res) => {
    let { rideId } = req.params;

    // Validate that the rideId is a number.
    if (isNaN(rideId)) {
        return res.status(400).json({ error: "Invalid ride ID" });
    }

    try {
        let db = await mysql.createConnection(config);
        let [ride] = await db.query("SELECT * FROM ride WHERE ride_id = ?", [rideId]);
        await db.end();

        if (ride.length === 0) {
            res.status(404).json({ error: "Travel not found" });
            // If the travel is not found, return a error message.
        }
        res.status(200).json(ride[0]);
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

module.exports = router;
