// Created by Jacob
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");
const mysql = require("mysql2/promise");
const config = require("../config/db/elsparkcykel.json");
// Get a list over all the travels in the system.
router.get("/", checkAuth, async (req, res) => {
    try { // Get all travels data.
        let db = await mysql.createConnection(config);
        const [travels] = await db.query("SELECT * FROM ride");
        await db.end();
        res.status(200).json(travels);
    } catch (error) { // When a error, get details about the error.
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

module.exports = router;
