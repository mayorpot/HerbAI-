const express = require('express');
const { body, validationResult } = require('express-validator');
const Condition = require('../models/Condition');
const Herb = require('../models/Herb');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input data',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Condition validation rules - ONLY ONCE!
const validateCondition = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Condition name must be between 2 and 100 characters')
    .escape(),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
    .escape(),
  
  body('symptoms')
    .isArray({ min: 1 })
    .withMessage('At least one symptom is required'),
  
  body('severity')
    .isIn(['mild', 'moderate', 'severe'])
    .withMessage('Severity must be mild, moderate, or severe'),
  
  handleValidationErrors
];

// Get all conditions with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const severity = req.query.severity || '';
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { symptoms: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by severity
    if (severity) {
      query.severity = severity;
    }

    const conditions = await Condition.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .populate('recommendedHerbs', 'name scientific description benefits')
      .populate('createdBy', 'name email');

    const total = await Condition.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      conditions,
      pagination: {
        current: page,
        total: totalPages,
        count: conditions.length,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('🚨 Get conditions error:', error);
    res.status(500).json({
      error: 'Unable to fetch conditions',
      message: 'Please try again later'
    });
  }
});

// Get single condition by ID
router.get('/:id', async (req, res) => {
  try {
    const condition = await Condition.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
      .populate('recommendedHerbs', 'name scientific description benefits conditions imageUrl')
      .populate('createdBy', 'name email');

    if (!condition) {
      return res.status(404).json({
        error: 'Condition not found',
        message: 'The requested condition does not exist or has been removed'
      });
    }

    res.json({ condition });

  } catch (error) {
    console.error('🚨 Get condition error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid condition ID',
        message: 'Please provide a valid condition identifier'
      });
    }

    res.status(500).json({
      error: 'Unable to fetch condition',
      message: 'Please try again later'
    });
  }
});

// Create new condition (admin only)
router.post('/', auth, adminAuth, validateCondition, async (req, res) => {
  try {
    const conditionData = {
      ...req.body,
      createdBy: req.user._id
    };

    const condition = new Condition(conditionData);
    await condition.save();

    await condition.populate('recommendedHerbs', 'name scientific description');
    await condition.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Condition created successfully',
      condition
    });

  } catch (error) {
    console.error('🚨 Create condition error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Condition already exists',
        message: 'A condition with this name already exists'
      });
    }

    res.status(500).json({
      error: 'Unable to create condition',
      message: 'Please try again later'
    });
  }
});

// Update condition (admin only)
router.put('/:id', auth, adminAuth, validateCondition, async (req, res) => {
  try {
    const condition = await Condition.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('recommendedHerbs', 'name scientific description')
      .populate('createdBy', 'name email');

    if (!condition) {
      return res.status(404).json({
        error: 'Condition not found',
        message: 'The requested condition does not exist or has been removed'
      });
    }

    res.json({
      message: 'Condition updated successfully',
      condition
    });

  } catch (error) {
    console.error('🚨 Update condition error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid condition ID',
        message: 'Please provide a valid condition identifier'
      });
    }

    res.status(500).json({
      error: 'Unable to update condition',
      message: 'Please try again later'
    });
  }
});

// Delete condition (soft delete - admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const condition = await Condition.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!condition) {
      return res.status(404).json({
        error: 'Condition not found',
        message: 'The requested condition does not exist or has been removed'
      });
    }

    res.json({
      message: 'Condition deleted successfully',
      condition: { id: condition._id, name: condition.name }
    });

  } catch (error) {
    console.error('🚨 Delete condition error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid condition ID',
        message: 'Please provide a valid condition identifier'
      });
    }

    res.status(500).json({
      error: 'Unable to delete condition',
      message: 'Please try again later'
    });
  }
});

// Search conditions by symptom
router.get('/search/symptom', async (req, res) => {
  try {
    const { symptom } = req.query;
    
    if (!symptom) {
      return res.status(400).json({
        error: 'Symptom required',
        message: 'Please provide a symptom to search for'
      });
    }

    const conditions = await Condition.findBySymptom(symptom);
    
    res.json({
      symptom,
      conditions,
      count: conditions.length
    });

  } catch (error) {
    console.error('🚨 Search by symptom error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'Please try again later'
    });
  }
});

// Get conditions by severity
router.get('/severity/:level', async (req, res) => {
  try {
    const { level } = req.params;
    
    if (!['mild', 'moderate', 'severe'].includes(level)) {
      return res.status(400).json({
        error: 'Invalid severity level',
        message: 'Severity must be mild, moderate, or severe'
      });
    }

    const conditions = await Condition.find({ 
      severity: level, 
      isActive: true 
    })
      .populate('recommendedHerbs', 'name scientific description')
      .sort({ name: 1 });

    res.json({
      severity: level,
      conditions,
      count: conditions.length
    });

  } catch (error) {
    console.error('🚨 Get conditions by severity error:', error);
    res.status(500).json({
      error: 'Unable to fetch conditions',
      message: 'Please try again later'
    });
  }
});

module.exports = router;