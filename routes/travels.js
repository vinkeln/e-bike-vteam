const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");
const checkAdmin = require("../middleware/check-admin.js"); // Middleware för att kontrollera administratörsbehörighet
const travelsModules = require("../src/travels/modules.js"); // Moduler för databashantering relaterade till resor
const chargingstationsModules = require("../src/chargingstations/modules.js"); // Moduler för databashantering relaterade till resor
const { checkScooterAvailability } = require("../src/travels/socketUtils");
const parkingssModules = require("../src/parkings/modules.js"); // Moduler för databashantering relaterade till resor

// Get a list over all the travels in the system.
router.get("/", checkAuth, checkAdmin, async (req, res) => {
  // Requires authentication = checkAuth
  try {
    // Get all travels data.

    const travels = await travelsModules.getTravels();
    res.status(200).json({
      status: "success",
      travels: travels,
    });
  } catch (error) {
    // When a error, get details about the error.
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Create a new trip when a customer hires a bike.
router.post("/", checkAuth, async (req, res) => {
  // Accepts user_id, scooter_id, start_location_id, start_time as body parameters.
  const { user_id, scooter_id, start_location_id, start_time, cost } = req.body;

  if (!user_id || !scooter_id || !start_location_id || !start_time || !cost) {
    return res.status(400).json({ error: "All inputs are needed!" });
  }

  try {
    // Kontrollera med socket-servern om cykeln är tillgänglig
    const socketResponse = await checkScooterAvailability(
      scooter_id,
      user_id,
      "requestRide"
    );
    if (!socketResponse.available) {
      return res
        .status(400)
        .json({ error: "Scooter is not available or not connected" });
    }

    const result = await travelsModules.addTravel(
      user_id,
      scooter_id,
      start_location_id,
      start_time,
      cost
    );

    res
      .status(201)
      .json({ message: "New trip has been added", rideId: result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server Error with new trip", details: error.message });
  }
});

// Update a specific travel.
router.put("/", checkAuth, async (req, res) => {
  let { end_time, cost, ride_id, scooter_id, user_id, end_location_id } =
    req.body;

  if (!end_location_id || !end_time || !cost) {
    return res.status(400).json({ error: "All inputs are needed!" });
  }

  // Kontrollera om ride id finns i databasen
  const existingRide = await travelsModules.getByRideId(ride_id);
  if (existingRide.length === 0) {
    return res.status(409).json({ message: "Travel not found" });
  }
  try {
    const chargingStation =
      await chargingstationsModules.getChargingStationLocation(end_location_id);
    if (chargingStation.length > 0) {
      // Kontrollera med socket-servern om cykeln är tillgänglig
      const socketResponse = await checkScooterAvailability(
        scooter_id,
        user_id,
        "startCharging"
      );
      if (!socketResponse.available) {
        return res.status(400).json({ error: "Scooter is charging" });
      }
    } else {
      // Kontrollera med socket-servern om cykeln är tillgänglig
      const socketResponse = await checkScooterAvailability(
        scooter_id,
        user_id,
        "stopRide",
        end_location_id
      );
      if (!socketResponse.available) {
        return res
          .status(400)
          .json({ error: "Scooter is not available or not connected" });
      }
    }
    const parkings = await parkingssModules.getScooterLocationById(scooter_id);
    console.log(parkings.exists);
    if (!parkings.exists) {
      cost = parseInt(cost, 10) + 10; // Lägg till 10 om platsen inte finns
      end_location_id = parkings.locationId;
    }
    end_location_id = parkings.locationId;
    await travelsModules.updateTravel(end_time, cost, ride_id, end_location_id);

    res.status(200).json({ message: "Trip has been updated!" });
  } catch (error) {
    res.status(500).json({
      error: "Server Error with updating trip",
      details: error.message,
    });
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
    const ride = await travelsModules.getByRideId(rideId);

    if (ride.length === 0) {
      return res.status(404).json({ error: "Travel not found" });
      // If the travel is not found, return a error message.
    }
    res.status(200).json({
      Status: "Success",
      Ride: ride[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Get details about a specific travel.
router.get("/user/:userId", checkAuth, async (req, res) => {
  let { userId } = req.params;

  // Validate that the userId is a number.
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid ride ID" });
  }

  try {
    const ride = await travelsModules.getByUserId(userId);

    if (ride.length === 0) {
      return res.status(404).json({ error: "Travel not found" });
      // If the travel is not found, return a error message.
    }
    res.status(200).json({
      Status: "Success",
      Ride: ride,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Endpoint för att ta bort en användare
router.delete("/:rideId", checkAuth, checkAdmin, async (req, res) => {
  const rideId = req.params.rideId; // Hämta användarens ID från URL-parametern

  try {
    // Kontrollera om ride id finns i databasen
    const existingRide = await travelsModules.getByRideId(rideId);
    if (existingRide.length === 0) {
      return res.status(404).json({ message: "Travel not found" });
    }

    // Radera användaren
    await travelsModules.deleteRide(rideId);

    res.status(200).json({ message: "Ride deleted successfully" });
  } catch (error) {
    console.error("Error deleting ride:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a new trip when a customer hires a bike.
router.post("/simulering", async (req, res) => {
  // Accepts user_id, scooter_id, start_location_id, start_time as body parameters.
  const { user_id, scooter_id, start_location_id, start_time, cost } = req.body;

  if (!user_id || !scooter_id || !start_location_id || !start_time || !cost) {
    return res.status(400).json({ error: "All inputs are needed!" });
  }

  try {
    // Kontrollera med socket-servern om cykeln är tillgänglig
    const socketResponse = await checkScooterAvailability(
      scooter_id,
      user_id,
      "requestRide"
    );
    if (!socketResponse.available) {
      return res
        .status(400)
        .json({ error: "Scooter is not available or not connected" });
    }

    const result = await travelsModules.addTravel(
      user_id,
      scooter_id,
      start_location_id,
      start_time,
      cost
    );

    res
      .status(201)
      .json({ message: "New trip has been added", rideId: result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server Error with new trip", details: error.message });
  }
});

// Update a specific travel.
router.put("/simulering", async (req, res) => {
  let { end_time, cost, ride_id, scooter_id, user_id, end_location_id } =
    req.body;

  if (!end_location_id || !end_time || !cost) {
    return res.status(400).json({ error: "All inputs are needed!" });
  }

  // Kontrollera om ride id finns i databasen
  const existingRide = await travelsModules.getByRideId(ride_id);
  if (existingRide.length === 0) {
    return res.status(409).json({ message: "Travel not found" });
  }
  try {
    const chargingStation =
      await chargingstationsModules.getChargingStationLocation(end_location_id);
    if (chargingStation.length > 0) {
      // Kontrollera med socket-servern om cykeln är tillgänglig
      const socketResponse = await checkScooterAvailability(
        scooter_id,
        user_id,
        "startCharging"
      );
      if (!socketResponse.available) {
        return res.status(400).json({ error: "Scooter is charging" });
      }
    } else {
      // Kontrollera med socket-servern om cykeln är tillgänglig
      const socketResponse = await checkScooterAvailability(
        scooter_id,
        user_id,
        "stopRide"
      );
      if (!socketResponse.available) {
        return res
          .status(400)
          .json({ error: "Scooter is not available or not connected" });
      }
    }
    await travelsModules.updateTravel(end_time, cost, ride_id, end_location_id);

    res.status(200).json({ message: "Trip has been updated!" });
  } catch (error) {
    res.status(500).json({
      error: "Server Error with updating trip",
      details: error.message,
    });
  }
});

module.exports = router;
