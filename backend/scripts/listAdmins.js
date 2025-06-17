const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// 🧠 Register models before using populate
require("../models/Subsidiary");
require("../models/Area");
const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("✅ Connected to MongoDB");

  const admins = await User.find(
    { role: { $in: ["superadmin", "subsidiaryadmin", "areaadmin"] } },
    { name: 1, employeeId: 1, email: 1, role: 1 }
  )
    .populate("subsidiary", "name")
    .populate("area", "name");

  console.table(
    admins.map((admin) => ({
      name: admin.name,
      employeeId: admin.employeeId,
      email: admin.email,
      role: admin.role,
      subsidiary: admin.subsidiary?.name || "-",
      area: admin.area?.name || "-",
    }))
  );

  mongoose.disconnect();
}).catch((err) => {
  console.error("❌ Error:", err);
});
