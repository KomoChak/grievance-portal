const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Subsidiary = require("../models/Subsidiary");
const Area = require("../models/Area");
const Unit = require("../models/Unit");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedEmployees = async () => {
  try {
    const subsidiaries = await Subsidiary.find();

    let count = 1;
    const employees = [];

    for (const subsidiary of subsidiaries) {
      const areas = await Area.find({ subsidiary: subsidiary._id });

      for (const area of areas.slice(0, 2)) { // Only 1–2 areas
        const units = await Unit.find({ area: area._id });

        if (units.length === 0) continue;

        const unit = units[0]; // Pick first unit

        for (let i = 1; i <= 2; i++) {
          const password = await bcrypt.hash("testpass123", 10);

          // ✅ Generate clean and unique employee ID
          const cleanName = subsidiary.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;

          employees.push({
            name: `Employee ${count}`,
            employeeId: `emp_${cleanName}_${uniqueSuffix}`,
            email: `emp${count}@test.com`,
            password,
            role: "employee",
            subsidiary: subsidiary._id,
            area: area._id,
            unit: unit._id,
            designation: "Retired Staff",
            mobile: `99999999${count.toString().padStart(2, "0")}`
          });

          count++;
        }
      }
    }

    await User.insertMany(employees, { ordered: false });
    console.log(`✅ Seeded ${employees.length} employees successfully.`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding employees:", err);
    process.exit(1);
  }
};

seedEmployees();
