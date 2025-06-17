// scripts/updateSubsidiaryAdmins.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config(); // Load environment variables

// Map of subsidiary admin employeeId => subsidiary ObjectId
const adminSubsidiaryMap = {
  subsadmin_eastern: '68496743351fa753fa01239c',
  subsadmin_bharat: '6846b81abf9ce0b289c7d0fb',
  subsadmin_central: '6846b81bbf9ce0b289c7d109',
  subsadmin_northern: '6846b81cbf9ce0b289c7d117',
  subsadmin_western: '6846b81dbf9ce0b289c7d125',
  subsadmin_south: '6846b81ebf9ce0b289c7d133',
  subsadmin_mahanadi: '6846b81fbf9ce0b289c7d141',
  subsadmin_cmpdi: '6846b819bf9ce0b289c7d0ed' // Add this if CMPDI admin exists
};

const updateSubsidiaryAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const updates = Object.entries(adminSubsidiaryMap).map(
      async ([employeeId, subsidiaryId]) => {
        const updated = await User.findOneAndUpdate(
          { employeeId, role: 'subsidiaryadmin' },
          { $set: { subsidiary: new mongoose.Types.ObjectId(subsidiaryId) } },
          { new: true }
        );
        if (updated) {
          console.log(`🔁 Updated ${employeeId} → subsidiary ${subsidiaryId}`);
        } else {
          console.log(`❌ No admin found for ${employeeId}`);
        }
      }
    );

    await Promise.all(updates);
    console.log('✅ All subsidiary admins updated.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating admins:', err);
    process.exit(1);
  }
};

updateSubsidiaryAdmins();
