const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Grievance = require('../models/Grievance');
const User = require('../models/User');
const Subsidiary = require('../models/Subsidiary');
const Area = require('../models/Area');
const Unit = require('../models/Unit');

// 🧩 File Upload Config using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Invalid file type.'));
  }
});

const uploadMiddleware = upload.single('attachment');

// 📝 Employee: Submit a grievance
const submitGrievance = async (req, res) => {
  try {
    const { subsidiary, area, unit, dateOfRetirement, category, subcategory, description, title } = req.body;

    if (!subsidiary || !area || !unit || !dateOfRetirement || !category || !subcategory || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const foundSubsidiary = await Subsidiary.findOne({ name: subsidiary });
    const foundArea = await Area.findOne({ name: area, subsidiary: foundSubsidiary?._id });
    const foundUnit = await Unit.findOne({ name: unit, area: foundArea?._id });

    if (!foundSubsidiary || !foundArea || !foundUnit) {
      return res.status(400).json({ message: 'Invalid subsidiary/area/unit provided.' });
    }

    const grievance = new Grievance({
      user: req.user._id,
      subsidiary: foundSubsidiary._id,
      area: foundArea._id,
      unit: foundUnit._id,
      dateOfRetirement,
      category,
      subcategory,
      title: title || `${category} - ${subcategory}`,
      description,
      attachment: req.file?.filename,
      status: 'submitted'
    });

    await grievance.save();
    res.status(201).json({ grievance });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting grievance', error: err.message });
  }
};

// 👤 Employee: View their grievances
const getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.user._id }).populate('subsidiary area unit');
    res.json({ grievances });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching grievances', error: err.message });
  }
};

// 📊 Superadmin: View all grievances
const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find().populate('user subsidiary area unit');
    res.json({ grievances });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all grievances' });
  }
};

// 🏢 Subsidiary Admin: View all grievances for their subsidiary
const getSubsidiaryGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({
      subsidiary: new mongoose.Types.ObjectId(req.user.subsidiary)
    }).populate('user subsidiary area unit');
    res.json({ grievances });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subsidiary grievances' });
  }
};

// ✅ Subsidiary Admin: View grievances with status = 'submitted'
const getSubmittedGrievances = async (req, res) => {
  try {
    const { subsidiary } = req.user;

    const grievances = await Grievance.find({
      status: 'submitted',
      subsidiary: new mongoose.Types.ObjectId(subsidiary)
    })
      .populate('user', 'name employeeId')
      .populate('subsidiary', 'name')
      .populate('area', 'name')
      .populate('unit', 'name');

    console.log("📊 /submitted → grievances count:", grievances.length);
    res.json({ grievances });
  } catch (err) {
    console.error("❌ Error in /grievances/submitted:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📦 Area Admin or Subsidiary Admin: View assigned (pending) grievances
const getAssignedGrievances = async (req, res) => {
  try {
    const { role, _id, subsidiary } = req.user;
    let filter = { status: 'pending' };

    if (role === 'areaadmin') {
      filter.assignedAreaAdmin = _id;
    } else if (role === 'subsidiaryadmin') {
      filter.subsidiary = subsidiary;
    }

    const grievances = await Grievance.find(filter)
      .populate('user', 'name employeeId')
      .populate('subsidiary', 'name')
      .populate('area', 'name')
      .populate('unit', 'name');

    res.json({ grievances });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assigned grievances', error: err.message });
  }
};

// 🔧 Action Taken Grievances for Subsidiary Admin or Area Admin
const getActionTakenGrievances = async (req, res) => {
  try {
    const { role, subsidiary, _id } = req.user;

    let query = { status: "action_taken" };

    if (role === "subsidiaryadmin") {
      query.subsidiary = subsidiary;
    } else if (role === "areaadmin") {
      query.assignedAreaAdmin = _id;
    } else {
      return res.status(403).json({ message: "Unauthorized role for this action" });
    }

    const grievances = await Grievance.find(query)
      .populate("user", "name employeeId")
      .populate("subsidiary", "name")
      .populate("area", "name")
      .populate("unit", "name")
      .populate("category subcategory assignedAreaAdmin");

    res.status(200).json({ grievances });
  } catch (err) {
    console.error("Error fetching action taken grievances:", err);
    res.status(500).json({ message: "Server error while retrieving grievances" });
  }
};



// ✅ Closed grievances (common for all admins)
const getClosedGrievances = async (req, res) => {
  try {
    const { role, subsidiary, _id } = req.user;

    let query = { status: "closed" };

    if (role === "subsidiaryadmin") {
      query.subsidiary = subsidiary;
    } else if (role === "areaadmin") {
      query.assignedAreaAdmin = _id;
    } else {
      return res.status(403).json({ message: "Unauthorized role for this action" });
    }

    const grievances = await Grievance.find(query)
      .populate("user", "name employeeId")
      .populate("subsidiary", "name")
      .populate("area", "name")
      .populate("unit", "name")
      .populate("category subcategory assignedAreaAdmin");

    res.json({ grievances });
  } catch (err) {
    res.status(500).json({ message: "Error fetching closed grievances", error: err.message });
  }
};



// 🚀 Subsidiary Admin: Assign grievance to Area Admin
const assignGrievance = async (req, res) => {
  try {
    const { areaAdminId, remark } = req.body;
    const grievanceId = req.params.id;

    const areaAdmin = await User.findOne({ _id: areaAdminId, role: 'areaadmin' });
    if (!areaAdmin) {
      return res.status(400).json({ message: 'Area admin not found' });
    }

    const updatePayload = {
      assignedAreaAdmin: areaAdminId,
      status: 'pending',
    };

    const updateQuery = remark
      ? {
          $set: updatePayload,
          $push: {
            messages: {
              from: req.user._id,
              to: areaAdminId,
              message: remark,
              date: new Date(),
            },
          },
        }
      : { $set: updatePayload };

    const grievance = await Grievance.findByIdAndUpdate(
      grievanceId,
      updateQuery,
      { new: true }
    );

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    res.json({ grievance });
  } catch (err) {
    console.error("❌ Error assigning grievance:", err);
    res.status(500).json({ message: 'Error assigning grievance', error: err.message });
  }
};



// ✅ Admins: Update grievance status / response (with optional file)
const updateGrievance = async (req, res) => {
  try {
    const { status, response } = req.body;
    const updateFields = {
      ...(status && { status }),
      ...(response && { response }),
      ...(req.file && { attachment: req.file.filename })
    };

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
    res.json({ grievance });
  } catch (err) {
    res.status(500).json({ message: 'Error updating grievance', error: err.message });
  }
};

// 💬 Admins: Send a message
const sendMessage = async (req, res) => {
  try {
    const { message, to } = req.body;
    if (!message || !to) return res.status(400).json({ message: 'Message and recipient are required.' });

    const grievance = await Grievance.findByIdAndUpdate(req.params.id, {
      $push: { messages: { from: req.user._id, to, message, date: new Date() } }
    }, { new: true });

    res.json({ messages: grievance.messages });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
};
const addGrievanceRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark, to, close } = req.body;

    const grievance = await Grievance.findById(id);
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    // Append remark if present
    if (remark && remark.trim()) {
      grievance.remarks.push({
        message: remark.trim(),
        from: req.user._id,
        to: to || 'employee',
        date: new Date()
      });
    }

    // Status flow handling
    if (close === true) {
      grievance.status = 'closed';
    } else if (grievance.status === 'pending') {
      grievance.status = 'action_taken';
    }

    await grievance.save();

    res.json({
      message: close ? 'Grievance closed successfully' : 'Remark added successfully',
      grievance
    });
  } catch (err) {
    console.error('❌ Error in addGrievanceRemark:', err);
    res.status(500).json({ message: 'Error updating grievance', error: err.message });
  }
};



module.exports = {
  uploadMiddleware,
  submitGrievance,
  getMyGrievances,
  getAllGrievances,
  getSubsidiaryGrievances,
  getAssignedGrievances,
  getSubmittedGrievances,
  getActionTakenGrievances,
  getClosedGrievances,
  assignGrievance,
  updateGrievance,
  sendMessage,
  addGrievanceRemark
};
