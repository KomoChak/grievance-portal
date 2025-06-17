// scripts/seedSubsidiariesAreasUnits.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subsidiary = require('../models/Subsidiary');
const Area = require('../models/Area');
const Unit = require('../models/Unit');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const structure = [
  {
    name: "Eastern Coalfields Limited (ECL)",
    areas: [
      { name: "Sodepur Area", units: ["Unit S1", "Unit S2"] },
      { name: "Salanpur Area", units: ["Unit SA1", "Unit SA2"] },
    ],
  },
  {
    name: "Bharat Coking Coal Limited (BCCL)",
    areas: [
      { name: "Katras Area", units: ["Unit K1", "Unit K2"] },
      { name: "Barora Area", units: ["Unit B1", "Unit B2"] },
    ],
  },
  {
    name: "Central Coalfields Limited (CCL)",
    areas: [
      { name: "Argada Area", units: ["Unit A1", "Unit A2"] },
      { name: "Barka Sayal Area", units: ["Unit BS1", "Unit BS2"] },
    ],
  },
  {
    name: "Northern Coalfields Limited (NCL)",
    areas: [
      { name: "Singrauli Area", units: ["Unit SG1", "Unit SG2"] },
      { name: "Jayant Area", units: ["Unit J1", "Unit J2"] },
    ],
  },
  {
    name: "Western Coalfields Limited (WCL)",
    areas: [
      { name: "Nagpur Area", units: ["Unit N1", "Unit N2"] },
      { name: "Chandrapur Area", units: ["Unit C1", "Unit C2"] },
    ],
  },
  {
    name: "South Eastern Coalfields Limited (SECL)",
    areas: [
      { name: "Korba Area", units: ["Unit KOR1", "Unit KOR2"] },
      { name: "Baikunthpur Area", units: ["Unit BK1", "Unit BK2"] },
    ],
  },
  {
    name: "Mahanadi Coalfields Limited (MCL)",
    areas: [
      { name: "Talcher Area", units: ["Unit T1", "Unit T2"] },
      { name: "IB Valley Area", units: ["Unit IB1", "Unit IB2"] },
    ],
  },
  {
    name: "Central Mine Planning & Design Institute Limited (CMPDI)",
    areas: [
      { name: "CMPDI HQ", units: ["Unit HQ1", "Unit HQ2"] },
      { name: "CMPDI Regional", units: ["Unit R1", "Unit R2"] },
    ],
  },
];

async function seedHierarchy() {
  try {
    await Subsidiary.deleteMany();
    await Area.deleteMany();
    await Unit.deleteMany();

    for (const sub of structure) {
      const newSub = await Subsidiary.create({ name: sub.name });
      for (const area of sub.areas) {
        const newArea = await Area.create({
          name: area.name,
          subsidiary: newSub._id,
        });

        for (const unitName of area.units) {
          await Unit.create({
            name: unitName,
            area: newArea._id,
            subsidiary: newSub._id,
          });
        }
      }
    }

    console.log("✅ Subsidiaries, Areas, and Units seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

seedHierarchy();
