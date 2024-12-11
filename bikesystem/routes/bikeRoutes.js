const express = require('express');
const router = express.Router();
const { updateStatus } = require('./controller/bikeController');

router.post('/updateStatus', async (req, res) => {
    const { bikeId, locationId, status, speed } = req.body;
    try {
        const result = await updateStatus(bikeId, locationId, status, speed);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
