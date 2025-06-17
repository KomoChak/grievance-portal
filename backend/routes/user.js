const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ✅ Correct import
const User = require('../models/User');     // ✅ Required for /me route
const {
  registerEmployee,
  loginEmployee,
  getCurrentUser
} = require('../controllers/usersController');

// 📩 POST /api/users/register - Register a new employee
router.post('/register', registerEmployee);

// 🔐 POST /api/users/login - Login as employee
router.post('/login', loginEmployee);

// 👤 GET /api/users/me - Get current logged-in employee's profile
router.get('/me', auth('employee'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('subsidiary area unit');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
