const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { sendBookingNotification } = require('../utils/emailService');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', [
  body('room_id').isMongoId().withMessage('Valid room ID is required'),
  body('guest_name').trim().isLength({ min: 2 }).withMessage('Guest name must be at least 2 characters'),
  body('guest_email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('guest_phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('check_in_date').isISO8601().withMessage('Valid check-in date is required'),
  body('check_out_date').isISO8601().withMessage('Valid check-out date is required'),
  body('number_of_guests').isInt({ min: 1 }).withMessage('At least 1 guest is required')
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

    const {
      room_id,
      guest_name,
      guest_email,
      guest_phone,
      check_in_date,
      check_out_date,
      number_of_guests,
      special_requests
    } = req.body;

    // 🔍 Log received booking payload
    console.log('Booking payload received:', req.body);

    const checkInDate = new Date(check_in_date);
    const checkOutDate = new Date(check_out_date);

    // Validate dates
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    // Check if room exists
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check room availability
    const conflictingBooking = await Booking.findOne({
      room: room_id,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          check_in_date: { $lte: checkInDate },
          check_out_date: { $gt: checkInDate }
        },
        {
          check_in_date: { $lt: checkOutDate },
          check_out_date: { $gte: checkOutDate }
        },
        {
          check_in_date: { $gte: checkInDate },
          check_out_date: { $lte: checkOutDate }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Room is not available for the selected dates'
      });
    }

    // Calculate total amount
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const roomPrice = room.bed_only || room.price;
    const totalAmount = nights * roomPrice;
    if (isNaN(totalAmount)) {
      return res.status(400).json({ success: false, message: 'Invalid room price or dates.' });
    }

    // Create booking
    const booking = new Booking({
      room: room_id,
      guest_name,
      guest_email,
      guest_phone,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_guests,
      special_requests,
      total_amount: totalAmount
    });

    await booking.save();
    await booking.populate('room');

    // Send notification email (don't wait for it)
    sendBookingNotification(booking).catch(error => {
      console.error('Failed to send booking notification:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Public
router.put('/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Valid status is required')
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

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate('room');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
});

module.exports = router;