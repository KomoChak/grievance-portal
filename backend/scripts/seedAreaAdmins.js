// backend/scripts/seedAreaAdmins.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Subsidiary = require('../models/Subsidiary');
const Area = require('../models/Area');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const subsidiaryData = [
  { name: "Eastern Coalfields Limited (ECL)", short: "ecl", areas: ["Sodepur Area", "Salanpur Area"] },
  { name: "Bharat Coking Coal Limited (BCCL)", short: "bccl", areas: ["Katras Area", "Barora Area"] },
  { name: "Central Coalfields Limited (CCL)", short: "ccl", areas: ["Argada Area", "Barka Sayal Area"] },
  { name: "Northern Coalfields Limited (NCL)", short: "ncl", areas: ["Singrauli Area", "Jayant Area"] },
  { name: "Western Coalfields Limited (WCL)", short: "wcl", areas: ["Nagpur Area", "Chandrapur Area"] },
  { name: "South Eastern Coalfields Limited (SECL)", short: "secl", areas: ["Korba Area", "Baikunthpur Area"] },
  { name: "Mahanadi Coalfields Limited (MCL)", short: "mcl", areas: ["Talcher Area", "IB Valley Area"] },
  { name: "Central Mine Planning & Design Institute Limited (CMPDI)", short: "cmpdi", areas: ["CMPDI HQ", "CMPDI Regional"] },
];

const passwordHash = bcrypt.hashSync('securepass', 10);

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  for (const { name, short, areas } of subsidiaryData) {
    const subsidiaryDoc = await Subsidiary.findOne({ name });
    if (!subsidiaryDoc) {
      console.warn(`⚠️ Subsidiary not found: ${name}`);
      continue;
    }

    for (let i = 0; i < areas.length; i++) {
      const areaName = areas[i];
      const areaDoc = await Area.findOne({ name: areaName });
      if (!areaDoc) {
        console.warn(`⚠️ Area not found: ${areaName}`);
        continue;
      }

      const areaAdmin = new User({
        name: `${name} Area Admin ${i + 1}`,
        employeeId: `${short}_areaadmin_${i + 1}`,
        email: `${short}_areaadmin_${i + 1}@coalindia.in`,
        password: passwordHash,
        role: 'areaadmin',
        subsidiary: subsidiaryDoc._id,
        area: areaDoc._id,
        designation: 'Area Manager',
        mobile: `99999999${i + 1}`,
        isActive: true,
      });

      await areaAdmin.save();
      console.log(`✅ Seeded: ${areaAdmin.employeeId}`);
    }
  }

  mongoose.disconnect();
};

run().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});
