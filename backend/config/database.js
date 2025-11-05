// backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For development, we'll use MongoDB Atlas (cloud) or local MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alba', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;