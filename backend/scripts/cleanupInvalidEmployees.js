// scripts/cleanupInvalidEmployees.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const cleanupInvalidEmployees = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const result = await User.deleteMany({
      role: 'employee',
      $or: [
        { subsidiary: { $exists: false } },
        { area: { $exists: false } },
        { unit: { $exists: false } },
        { subsidiary: null },
        { area: null },
        { unit: null }
      ]
    });

    console.log(`🧹 Deleted ${result.deletedCount} invalid employee(s).`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning employees:', err);
    process.exit(1);
  }
};

cleanupInvalidEmployees();
