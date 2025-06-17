// scripts/updateAreaAdmins.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const areaAdminMappings = {
  area001: {
    subsidiary: '6846b819bf9ce0b289c7d0ed', // Example: CMPDI
    area: '6846b819bf9ce0b289c7d0ef',       // Example: CMPDI Area 1
  },
  area002: {
    subsidiary: '6846b819bf9ce0b289c7d0ed',
    area: '6846b81abf9ce0b289c7d0f5',
  },
  // Add more mappings as needed
};

const updateAreaAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const [employeeId, values] of Object.entries(areaAdminMappings)) {
      const result = await User.findOneAndUpdate(
        { employeeId, role: 'areaadmin' },
        {
          $set: {
            subsidiary: values.subsidiary,
            area: values.area,
          },
        },
        { new: true }
      );

      if (result) {
        console.log(`🔁 Updated ${employeeId} → subsidiary ${values.subsidiary}, area ${values.area}`);
      } else {
        console.log(`❌ No areaadmin found for ${employeeId}`);
      }
    }

    console.log("✅ All area admins updated.");
    process.exit();
  } catch (error) {
    console.error("❌ Error updating area admins:", error.message);
    process.exit(1);
  }
};

updateAreaAdmins();
