const express = require('express');
const Feedback = require('../models/Feedback');
const Herb = require('../models/Herb');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Simple validation middleware (temporary fix)
const validateFeedback = (req, res, next) => {
  const { rating, comment, herbId } = req.body;
  
  // Basic validation
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: 'Invalid rating',
      message: 'Rating must be between 1 and 5'
    });
  }
  
  if (comment && comment.length > 1000) {
    return res.status(400).json({
      error: 'Comment too long',
      message: 'Comment must not exceed 1000 characters'
    });
  }
  
  next();
};

// Submit feedback
router.post('/', auth, validateFeedback, async (req, res) => {
  try {
    const { herbId, rating, comment, type } = req.body;

    // Verify herb exists if herbId is provided
    if (herbId) {
      const herb = await Herb.findOne({ _id: herbId, isActive: true });
      if (!herb) {
        return res.status(404).json({
          error: 'Herb not found',
          message: 'The specified herb does not exist'
        });
      }
    }

    const feedback = new Feedback({
      userId: req.user._id,
      herbId,
      rating,
      comment,
      type: type || 'herb_feedback'
    });

    await feedback.save();

    // Populate user and herb details for response
    await feedback.populate('userId', 'name email');
    if (herbId) {
      await feedback.populate('herbId', 'name scientific');
    }

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });

  } catch (error) {
    console.error('🚨 Submit feedback error:', error);
    res.status(500).json({
      error: 'Unable to submit feedback',
      message: 'Please try again later'
    });
  }
});

// Get feedback for a specific herb
router.get('/herb/:herbId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verify herb exists
    const herb = await Herb.findOne({ _id: req.params.herbId, isActive: true });
    if (!herb) {
      return res.status(404).json({
        error: 'Herb not found',
        message: 'The specified herb does not exist'
      });
    }

    const feedback = await Feedback.find({ herbId: req.params.herbId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name')
      .select('-__v');

    const total = await Feedback.countDocuments({ herbId: req.params.herbId });
    const totalPages = Math.ceil(total / limit);

    // Get average rating
    const ratingStats = await Feedback.getAverageRating(req.params.herbId);

    res.json({
      herb: {
        id: herb._id,
        name: herb.name,
        scientific: herb.scientific
      },
      feedback,
      stats: ratingStats,
      pagination: {
        current: page,
        total: totalPages,
        count: feedback.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('🚨 Get herb feedback error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid herb ID',
        message: 'Please provide a valid herb identifier'
      });
    }

    res.status(500).json({
      error: 'Unable to fetch feedback',
      message: 'Please try again later'
    });
  }
});

// Get user's feedback history
router.get('/my-feedback', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('herbId', 'name scientific imageUrl')
      .select('-__v');

    const total = await Feedback.countDocuments({ userId: req.user._id });
    const totalPages = Math.ceil(total / limit);

    res.json({
      feedback,
      pagination: {
        current: page,
        total: totalPages,
        count: feedback.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('🚨 Get user feedback error:', error);
    res.status(500).json({
      error: 'Unable to fetch your feedback',
      message: 'Please try again later'
    });
  }
});

// Get all feedback (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    let query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .populate('herbId', 'name scientific')
      .select('-__v');

    const total = await Feedback.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get statistics
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      feedback,
      pagination: {
        current: page,
        total: totalPages,
        count: feedback.length,
        totalItems: total
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });

  } catch (error) {
    console.error('🚨 Get all feedback error:', error);
    res.status(500).json({
      error: 'Unable to fetch feedback',
      message: 'Please try again later'
    });
  }
});

// Update feedback status (admin only)
router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: pending, reviewed, resolved'
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('herbId', 'name scientific');

    if (!feedback) {
      return res.status(404).json({
        error: 'Feedback not found',
        message: 'The specified feedback does not exist'
      });
    }

    res.json({
      message: 'Feedback status updated successfully',
      feedback
    });

  } catch (error) {
    console.error('🚨 Update feedback status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid feedback ID',
        message: 'Please provide a valid feedback identifier'
      });
    }

    res.status(500).json({
      error: 'Unable to update feedback status',
      message: 'Please try again later'
    });
  }
});

module.exports = router;