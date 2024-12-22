const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js"); // Middleware för att verifiera om användaren är inloggad
const citiesModules = require("../src/cities/modules.js"); // Import av moduler som hanterar cities i databasen
const checkAdmin = require("../middleware/check-admin.js"); // Middleware för att kontrollera administratörsbehörighet

router.get("/", async (req, res) => {
  try {
    // Hämtar alla städer från databasen via modulen
    const cities = await citiesModules.getCities();
    // Returnerar resultatet som JSON med statuskod 200
    res.status(200).json({
      status: "success",
      cities: cities,
    });
  } catch (error) {
    // Vid fel skickas statuskod 500 och ett felmeddelande
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Endpoint för att lägga till en ny city
router.post("/add", checkAuth, checkAdmin, async (req, res) => {
  try {
    // Extraherar data från request-body
    const { name, country } = req.body;

    // Kontrollerar om det redan finns en stad
    const existingpcities = await citiesModules.checkCities(name);
    if (existingpcities.length > 0) {
      return res.status(409).json({ message: "city exists" }); // Konflikt om staden redan finns
    }

    // Lägger till den nya städer i databasen
    const result = await citiesModules.addCity(name, country);
    res.status(200).json({
      status: "success",
      message: "city has been added",
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

// Endpoint för att ta bort en city
router.delete("/:cityId", checkAuth, checkAdmin, async (req, res) => {
  const cityId = req.params.cityId; // Hämta city från URL-parametern

  try {
    // Kontrollera om city existerar
    const existingcities = await citiesModules.getCity(cityId);

    if (!existingcities || existingcities.length === 0) {
      return res.status(404).json({ message: "City not found" });
    }

    // Radera city
    await citiesModules.deleteCity(cityId);

    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
