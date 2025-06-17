const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Grievance = require("../models/Grievance");
const Area = require("../models/Area");
const Subsidiary = require("../models/Subsidiary");
const Unit = require("../models/Unit"); // ✅ Add this if missing

const checkKatrasGrievances = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const subsidiary = await Subsidiary.findOne({ name: "Bharat Coking Coal Limited (BCCL)" });
    if (!subsidiary) throw new Error("❌ Subsidiary not found.");

    const area = await Area.findOne({ name: "Katras Area", subsidiary: subsidiary._id });
    if (!area) throw new Error("❌ Katras Area not found.");

    const areaAdmin = await User.findOne({
      role: "areaadmin",
      subsidiary: subsidiary._id,
      area: area._id,
    });

    if (!areaAdmin) throw new Error("❌ Katras Area Admin not found.");

    const grievances = await Grievance.find({
      assignedAreaAdmin: areaAdmin._id,
      status: "pending",
    })
      .populate("user", "name employeeId")
      .populate("category", "name")
      .populate("subsidiary", "name")
      .populate("area", "name")
      .populate("unit", "name");

    if (grievances.length === 0) {
      console.log("📭 No grievances assigned to Katras Area Admin.");
    } else {
      console.log(`📌 Found ${grievances.length} grievances assigned to Katras Area Admin:`);
      grievances.forEach((g, i) => {
        console.log(
          `  ${i + 1}. Category: ${g.category?.name || "N/A"}, Submitted by: ${g.user?.name || "N/A"}`
        );
      });
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

checkKatrasGrievances();
