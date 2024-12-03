const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");
const mysql = require("mysql2/promise");
const config = require("../config/db/elsparkcykel.json");

router.get("/", checkAuth, (req, res) => {
    res.status(200).json({
        message:"scooter it is working"
    });
});

// Get all bikes from the database.
router.get("/api/v1/bikes", checkAuth, async (req, res) => {
    try {
        let db = await mysql.createConnection(config);
        let [bikes] = await db.query("SELECT * FROM scooter");
        await db.end();
        res.status(200).json(bikes);
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Get details of a specific bike from the database.
router.get("/api/v1/bikes/{bikeId}", checkAuth, async (req, res) => {
    let = bikeId = req.params.bikeId;
    try {
        let db = await mysql.createConnection(config);
        let [scooter] = await db.query("SELECT * FROM scooter WHERE scooter_id = ?", [scooterId]);
        await db.end();
        if (scooter.length === 0) {
            return res.status(404).json({ message: "Scooter not found" });
        }
        res.status(200).json(scooter[0]);
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Add a bike to the database.
router.post("/api/v1/bikes", checkAuth, async (req, res) => {
    let { current_location_id, battery_level, status, last_service_date } = req.body;
    try {
        let db = await mysql.createConnection(config);
        let result = await db.query(
            "INSERT INTO scooter (current_location_id, battery_level, status, last_service_date) VALUES (?, ?, ?, ?)",
            [current_location_id, battery_level, status, last_service_date]
        );
        await db.end();
        res.status(201).json({ message: "Scooter added", scooterId: result[0].insertId });
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Update a bike in the database.
router.put("/api/v1/bikes/{bikeId}", checkAuth, async (req, res) => {
    let scooterId = req.params.scooter_id;
    let { current_location_id, battery_level, status, last_service_date,} = req.body;
    try {
        let db = await mysql.createConnection(config);
        let result = await db.query(
            "UPDATE scooter SET current_location_id = ?, battery_level = ?, status = ?, last_service_date = ? WHERE scooter_id = ?",
            [current_location_id, battery_level, status, last_service_date, scooterId]
        );
        await db.end();
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: "Scooter not found" });
        }
        res.status(200).json({ message: "Scooter updated" });
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Remove a bike from the database.
router.delete("api/v1/bikes/{bikeId}", checkAuth, async (req, res) => {
    let scooterId = req.params.scooter_id;
    let db = await mysql.createConnection(config);
    let result = await db.query("DELETE FROM scooter WHERE scooter_id = ?", [scooterId]);
    await db.end();
    if (result[0].affectedRows === 0) {
        return res.status(404).json({ message: "Scooter not found" });
    }
});


module.exports = router;