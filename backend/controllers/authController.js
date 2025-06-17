const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1d';

// Register (Employee Only)
exports.register = async (req, res) => {
  try {
    const { name, employeeId, email, password } = req.body;

    if (!name || !employeeId || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (exists) return res.status(409).json({ message: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      employeeId,
      password: hashedPassword,
      role: 'employee'
    });

    const token = jwt.sign({
      userId: user._id,
      role: user.role,
      employeeId: user.employeeId,
      name: user.name
    }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login (Employee or Admin)
exports.login = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({ message: 'Employee ID and password are required.' });
    }

    const user = await User.findOne({ employeeId });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        employeeId: user.employeeId,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

