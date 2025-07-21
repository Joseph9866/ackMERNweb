const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const router = express.Router();

// @route   POST /api/payments
// @desc    Create a new payment
// @access  Public (in production, add authentication)
router.post('/', [
  body('booking_id').isMongoId().withMessage('Valid booking ID is required'),
  body('amount').isNumeric().isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('payment_type').isIn(['deposit', 'balance', 'full']).withMessage('Valid payment type is required'),
  body('payment_method').isIn(['mpesa', 'cash', 'cheque', 'bank_transfer']).withMessage('Valid payment method is required'),
  body('payment_reference').optional().trim().isLength({ min: 1 }).withMessage('Payment reference cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { booking_id, amount, payment_type, payment_method, payment_reference } = req.body;

    // Check if booking exists
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate payment amount
    if (payment_type === 'deposit' && amount !== booking.deposit_amount) {
      return res.status(400).json({
        success: false,
        message: `Deposit amount should be KSh ${booking.deposit_amount.toLocaleString()}`
      });
    }

    if (payment_type === 'balance' && amount !== booking.balance_amount) {
      return res.status(400).json({
        success: false,
        message: `Balance amount should be KSh ${booking.balance_amount.toLocaleString()}`
      });
    }

    if (payment_type === 'full' && amount !== booking.total_amount) {
      return res.status(400).json({
        success: false,
        message: `Full payment amount should be KSh ${booking.total_amount.toLocaleString()}`
      });
    }

    // Create payment
    const payment = new Payment({
      booking: booking_id,
      amount,
      payment_type,
      payment_method,
      payment_reference,
      status: 'completed', // In production, this might start as 'pending'
      paid_at: new Date()
    });

    await payment.save();

    // Update booking payment status
    const totalPaid = await Payment.aggregate([
      { $match: { booking: booking._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalPaidAmount = totalPaid.length > 0 ? totalPaid[0].total : 0;

    if (totalPaidAmount >= booking.total_amount) {
      booking.payment_status = 'fully_paid';
      booking.deposit_paid = true;
      booking.balance_amount = 0;
    } else if (totalPaidAmount >= booking.deposit_amount) {
      booking.payment_status = 'deposit_paid';
      booking.deposit_paid = true;
      booking.balance_amount = booking.total_amount - totalPaidAmount;
    }

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment'
    });
  }
});

// @route   GET /api/payments/booking/:bookingId
// @desc    Get payments for a specific booking
// @access  Public (in production, add authentication)
router.get('/booking/:bookingId', async (req, res) => {
  try {
    const payments = await Payment.find({ booking: req.params.bookingId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payments'
    });
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Public (in production, add authentication)
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('booking');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment'
    });
  }
});

// @route   PUT /api/payments/:id/status
// @desc    Update payment status
// @access  Public (in production, add authentication)
router.put('/:id/status', [
  body('status').isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        paid_at: req.body.status === 'completed' ? new Date() : null
      },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status'
    });
  }
});

module.exports = router;