// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        error: 'Not authorized',
        message: 'Please log in to access this resource'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'alba-secret-key');
    
    // Get user from token
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Not authorized',
        message: 'User no longer exists'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'Not authorized',
      message: 'Invalid token'
    });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'alba-secret-key', {
    expiresIn: '30d',
  });
};

module.exports = { protect, generateToken };