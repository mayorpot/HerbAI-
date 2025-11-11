const { body, validationResult } = require('express-validator');

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

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .escape(),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Herb validation rules
const validateHerb = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Herb name must be between 2 and 100 characters')
    .escape(),
  
  body('scientific')
    .optional()
    .trim()
    .escape(),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters')
    .escape(),
  
  body('benefits')
    .isArray({ min: 1 })
    .withMessage('At least one benefit is required'),
  
  body('conditions')
    .isArray({ min: 1 })
    .withMessage('At least one condition is required'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
  
  handleValidationErrors
];

// Feedback validation rules
const validateFeedback = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters')
    .escape(),
  
  body('herbId')
    .optional()
    .isMongoId()
    .withMessage('Valid herb ID is required'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateHerb,
  validateFeedback,
  handleValidationErrors
};