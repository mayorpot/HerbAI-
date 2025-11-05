// backend/routes/admin.js
const express = require('express');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Admin middleware (basic implementation)
const isAdmin = (req, res, next) => {
  // In production, check if user has admin role
  if (req.user && req.user.email === 'admin@alba.com') {
    next();
  } else {
    res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required'
    });
  }
};

// Get all users (admin only)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: {
        users,
        total: users.length
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: error.message
    });
  }
});

// Get system statistics
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    
    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          helpfulCount: { $sum: { $cond: ['$helpful', 1, 0] } }
        }
      }
    ]);

    const stats = {
      totalUsers,
      totalFeedback,
      averageRating: feedbackStats[0]?.averageRating || 0,
      helpfulPercentage: feedbackStats[0] ? 
        ((feedbackStats[0].helpfulCount / totalFeedback) * 100) : 0
    };

    res.json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message
    });
  }
});

module.exports = router;