// Created by Jacob
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");

// Get a list over all the travels in the system.
router.get("/", checkAuth, (req, res) => {
    try { // Get all travels data.
        const [travels] = await db.execute("SELECT * FROM ride");
        res.status(200).json(travels);
    } catch (error) { // When a error, get details about the error.
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

module.exports = router;
