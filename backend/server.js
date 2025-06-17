// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); // ✅ Corrected
const grievanceRoutes = require('./routes/grievance');
const adminRoutes = require('./routes/admins');
const categoryRoutes = require('./routes/categories');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/categories', categoryRoutes);

// Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

  const debugRoutes = require('./routes/debug');
app.use('/api/debug', debugRoutes);
