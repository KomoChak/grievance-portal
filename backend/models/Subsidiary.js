const mongoose = require('mongoose');

const subsidiarySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Subsidiary', subsidiarySchema);
