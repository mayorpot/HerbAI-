// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const herbRoutes = require('./routes/herbs');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/herbs', herbRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ALBA Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ALBA Backend running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/alba'}`);
  console.log(`🔐 Authentication: Enabled`);
  console.log(`🤖 RAG System: Ready`);
  console.log(`💬 Feedback System: Active`);
});