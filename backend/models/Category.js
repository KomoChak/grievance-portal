const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  subcategories: [subcategorySchema],
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
