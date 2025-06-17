const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register - Employee only
router.post('/register', register);

// POST /api/auth/login - Admin or Employee
router.post('/login', login);

module.exports = router;
