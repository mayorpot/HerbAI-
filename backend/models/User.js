// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  healthProfile: {
    allergies: [String],
    medicalHistory: [String],
    medications: [String],
    preferences: {
      preferredLanguage: { type: String, default: 'en' },
      measurementSystem: { type: String, default: 'metric' }
    }
  },
  conversationHistory: [{
    message: String,
    response: String,
    timestamp: { type: Date, default: Date.now },
    symptoms: [String],
    remediesSuggested: [String]
  }],
  feedback: [{
    conversationId: mongoose.Schema.Types.ObjectId,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);