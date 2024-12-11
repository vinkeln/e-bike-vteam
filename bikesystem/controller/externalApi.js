const fetch = require('node-fetch'); // Ensure 'node-fetch' is installed

// Function to update bike status via external API
async function updateBikeStatus(bikeId, newStatus, apiKey) {
    const apiUrl = `http://localhost:3000/v1/bikes/status/${bikeId}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus,
                api_key: apiKey
            })
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
        const newStatus = 'underhåll';
        const apiKey = 'key123'; // Replace with the actual API key

        updateBikeStatus(bikeId, newStatus, apiKey)
            .then(result => {
                console.log("Bike status updated successfully:", result);
            })
            .catch(error => {
                console.error("Failed to update bike status:", error.message);
            });
    }
}

module.exports = {
    handleChargingStatus,
    updateBikeStatus
};
