// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database with better error handling
const connectDB = async () => {
  try {
    const mongoose = require('mongoose');
    
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    console.log('🔗 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📦 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages based on common issues
    if (error.message.includes('bad auth')) {
      console.error('🔐 Authentication failed. Please check:');
      console.error('   - MongoDB username and password in .env file');
      console.error('   - Special characters in password should be URL-encoded');
      console.error('   - User permissions in MongoDB Atlas');
    } else if (error.message.includes('getaddrinfo')) {
      console.error('🌐 Network error. Please check:');
      console.error('   - Internet connection');
      console.error('   - MongoDB Atlas cluster URL');
      console.error('   - Firewall settings');
    } else if (error.message.includes('timed out')) {
      console.error('⏰ Connection timeout. Please check:');
      console.error('   - Network connectivity');
      console.error('   - MongoDB Atlas IP whitelist');
    }
    
    console.log('\n💡 Quick fixes:');
    console.log('   1. Check MONGODB_URI in .env file');
    console.log('   2. URL-encode special characters in password');
    console.log('   3. Reset MongoDB Atlas password if needed');
    console.log('   4. Use local MongoDB: mongodb://localhost:27017/alba');
    
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

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

// Health check with database status
app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  
  const statusMessages = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({ 
    status: dbStatus === 1 ? 'OK' : 'WARNING',
    message: 'ALBA Backend is running',
    database: statusMessages[dbStatus] || 'unknown',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  const mongoose = require('mongoose');
  try {
    const dbState = mongoose.connection.readyState;
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    res.json({
      connected: dbState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState],
      collections: collections.map(col => col.name),
      database: mongoose.connection.name,
      host: mongoose.connection.host
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      '/api/health',
      '/api/db-status',
      '/api/auth/*',
      '/api/ai/*',
      '/api/herbs/*',
      '/api/feedback/*',
      '/api/admin/*'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  
  // MongoDB specific errors
  if (error.name === 'MongoError') {
    return res.status(500).json({
      error: 'Database error',
      message: 'A database error occurred',
      code: error.code
    });
  }
  
  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: Object.values(error.errors).map(e => e.message).join(', ')
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please log in again'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 ALBA Backend Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local MongoDB'}`);
  console.log(`🔐 Authentication: Enabled`);
  console.log(`🤖 RAG System: Ready`);
  console.log(`💬 Feedback System: Active`);
  console.log(`⏰ Server time: ${new Date().toISOString()}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 DB Status: http://localhost:${PORT}/api/db-status`);
});

// Graceful server shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('📦 HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;