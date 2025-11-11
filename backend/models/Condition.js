const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Condition name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Condition name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  symptoms: [{
    type: String,
    trim: true,
    maxlength: [100, 'Symptom cannot exceed 100 characters']
  }],
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'mild'
  },
  recommendedHerbs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Herb'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for search functionality
conditionSchema.index({ name: 'text', description: 'text', symptoms: 'text' });
conditionSchema.index({ severity: 1 });
conditionSchema.index({ isActive: 1 });

// Static method for search
conditionSchema.statics.searchConditions = function(query) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { symptoms: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  });
};

// Static method to find conditions by symptom
conditionSchema.statics.findBySymptom = function(symptom) {
  return this.find({
    isActive: true,
    symptoms: { $regex: symptom, $options: 'i' }
  }).populate('recommendedHerbs', 'name scientific description');
};

module.exports = mongoose.model('Condition', conditionSchema);