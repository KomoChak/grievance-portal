// scripts/fixAllSubsidiaryAdmins.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Subsidiary = require('../models/Subsidiary');

dotenv.config();

const mapping = {
  subsadmin_eastern: "Eastern Coalfields Limited (ECL)",
  subsadmin_bharat: "Bharat Coking Coal Limited (BCCL)",
  subsadmin_central: "Central Coalfields Limited (CCL)",
  subsadmin_mahanadi: "Mahanadi Coalfields Limited (MCL)",
  subsadmin_northern: "Northern Coalfields Limited (NCL)",
  subsadmin_western: "Western Coalfields Limited (WCL)",
  subsadmin_south: "South Eastern Coalfields Limited (SECL)",
  subsadmin_cmpdi: "Central Mine Planning and Design Institute (CMPDI)"
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const [employeeId, subsidiaryName] of Object.entries(mapping)) {
      const admin = await User.findOne({ employeeId });
      const subsidiary = await Subsidiary.findOne({ name: subsidiaryName });

      if (!admin) {
        console.log(`❌ No admin found for ${employeeId}`);
        continue;
      }

      if (!subsidiary) {
        console.log(`❌ No subsidiary found for ${subsidiaryName}`);
        continue;
      }

      admin.subsidiary = subsidiary._id;
      await admin.save();

      console.log(`🔁 Updated ${employeeId} → subsidiary ${subsidiary._id}`);
    }

    console.log("✅ All subsidiary admins updated.");
    process.exit();
  } catch (err) {
    console.error("🔥 Error:", err);
    process.exit(1);
  }
}

run();
