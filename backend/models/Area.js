const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subsidiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsidiary', required: true }
});

module.exports = mongoose.model('Area', areaSchema);
