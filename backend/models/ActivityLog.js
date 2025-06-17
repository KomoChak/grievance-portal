const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  subsidiary: { type: mongoose.Schema.Types.ObjectId, ref: "Subsidiary", default: null },
  area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", default: null },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
