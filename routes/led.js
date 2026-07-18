const express = require('express');
const router = express.Router();
const LedState = require('../models/LedState');

const DEVICE_ID = 'esp32-1';

// GET /api/led/status
// Used by BOTH the ESP32 (to poll what it should do) and the React app
// (to show the current state on load).
router.get('/status', async(req, res) => {
    try {
        let led = await LedState.findOne({ deviceId: DEVICE_ID });
        if (!led) {
            led = await LedState.create({ deviceId: DEVICE_ID, state: 'OFF' });
        }
        res.json({ state: led.state });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/led/toggle
// Used by the React app when the user clicks the toggle button.
// Body: { "state": "ON" } or { "state": "OFF" }
router.post('/toggle', async(req, res) => {
    try {
        const { state } = req.body;
        if (!['ON', 'OFF'].includes(state)) {
            return res.status(400).json({ error: 'state must be "ON" or "OFF"' });
        }

        const led = await LedState.findOneAndUpdate({ deviceId: DEVICE_ID }, { state, updatedAt: Date.now() }, { new: true, upsert: true });

        res.json({ state: led.state });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;