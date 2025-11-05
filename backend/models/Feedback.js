// backend/models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userMessage: {
    type: String,
    required: true
  },
  aiResponse: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  helpful: {
    type: Boolean,
    required: true
  },
  comments: {
    type: String,
    maxlength: 500
  },
  symptoms: [String],
  remediesSuggested: [String],
  improvementsSuggested: [String],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
feedbackSchema.index({ user: 1, timestamp: -1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ helpful: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);