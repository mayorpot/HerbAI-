const express = require('express');
const User = require('../models/User');
const Herb = require('../models/Herb');
const Feedback = require('../models/Feedback');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users with pagination
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role || 'all';

    let query = {};
    if (role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password -__v');

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        current: page,
        total: totalPages,
        count: users.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('🚨 Get users error:', error);
    res.status(500).json({
      error: 'Unable to fetch users',
      message: 'Please try again later'
    });
  }
});

// Get admin dashboard statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    // Get counts for all major entities
    const [
      totalUsers,
      totalHerbs,
      totalFeedback,
      newUsersThisWeek,
      newHerbsThisWeek
    ] = await Promise.all([
      User.countDocuments(),
      Herb.countDocuments({ isActive: true }),
      Feedback.countDocuments(),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Herb.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        isActive: true
      })
    ]);

    // Get user role distribution
    const userRoles = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get feedback statistics
    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get popular herbs (most feedback)
    const popularHerbs = await Feedback.aggregate([
      {
        $group: {
          _id: '$herbId',
          feedbackCount: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { feedbackCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'herbs',
          localField: '_id',
          foreignField: '_id',
          as: 'herb'
        }
      },
      { $unwind: '$herb' },
      {
        $project: {
          herb: {
            id: '$herb._id',
            name: '$herb.name',
            scientific: '$herb.scientific'
          },
          feedbackCount: 1,
          averageRating: { $round: ['$averageRating', 1] }
        }
      }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalHerbs,
        totalFeedback,
        newUsersThisWeek,
        newHerbsThisWeek
      },
      userRoles: userRoles.reduce((acc, role) => {
        acc[role._id] = role.count;
        return acc;
      }, {}),
      feedbackDistribution: feedbackStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      popularHerbs,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('🚨 Get admin stats error:', error);
    res.status(500).json({
      error: 'Unable to fetch statistics',
      message: 'Please try again later'
    });
  }
});

// Update user role (admin only)
router.patch('/users/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'doctor'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be one of: user, admin, doctor'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: new Date() },
      { new: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });

  } catch (error) {
    console.error('🚨 Update user role error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'Please provide a valid user identifier'
      });
    }

    res.status(500).json({
      error: 'Unable to update user role',
      message: 'Please try again later'
    });
  }
});

// Toggle user active status (admin only)
router.patch('/users/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'isActive must be a boolean value'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, updatedAt: new Date() },
      { new: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });

  } catch (error) {
    console.error('🚨 Update user status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'Please provide a valid user identifier'
      });
    }

    res.status(500).json({
      error: 'Unable to update user status',
      message: 'Please try again later'
    });
  }
});

// Get system health (extended)
router.get('/system-health', auth, adminAuth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    const dbState = mongoose.connection.readyState;
    const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState];
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    // Get database stats
    const dbStats = await mongoose.connection.db.stats();

    // Check memory usage
    const memoryUsage = process.memoryUsage();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        connected: dbState === 1,
        collections: collectionNames,
        stats: {
          collections: dbStats.collections,
          objects: dbStats.objects,
          dataSize: Math.round(dbStats.dataSize / 1024 / 1024) + ' MB',
          storageSize: Math.round(dbStats.storageSize / 1024 / 1024) + ' MB'
        }
      },
      server: {
        uptime: Math.round(process.uptime()) + ' seconds',
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB'
        },
        nodeVersion: process.version,
        platform: process.platform
      },
      environment: process.env.NODE_ENV || 'development'
    });

  } catch (error) {
    console.error('🚨 System health check error:', error);
    res.status(500).json({
      status: 'degraded',
      error: 'Unable to complete system health check',
      message: error.message
    });
  }
});

module.exports = router;