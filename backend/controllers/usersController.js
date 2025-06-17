// controllers/usersController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subsidiary = require('../models/Subsidiary');
const Area = require('../models/Area');
const Unit = require('../models/Unit');


exports.registerEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, password, mobile, designation, subsidiary, area, unit } = req.body;

    if (!name || !email || !employeeId || !password) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const existing = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) return res.status(400).json({ message: 'Email or Employee ID already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert names to ObjectIds
    const subsidiaryDoc = await Subsidiary.findOne({ name: subsidiary });
    const areaDoc = await Area.findOne({ name: area });
    const unitDoc = await Unit.findOne({ name: unit });

    if (!subsidiaryDoc || !areaDoc || !unitDoc) {
      return res.status(400).json({ message: 'Invalid subsidiary, area or unit selection.' });
    }

    const employee = await User.create({
      name,
      email,
      employeeId,
      password: hashedPassword,
      role: 'employee',
      mobile,
      designation,
      subsidiary: subsidiaryDoc._id,
      area: areaDoc._id,
      unit: unitDoc._id
    });

    const token = jwt.sign(
      {
        userId: employee._id,
        role: employee.role,
        subsidiary: employee.subsidiary,
        area: employee.area,
        unit: employee.unit
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Employee registered successfully.',
      token,
      user: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        employeeId: employee.employeeId,
        mobile: employee.mobile,
        designation: employee.designation,
        subsidiary: subsidiaryDoc,
        area: areaDoc,
        unit: unitDoc
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Error registering employee', error: err.message });
  }
};


exports.loginEmployee = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    const user = await User.findOne({ employeeId, role: 'employee' }).populate('subsidiary area unit');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        subsidiary: user.subsidiary?._id,
        area: user.area?._id,
        unit: user.unit?._id
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
        email: user.email,
        mobile: user.mobile,
        designation: user.designation,
        subsidiary: user.subsidiary,
        area: user.area,
        unit: user.unit
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('subsidiary area unit');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};
