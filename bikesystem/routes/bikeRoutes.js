const express = require('express');
const router = express.Router();
const { updateStatus } = require('./controller/bikeController');
const { updateBikeStatus } = require('./controller/externalApi.js');

router.post('/updateStatus', async (req, res) => {
    const { bikeId, locationId, status, speed } = req.body;
    try {
        const result = await updateStatus(bikeId, locationId, status, speed);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/bikes/:bikeId/status', (req, res) => {
    const { bikeId } = req.params;
    const { newStatus, apiKey } = req.body;

    updateBikeStatus(bikeId, newStatus, apiKey)
        .then(result => {
            res.json({ message: "Bike status updated successfully", data: result });
        })
        .catch(error => {
            console.error("Failed to update bike status:", error.message);
            res.status(500).json({ error: error.message });
        });
});

module.exports = router;
