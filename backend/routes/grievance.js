const express = require('express');
const router = express.Router();
const controller = require('../controllers/grievanceController');
const auth = require('../middleware/auth');

// 📝 Employee: Submit grievance
router.post('/', auth('employee'), controller.uploadMiddleware, controller.submitGrievance);

// 👀 Employee: View own grievances
router.get('/my', auth('employee'), controller.getMyGrievances);

// 📊 Superadmin: View all grievances
router.get('/all', auth('superadmin'), controller.getAllGrievances);

// 🏢 Subsidiary Admin: View all grievances for their subsidiary
router.get('/subsidiary', auth('subsidiaryadmin'), controller.getSubsidiaryGrievances);

// 📦 Area Admin or Subsidiary Admin: View assigned grievances
router.get('/assigned', auth(['areaadmin', 'subsidiaryadmin']), controller.getAssignedGrievances);
router.get('/action-taken', auth(['subsidiaryadmin', 'areaadmin']), controller.getActionTakenGrievances);

// ✅ Subsidiary Admin: View Submitted, Action Taken, Closed Grievances
router.get('/submitted', auth('subsidiaryadmin'), controller.getSubmittedGrievances);
router.get('/action-taken', auth(['subsidiaryadmin', 'areaadmin']), controller.getActionTakenGrievances);
router.get('/closed', auth(['subsidiaryadmin', 'areaadmin']), controller.getClosedGrievances);

// 🚀 Assign grievance to Area Admin
router.patch('/:id/assign', auth('subsidiaryadmin'), controller.assignGrievance);

// ✅ Update grievance status / response / file
router.patch('/:id', auth(['superadmin', 'subsidiaryadmin', 'areaadmin']), controller.uploadMiddleware, controller.updateGrievance);

// 💬 Send a message
router.post('/:id/messages', auth(['subsidiaryadmin', 'areaadmin']), controller.sendMessage);

module.exports = router;
