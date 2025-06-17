// scripts/seedEmployeesAndGrievances.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const User = require('../models/User');
const Grievance = require('../models/Grievance');
const Subsidiary = require('../models/Subsidiary');
const Area = require('../models/Area');
const Unit = require('../models/Unit');

dotenv.config();

const hashedPassword = '$2b$10$KCXX61dixH9j3Pvslbe2yu1KfWmnGk8/2Fj9Q6GtQ6nwyBhImtYS6'; // "test"

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

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany({ role: 'employee' });
    await Grievance.deleteMany();
    console.log("🧹 Old employees and grievances cleared");

    for (let s of structure) {
      const subsidiary = await Subsidiary.findOne({ name: s.name });
      if (!subsidiary) {
        console.warn(`⚠️ Subsidiary not found: ${s.name}`);
        continue;
      }

      const areaData = s.areas[0];
      const area = await Area.findOne({ name: areaData.name, subsidiary: subsidiary._id });
      const unit = await Unit.findOne({ name: areaData.units[0], area: area?._id });

      if (!area || !unit) {
        console.warn(`⚠️ Area or Unit not found for: ${s.name}`);
        continue;
      }

      const employee = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        employeeId: `emp_${s.name.split(" ")[0].toLowerCase()}`,
        role: 'employee',
        subsidiary: subsidiary._id,
        area: area._id,
        unit: unit._id,
        designation: "Worker",
        mobile: faker.phone.number('9#########'),
      });

      await Grievance.create({
        user: employee._id,
        subsidiary: subsidiary._id,
        area: area._id,
        unit: unit._id,
        category: "Payment of Provident Fund",
        subcategory: "Delay in Payment",
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: "submitted",
        dateOfRetirement: faker.date.past({ years: 1 }),
      });

      console.log(`✅ Seeded grievance for employee under ${s.name}`);
    }

    console.log("🌱 All data seeded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    process.exit(1);
  }
}

seed();
