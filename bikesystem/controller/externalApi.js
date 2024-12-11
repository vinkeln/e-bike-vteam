const fetch = require('node-fetch'); // Need to have downloaded 'node-fetch' 

// En funktion för att uppdatera status på en cykel via ett externt API
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
        return data;  // Returns the data from the API
    } catch (error) {
        console.error("Error updating bike status via API:", error);
        throw error;  // Throws the error to the calling function
    }
}

module.exports = {
    updateBikeStatus
};
