// scripts/printAdminCredentials.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Subsidiary = require("../models/Subsidiary");
const Area = require("../models/Area");

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/grievancedb";

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const admins = await User.find({
      role: { $in: ["superadmin", "subsidiaryadmin", "areaadmin"] },
    })
      .populate("subsidiary", "name")
      .populate("area", "name")
      .select("employeeId name role subsidiary area");

    console.log("\n📋 Admin Accounts:\n");

    admins.forEach((admin, idx) => {
      console.log(`${idx + 1}. ${admin.name}`);
      console.log(`   Employee ID: ${admin.employeeId}`);
      console.log(`   Role       : ${admin.role}`);
      if (admin.subsidiary) console.log(`   Subsidiary : ${admin.subsidiary.name}`);
      if (admin.area) console.log(`   Area       : ${admin.area.name}`);
      console.log("---------------------------------------------------");
    });

    process.exit();
  } catch (err) {
    console.error("❌ Error printing admin credentials:", err.message);
    process.exit(1);
  }
};

run();
