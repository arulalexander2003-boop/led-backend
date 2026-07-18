const mongoose = require('mongoose');

const ledStateSchema = new mongoose.Schema({
  deviceId: { type: String, default: 'esp32-1', unique: true },
  state: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LedState', ledStateSchema);
