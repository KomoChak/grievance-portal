const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Grievance = require("../models/Grievance");
const Subsidiary = require("../models/Subsidiary");
const Area = require("../models/Area");

const assignGrievance = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const subsidiary = await Subsidiary.findOne({ name: "Bharat Coking Coal Limited (BCCL)" });
    const area = await Area.findOne({ name: "Katras Area", subsidiary: subsidiary._id });
    const admin = await User.findOne({
      role: "areaadmin",
      subsidiary: subsidiary._id,
      area: area._id,
    });

    if (!admin) throw new Error("❌ Katras Area Admin not found.");

    const grievance = await Grievance.findOne({
      subsidiary: subsidiary._id,
      area: area._id,
      status: "submitted",
    });

    if (!grievance) {
      console.log("📭 No submitted grievances found to assign.");
      return;
    }

    grievance.assignedAreaAdmin = admin._id;
    grievance.status = "pending";
    await grievance.save();

    console.log(`✅ Grievance ${grievance._id} assigned to Katras Area Admin.`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

assignGrievance();
