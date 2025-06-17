const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Grievance = require('../models/Grievance');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Connection failed:", err));

(async () => {
  try {
    const res = await Grievance.updateMany(
      { status: "in_progress" },
      { $set: { status: "action_taken" } }
    );
    console.log(`🛠️ Updated ${res.modifiedCount} grievances from in_progress → action_taken`);
    process.exit();
  } catch (err) {
    console.error("❌ Failed to update grievances:", err);
    process.exit(1);
  }
})();
