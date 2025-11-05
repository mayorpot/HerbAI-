// backend/routes/auth.js
const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, healthProfile } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User exists',
        message: 'A user with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      healthProfile: healthProfile || {}
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          healthProfile: user.healthProfile
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Incorrect email or password'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          healthProfile: user.healthProfile,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // This route should be protected by auth middleware
    const user = await User.findById(req.user._id);
    
    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          healthProfile: user.healthProfile,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(400).json({
      error: 'Failed to get user',
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, healthProfile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        ...(name && { name }),
        ...(healthProfile && { healthProfile })
      },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          healthProfile: user.healthProfile
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

module.exports = router;