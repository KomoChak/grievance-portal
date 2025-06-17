// scripts/seedGrievances.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Grievance = require("../models/Grievance");
const User = require("../models/User");
const Subsidiary = require("../models/Subsidiary");
const Area = require("../models/Area");
const Unit = require("../models/Unit");
const Category = require("../models/Category");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seedGrievances() {
  try {
    const employee = await User.findOne({ employeeId: "1111" });
    if (!employee) throw new Error("Employee not found");

    const subsidiary = await Subsidiary.findOne({ name: "Western Coalfields Limited (WCL)" });
    const area = await Area.findOne({ name: "Nagpur Area" });
    const unit = await Unit.findOne({ name: "Unit N1" });

    if (!subsidiary || !area || !unit) {
      throw new Error("Subsidiary / Area / Unit name not found in DB");
    }

    // Patch employee if needed
    if (!employee.subsidiary || !employee.area || !employee.unit) {
      employee.subsidiary = subsidiary._id;
      employee.area = area._id;
      employee.unit = unit._id;
      await employee.save();
      console.log("✅ Patched employee with location info");
    }

    const areaAdmin = await User.findOne({ employeeId: "area001", role: "areaadmin" });
    if (!areaAdmin) throw new Error("Area admin with employeeId 'area001' not found");

    const categoryDoc = await Category.findOne({ name: "Pension Issues" });
    if (!categoryDoc) throw new Error("Category 'Pension Issues' not found");

    const subcategory = categoryDoc.subcategories[0]; // Pick the first subcategory

    const statuses = ["Submitted", "Pending", "Action Taken", "Resolved"];
    const grievances = statuses.map((status, i) => ({
      user: employee._id,
      title: `Test Grievance ${i + 1}`,
      description: `This is a seeded grievance with status: ${status}`,
      status: status === "Resolved" ? "Closed" : status, // convert Resolved to 'Closed' if needed by schema
      dateOfRetirement: new Date("2023-12-31"),
      subsidiary: subsidiary._id,
      area: area._id,
      unit: unit._id,
      assignedAreaAdmin: areaAdmin._id,
      category: categoryDoc._id,
      subcategory: subcategory,
    }));

    await Grievance.insertMany(grievances);
    console.log("✅ Seeded grievances for employee 1111");

  } catch (err) {
    console.error("🔥 Error seeding grievances:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

seedGrievances();
