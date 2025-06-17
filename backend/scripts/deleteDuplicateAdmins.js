const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// 🔗 Replace this with your actual MongoDB URI in `.env`
const MONGO_URI = process.env.MONGO_URI;

const duplicateEmployeeIds = [
  // Eastern duplicates
  "ecl_areaadmin_1",
  "ecl_areaadmin_2",

  // BCCL duplicates
  "bccl_areaadmin_1",
  "bccl_areaadmin_2",

  // CCL duplicates
  "ccl_areaadmin_1",
  "ccl_areaadmin_2",

  // NCL duplicates
  "ncl_areaadmin_1",
  "ncl_areaadmin_2",

  // WCL duplicates
  "wcl_areaadmin_1",
  "wcl_areaadmin_2",

  // SECL duplicates
  "secl_areaadmin_1",
  "secl_areaadmin_2",

  // MCL duplicates
  "mcl_areaadmin_1",
  "mcl_areaadmin_2"
];

async function deleteDuplicates() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await User.deleteMany({
      employeeId: { $in: duplicateEmployeeIds }
    });

    console.log(`🧹 Deleted ${result.deletedCount} duplicate admin(s).`);
    process.exit();
  } catch (error) {
    console.error("❌ Error deleting duplicate admins:", error);
    process.exit(1);
  }
}

deleteDuplicates();
