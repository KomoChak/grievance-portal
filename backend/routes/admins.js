const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const {
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
} = require('../controllers/adminsController');

// 🔐 Admin Login
router.post('/login', loginAdmin);

// 🧑‍💼 Superadmin: Add Subsidiary Admin
router.post('/add-subsidiary-admin', authMiddleware('superadmin'), createSubsidiaryAdmin);

// 🧑‍💼 Subsidiary Admin: Add Area Admin
router.post('/add-area-admin', authMiddleware('subsidiaryadmin'), createAreaAdmin);

// 👤 View Profile
router.get('/profile', authMiddleware(['superadmin', 'subsidiaryadmin', 'areaadmin']), viewAdminProfile);

// 📊 Dashboard Stats
router.get('/dashboard-stats', authMiddleware(['superadmin', 'subsidiaryadmin', 'areaadmin']), getDashboardStats);

// 📄 View Grievances by Status
router.get('/grievances', authMiddleware(['superadmin', 'subsidiaryadmin', 'areaadmin']), getGrievancesByStatus);

// 📬 Assign Grievance to Area Admin
router.put('/assign-grievance/:id', authMiddleware('subsidiaryadmin'), assignGrievanceToAreaAdmin);

// 📥 Add Remark to Grievance
router.post('/grievances/:id/add-remark', authMiddleware('areaadmin'), addGrievanceRemark);

// 🔔 Send Reminder to Subsidiary Admin
router.post('/grievances/:id/remind', authMiddleware('superadmin'), sendReminderToSubsidiaryAdmin);

// 👥 Get Area Admins under Subsidiary
router.get('/area-admins', authMiddleware('subsidiaryadmin'), getAreaAdminsForSubsidiary);

// 📋 Get All Admins (Superadmin only)
router.get('/all-admins', authMiddleware('superadmin'), getAllAdmins);

// 🔁 Toggle Admin Active/Inactive
router.put('/toggle-admin/:id', authMiddleware('superadmin'), toggleAdminStatus);

// ❌ Delete Admin
router.delete('/delete-admin/:id', authMiddleware('superadmin'), deleteAdmin);

// 🔐 Trigger Password Reset
router.post('/reset-password/:id', authMiddleware('superadmin'), triggerPasswordReset);

// 📜 Get Recent Activity
router.get('/recent-activity', authMiddleware(['superadmin', 'subsidiaryadmin', 'areaadmin']), getRecentActivity);

router.get('/dashboard-stats', authMiddleware(['superadmin', 'subsidiaryadmin', 'areaadmin']), getDashboardStats);

module.exports = router;
