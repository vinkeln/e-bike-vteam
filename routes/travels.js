// Created by Jacob
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");

router.get("/", checkAuth, (req, res) => {
    res.status(200).json({
        message:"All travels is showing"
    });
});

module.exports = router;
