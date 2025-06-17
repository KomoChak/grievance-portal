const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'superadmin', 'subsidiaryadmin'],
    default: 'admin'
  },
  // Add more admin-specific fields here if needed
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
