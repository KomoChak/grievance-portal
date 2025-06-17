const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['superadmin', 'subsidiaryadmin', 'areaadmin', 'employee'],
    default: 'employee'
  },
  subsidiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsidiary', default: null },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', default: null },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null },
  designation: { type: String, default: '' },
  mobile: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
