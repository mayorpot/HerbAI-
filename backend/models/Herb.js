const mongoose = require('mongoose');

const herbSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Herb name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Herb name cannot exceed 100 characters']
  },
  scientific: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  benefits: [{
    type: String,
    trim: true,
    maxlength: [100, 'Benefit cannot exceed 100 characters']
  }],
  conditions: [{
    type: String,
    trim: true,
    maxlength: [100, 'Condition cannot exceed 100 characters']
  }],
  imageUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i, 'Please provide a valid image URL']
  },
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

// Compound index for search functionality
herbSchema.index({ name: 'text', description: 'text', benefits: 'text' });
herbSchema.index({ conditions: 1 });
herbSchema.index({ isActive: 1 });

// Static method for search
herbSchema.statics.searchHerbs = function(query) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { benefits: { $regex: query, $options: 'i' } },
          { conditions: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  });
};

// Static method to get herbs by condition
herbSchema.statics.findByCondition = function(condition) {
  return this.find({
    isActive: true,
    conditions: { $regex: condition, $options: 'i' }
  });
};

module.exports = mongoose.model('Herb', herbSchema);