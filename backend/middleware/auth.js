// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(401).json({ message: 'User not found' });

      req.user = {
        _id: user._id,
        role: decoded.role,
        subsidiary: decoded.subsidiary || null,
        area: decoded.area || null,
        unit: decoded.unit || null,
        name: user.name,
        email: user.email
      };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = auth;
