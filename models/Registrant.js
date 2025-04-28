const mongoose = require('mongoose');

const registrantSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  webinarId: String,
  schedule: String,
  timezone: String,
  webinarResponse: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registrant', registrantSchema);
