// backend/routes/feedback.js
const express = require('express');
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Submit feedback
router.post('/submit', protect, async (req, res) => {
  try {
    const {
      conversationId,
      userMessage,
      aiResponse,
      rating,
      helpful,
      comments,
      symptoms,
      remediesSuggested,
      improvementsSuggested
    } = req.body;

    const feedback = await Feedback.create({
      user: req.user._id,
      conversationId,
      userMessage,
      aiResponse,
      rating,
      helpful,
      comments,
      symptoms: symptoms || [],
      remediesSuggested: remediesSuggested || [],
      improvementsSuggested: improvementsSuggested || []
    });

    // Update user's feedback array
    await req.user.feedback.push(feedback._id);
    await req.user.save();

    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully',
      data: {
        feedback: {
          id: feedback._id,
          rating: feedback.rating,
          helpful: feedback.helpful,
          timestamp: feedback.timestamp
        }
      }
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(400).json({
      error: 'Failed to submit feedback',
      message: error.message
    });
  }
});

// Get user's feedback history
router.get('/history', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find({ user: req.user._id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Feedback.countDocuments({ user: req.user._id });

    res.json({
      status: 'success',
      data: {
        feedback,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get feedback history error:', error);
    res.status(400).json({
      error: 'Failed to get feedback history',
      message: error.message
    });
  }
});

// Get feedback statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          helpfulCount: { $sum: { $cond: ['$helpful', 1, 0] } },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const ratingDistribution = stats[0]?.ratingDistribution?.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      status: 'success',
      data: {
        stats: {
          totalFeedback: stats[0]?.totalFeedback || 0,
          averageRating: stats[0]?.averageRating?.toFixed(1) || 0,
          helpfulPercentage: stats[0] ? 
            ((stats[0].helpfulCount / stats[0].totalFeedback) * 100).toFixed(1) : 0,
          ratingDistribution
        }
      }
    });

  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(400).json({
      error: 'Failed to get feedback statistics',
      message: error.message
    });
  }
});

// Get overall system feedback (admin only - simplified for now)
router.get('/system-stats', async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          helpfulCount: { $sum: { $cond: ['$helpful', 1, 0] } },
          commonSymptoms: { $push: '$symptoms' },
          commonRemedies: { $push: '$remediesSuggested' }
        }
      }
    ]);

    // Process common symptoms and remedies
    const allSymptoms = stats[0]?.commonSymptoms.flat() || [];
    const allRemedies = stats[0]?.commonRemedies.flat() || [];

    const symptomFrequency = allSymptoms.reduce((acc, symptom) => {
      acc[symptom] = (acc[symptom] || 0) + 1;
      return acc;
    }, {});

    const remedyFrequency = allRemedies.reduce((acc, remedy) => {
      acc[remedy] = (acc[remedy] || 0) + 1;
      return acc;
    }, {});

    res.json({
      status: 'success',
      data: {
        systemStats: {
          totalFeedback: stats[0]?.totalFeedback || 0,
          averageRating: stats[0]?.averageRating?.toFixed(1) || 0,
          helpfulPercentage: stats[0] ? 
            ((stats[0].helpfulCount / stats[0].totalFeedback) * 100).toFixed(1) : 0,
          topSymptoms: Object.entries(symptomFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10),
          topRemedies: Object.entries(remedyFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
        }
      }
    });

  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(400).json({
      error: 'Failed to get system statistics',
      message: error.message
    });
  }
});

module.exports = router;