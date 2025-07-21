const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  payment_type: {
    type: String,
    enum: ['deposit', 'balance', 'full'],
    required: [true, 'Payment type is required']
  },
  payment_method: {
    type: String,
    enum: ['mpesa', 'cash', 'cheque', 'bank_transfer'],
    required: [true, 'Payment method is required']
  },
  payment_reference: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paid_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ booking: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ payment_type: 1 });

module.exports = mongoose.model('Payment', paymentSchema);