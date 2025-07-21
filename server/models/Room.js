const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  image_url: {
    type: String,
    trim: true
  },
  pricing: {
    bed_only: {
      type: Number,
      required: [true, 'Bed only price is required'],
      min: [0, 'Price cannot be negative']
    },
    bb: {
      type: Number,
      required: [true, 'Bed & breakfast price is required'],
      min: [0, 'Price cannot be negative']
    },
    half_board: {
      type: Number,
      required: [true, 'Half board price is required'],
      min: [0, 'Price cannot be negative']
    },
    full_board: {
      type: Number,
      required: [true, 'Full board price is required'],
      min: [0, 'Price cannot be negative']
    }
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
roomSchema.index({ available: 1 });
roomSchema.index({ name: 1 });

module.exports = mongoose.model('Room', roomSchema);