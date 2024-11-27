const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");

router.get("/", checkAuth, (req, res) => {
    res.status(200).json({
        message:"parking it is working"
    });
});

module.exports = router;
