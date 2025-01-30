const fetch = require("node-fetch"); // Ensure 'node-fetch' is installed

// Function to update bike status via external API
async function updateBikeStatus(bikeId, newStatus, apiKey) {
  const apiUrl = `http://server:3000/v1/bikes/status/${bikeId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
        api_key: apiKey,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update bike status");
    }
    return data; // Return API response
  } catch (error) {
    console.error("Error updating bike status via API:", error);
    throw error; // Rethrow error for the caller
  }
}

// Function to handle charging status
function handleChargingStatus(bikeId, isCharging) {
  if (isCharging) {
    const newStatus = "underhåll";
    const apiKey = "key123"; // Replace with the actual API key

    updateBikeStatus(bikeId, newStatus, apiKey)
      .then((result) => {
        console.log("Bike status updated successfully:", result);
      })
      .catch((error) => {
        console.error("Failed to update bike status:", error.message);
      });
  }
}

async function addBikeToDatabase(bikeData, server) {
  const url = `http://${server}:3000/v1/bikes`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bikeData),
    });

    if (response.ok) {
      if (response.status === 201) {
        const data = await response.json();
        console.log("Bike added successfully:", data.message);
      }
    } else {
      // Läs felmeddelandet för att hantera specifika fel
      const errorData = await response.json();
      if (
        errorData.details &&
        errorData.details.includes("Bike already exists")
      ) {
        console.log("Bike already exists. Skipping...");
      } else {
        console.error(
          "Error adding bike:",
          errorData.details || "Unknown error"
        );
      }
    }
  } catch (error) {
    console.error("Network or server error:", error.message);
  }
}

module.exports = {
  handleChargingStatus,
  updateBikeStatus,
  addBikeToDatabase,
};
