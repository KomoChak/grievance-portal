const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subsidiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsidiary', required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  dateOfRetirement: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  attachment: { type: String },
status: {
  type: String,
  enum: ['submitted', 'pending', 'action_taken', 'closed'],
  default: 'submitted'
},
  assignedSubsidiaryAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAreaAdmin: { type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null, },
remarks: [
  {
    text: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    file: String
  }
],

  messages: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      date: { type: Date, default: Date.now }
    }
  ],
  response: { type: String },
  activityLog: [
  {
    message: { type: String, required: true },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }
],
remarks: [
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: String, enum: ["employee", "subsidiaryadmin"], default: "employee" },
    message: { type: String },
    date: { type: Date, default: Date.now }
  }
],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grievance', grievanceSchema);
