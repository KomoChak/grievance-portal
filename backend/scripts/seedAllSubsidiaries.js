// scripts/seedAllSubsidiaries.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Subsidiary = require('../models/Subsidiary');
const Area = require('../models/Area');
const Unit = require('../models/Unit');

const password = bcrypt.hashSync("securepass", 10);

const subsidiaries = [
  {
    name: "Eastern Coalfields Limited (ECL)",
    short: "eastern",
    areas: [
      { name: "Sodepur Area", units: ["Unit S1", "Unit S2"] },
      { name: "Salanpur Area", units: ["Unit SA1", "Unit SA2"] },
    ],
  },
  {
    name: "Bharat Coking Coal Limited (BCCL)",
    short: "bharat",
    areas: [
      { name: "Katras Area", units: ["Unit K1", "Unit K2"] },
      { name: "Barora Area", units: ["Unit B1", "Unit B2"] },
    ],
  },
  {
    name: "Central Coalfields Limited (CCL)",
    short: "central",
    areas: [
      { name: "Argada Area", units: ["Unit A1", "Unit A2"] },
      { name: "Barka Sayal Area", units: ["Unit BS1", "Unit BS2"] },
    ],
  },
  {
    name: "Northern Coalfields Limited (NCL)",
    short: "northern",
    areas: [
      { name: "Singrauli Area", units: ["Unit SG1", "Unit SG2"] },
      { name: "Jayant Area", units: ["Unit J1", "Unit J2"] },
    ],
  },
  {
    name: "Western Coalfields Limited (WCL)",
    short: "western",
    areas: [
      { name: "Nagpur Area", units: ["Unit N1", "Unit N2"] },
      { name: "Chandrapur Area", units: ["Unit C1", "Unit C2"] },
    ],
  },
  {
    name: "South Eastern Coalfields Limited (SECL)",
    short: "south",
    areas: [
      { name: "Korba Area", units: ["Unit KOR1", "Unit KOR2"] },
      { name: "Baikunthpur Area", units: ["Unit BK1", "Unit BK2"] },
    ],
  },
  {
    name: "Mahanadi Coalfields Limited (MCL)",
    short: "mahanadi",
    areas: [
      { name: "Talcher Area", units: ["Unit T1", "Unit T2"] },
      { name: "IB Valley Area", units: ["Unit IB1", "Unit IB2"] },
    ],
  },
  {
    name: "Central Mine Planning & Design Institute Limited (CMPDI)",
    short: "cmpdi",
    areas: [
      { name: "CMPDI HQ", units: ["Unit HQ1", "Unit HQ2"] },
      { name: "CMPDI Regional", units: ["Unit R1", "Unit R2"] },
    ],
  },
];

async function seedAll() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  for (const sub of subsidiaries) {
    let subsidiary = await Subsidiary.findOne({ name: sub.name });
    if (!subsidiary) {
      subsidiary = await Subsidiary.create({ name: sub.name });
    }

    // Subsidiary admin
    const existing = await User.findOne({ employeeId: `subsadmin_${sub.short}` });
    if (!existing) {
      await User.create({
        name: `${sub.name} Admin`,
        email: `subsadmin_${sub.short}@coalindia.in`,
        employeeId: `subsadmin_${sub.short}`,
        password,
        role: 'subsidiaryadmin',
        subsidiary: subsidiary._id,
      });
    }

    for (let i = 0; i < sub.areas.length; i++) {
      const areaInfo = sub.areas[i];
      const area = await Area.create({
        name: areaInfo.name,
        subsidiary: subsidiary._id,
      });

      for (const unit of areaInfo.units) {
        await Unit.create({
          name: unit,
          area: area._id,
          subsidiary: subsidiary._id,
        });
      }

      await User.create({
        name: `${sub.name} Area Admin ${i + 1}`,
        email: `${sub.short}_areaadmin_${i + 1}@coalindia.in`,
        employeeId: `${sub.short}_areaadmin_${i + 1}`,
        password,
        role: 'areaadmin',
        subsidiary: subsidiary._id,
        area: area._id,
      });
    }

    console.log(`✅ Seeded for ${sub.name}`);
  }

  await mongoose.disconnect();
  console.log("🌱 All subsidiaries, areas, units, and admins created.");
}

seedAll().catch((err) => {
  console.error("❌ Seeding failed:", err);
});
