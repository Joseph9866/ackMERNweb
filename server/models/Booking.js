const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  guest_name: {
    type: String,
    required: true,
    trim: true
  },
  guest_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Invalid email address']
  },
  guest_phone: {
    type: String,
    required: true,
    trim: true
  },
  check_in_date: {
    type: Date,
    required: true
  },
  check_out_date: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.check_in_date;
      },
      message: 'Check-out date must be after check-in date.'
    }
  },
  number_of_guests: {
    type: Number,
    required: true,
    min: 1
  },
  meal_plan: {
    type: String,
    enum: ['bed_only', 'bb', 'half_board', 'full_board'],
    default: 'bed_only'
  },
  special_requests: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  deposit_amount: {
    type: Number,
    min: 0
  },
  deposit_paid: {
    type: Boolean,
    default: false
  },
  balance_amount: {
    type: Number,
    min: 0
  },
  payment_status: {
    type: String,
    enum: ['pending_deposit', 'deposit_paid', 'fully_paid'],
    default: 'pending_deposit'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: calculate number of nights
bookingSchema.virtual('nights').get(function () {
  return Math.ceil((this.check_out_date - this.check_in_date) / (1000 * 60 * 60 * 24));
});

// Middleware: auto-calculate deposit and balance
bookingSchema.pre('save', function (next) {
  if (this.isModified('total_amount') || this.isNew) {
    this.deposit_amount = Math.ceil((this.total_amount * 0.5) / 50) * 50;
    this.balance_amount = this.total_amount - (this.deposit_paid ? this.deposit_amount : 0);
  }
  next();
});

// Indexing for performance
bookingSchema.index({ room: 1, check_in_date: 1, check_out_date: 1 });
bookingSchema.index({ guest_email: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ payment_status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);