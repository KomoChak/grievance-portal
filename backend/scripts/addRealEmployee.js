// scripts/addRealEmployee.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config();

async function addRealEmployee() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("password", 10);

    const newUser = await User.create({
      name: "komo",
      employeeId: "1111",
      email: "komochak05@gmail.com",
      password: hashedPassword,
      role: "employee",
      subsidiary: null,
      area: null,
      unit: null,
      designation: "Test User",
      mobile: "9999999999",
      isActive: true,
    });

    console.log("✅ User created:", newUser);
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

addRealEmployee();
