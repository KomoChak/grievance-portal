const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const ActivityLog = require('../models/ActivityLog');

// 🔐 Admin Login
// 🔐 Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { employeeId, password, role } = req.body;
    if (!employeeId || !password || !role) {
      return res.status(400).json({ message: 'Employee ID, password, and role are required.' });
    }

    const user = await User.findOne({ employeeId, role });
    if (!user) return res.status(401).json({ message: 'Invalid credentials or role' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        subsidiary: user.subsidiary?.toString() || null,
        area: user.area?.toString() || null,
        unit: user.unit?.toString() || null
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        employeeId: user.employeeId,
        subsidiary: user.subsidiary,
        area: user.area,
        unit: user.unit
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// ➕ Superadmin: Create Subsidiary Admin
const createSubsidiaryAdmin = async (req, res) => {
  try {
    const { name, email, employeeId, password, subsidiary } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      employeeId,
      password: hashedPassword,
      role: 'subsidiaryadmin',
      subsidiary
    });

    res.status(201).json({ admin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating subsidiary admin', error: err.message });
  }
};

// ➕ Subsidiary Admin: Create Area Admin
const createAreaAdmin = async (req, res) => {
  try {
    const { name, email, employeeId, password, area, unit } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      employeeId,
      password: hashedPassword,
      role: 'areaadmin',
      subsidiary: req.user.subsidiary,
      area,
      unit
    });

    res.status(201).json({ admin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating area admin', error: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const { role, subsidiary, _id } = req.user;

    let filter = {};
    if (role === 'subsidiaryadmin' && subsidiary) {
      filter.subsidiary = subsidiary;
    } else if (role === 'areaadmin') {
      filter.assignedAreaAdmin = _id;
    }

    const submittedCount = await Grievance.countDocuments({ ...filter, status: 'submitted' });
    const pendingCount = await Grievance.countDocuments({ ...filter, status: 'pending' });
    const actionTakenCount = await Grievance.countDocuments({ ...filter, status: 'action_taken' });
    const closedCount = await Grievance.countDocuments({ ...filter, status: 'closed' });

    const statusData = [
      { name: 'Submitted', value: submittedCount },
      { name: 'Pending', value: pendingCount },
      { name: 'Action Taken', value: actionTakenCount },
      { name: 'Closed', value: closedCount }
    ];

    // 🕓 Pendency analysis (on all non-closed)
    const nonClosedFilter = { ...filter, status: { $in: ['submitted', 'pending', 'action_taken'] } };
    const grievances = await Grievance.find(nonClosedFilter, 'createdAt');
    const now = new Date();
    const pendencyBuckets = { "<30": 0, "30-60": 0, "60-90": 0, "90+": 0 };

    grievances.forEach((g) => {
      const days = Math.floor((now - new Date(g.createdAt)) / (1000 * 60 * 60 * 24));
      if (days < 30) pendencyBuckets["<30"]++;
      else if (days < 60) pendencyBuckets["30-60"]++;
      else if (days < 90) pendencyBuckets["60-90"]++;
      else pendencyBuckets["90+"]++;
    });

    res.json({
      statusData,
      pendencyData: Object.entries(pendencyBuckets).map(([name, value]) => ({ name, value }))
    });
  } catch (err) {
    console.error("❌ Dashboard stats error:", err);
    res.status(500).json({ message: 'Error loading dashboard stats', error: err.message });
  }
};


// 📄 Grievances by Status
const getGrievancesByStatus = async (req, res) => {
  try {
    const { role, subsidiary, _id } = req.user;
    const { status } = req.query;
    let filter = status ? { status } : {};

    if (role === 'subsidiaryadmin' && subsidiary) {
      filter.subsidiary = new mongoose.Types.ObjectId(subsidiary);
    } else if (role === 'areaadmin') {
      filter.assignedAreaAdmin = _id;
    }

    const grievances = await Grievance.find(filter)
      .populate('user', 'name employeeId')
      .populate('subsidiary', 'name')
      .populate('area', 'name')
      .populate('unit', 'name');

    res.json({ grievances });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch grievances', error: err.message });
  }
};

// 👤 View Admin Profile
const viewAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Admin not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// 📌 Assign Grievance
const assignGrievanceToAreaAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { areaAdminId } = req.body;
    const areaAdmin = await User.findById(areaAdminId);
    if (!areaAdmin || areaAdmin.role !== 'areaadmin') {
      return res.status(400).json({ message: 'Invalid area admin' });
    }

    const updated = await Grievance.findByIdAndUpdate(
      id,
      { assignedAreaAdmin: areaAdmin._id, status: 'pending' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Grievance not found' });
    res.json({ message: 'Grievance assigned', grievance: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning grievance', error: err.message });
  }
};

// 📌 Get Area Admins
// ✅ Get Area Admins under current subsidiary (for assignment dropdown)
// 📌 Get Area Admins under current subsidiary (for assignment dropdown)
const getAreaAdminsForSubsidiary = async (req, res) => {
  try {
    const { subsidiary } = req.user;

    const admins = await User.find({
      role: 'areaadmin',
      subsidiary,
    })
      .populate('area', 'name')         // ✅ Populate area details
      .populate('subsidiary', 'name');  // ✅ Populate subsidiary details (important for frontend filter)

    res.status(200).json({ admins });
  } catch (err) {
    console.error("❌ Error fetching area admins:", err);
    res.status(500).json({ message: 'Server error while fetching area admins' });
  }
};


// 🔔 Send Reminder
const sendReminderToSubsidiaryAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const grievance = await Grievance.findById(id).populate('subsidiary');
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    const admin = await User.findOne({
      role: 'subsidiaryadmin',
      subsidiary: grievance.subsidiary._id,
    });

    if (!admin) return res.status(404).json({ message: 'Subsidiary admin not found' });

    console.log(`🔔 Reminder sent to: ${admin.name} (${admin.email})`);
    res.json({ message: `Reminder sent to ${admin.name}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reminder', error: err.message });
  }
};

// 📝 Add Remark
// 📌 In controllers/adminsController.js > addGrievanceRemark
const addGrievanceRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark, close } = req.body;

    const grievance = await Grievance.findById(id);
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    // Optional remark
    if (remark) {
      grievance.remarks.push({
        text: remark,
        by: req.user._id,
        to: "employee",
        date: new Date()
      });
    }

    // Status logic
    if (close) {
      grievance.status = 'closed';
    } else if (grievance.status !== 'closed') {
      grievance.status = 'action_taken';
    }

    await grievance.save();

    res.json({ message: close ? 'Grievance closed successfully' : 'Remark added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update grievance', error: err.message });
  }
};



// 👥 Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['subsidiaryadmin', 'areaadmin'] } })
      .populate('subsidiary', 'name')
      .populate('area', 'name')
      .select('-password');
    res.json({ admins });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admins', error: err.message });
  }
};

// ✅ Toggle Admin Status
const toggleAdminStatus = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.active = !admin.active;
    await admin.save();
    res.json({ message: `Admin is now ${admin.active ? 'Active' : 'Inactive'}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// ❌ Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Admin not found' });
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete admin', error: err.message });
  }
};

// 🔒 Trigger Password Reset
const triggerPasswordReset = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    console.log(`🔐 Password reset link sent to ${admin.email}`);
    res.json({ message: `Password reset triggered for ${admin.email}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to trigger reset', error: err.message });
  }
};
const getRecentActivity = async (req, res) => {
  try {
    const { role, subsidiary, area } = req.user;
    let query = {};

    if (role === 'subsidiaryadmin') {
      query.subsidiary = subsidiary;
    } else if (role === 'areaadmin') {
      query.area = area;
    }

    const logs = await ActivityLog.find(query)
      .sort({ date: -1 })
      .limit(20)
      .populate('admin', 'name');

    const formattedLogs = logs.map(log => ({
      message: log.message,
      date: log.date,
      by: log.admin?.name || 'Unknown'
    }));

    res.json({ recentActivity: formattedLogs });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recent activity', error: err.message });
  }
};
module.exports = {
  loginAdmin,
  createSubsidiaryAdmin,
  createAreaAdmin,
  getDashboardStats,
  getGrievancesByStatus,
  viewAdminProfile,
  assignGrievanceToAreaAdmin,
  getAreaAdminsForSubsidiary,
  addGrievanceRemark,
  sendReminderToSubsidiaryAdmin,
  getAllAdmins,
  toggleAdminStatus,
  deleteAdmin,
  triggerPasswordReset,
   getRecentActivity
};
