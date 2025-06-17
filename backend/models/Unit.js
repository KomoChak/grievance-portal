const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true }
});

module.exports = mongoose.model('Unit', unitSchema);
