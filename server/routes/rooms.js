const express = require('express');
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

const router = express.Router();

// @route   GET /api/rooms
// @desc    Get all rooms with availability check
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { check_in, check_out } = req.query;
    
    let rooms = await Room.find({ available: true }).sort({ name: 1 });
    
    // If dates provided, check availability
    if (check_in && check_out) {
      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);
      
      // Find conflicting bookings
      const conflictingBookings = await Booking.find({
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
      }).populate('room');
      
      const bookedRoomIds = conflictingBookings.map(booking => booking.room._id.toString());
      
      // Mark rooms as unavailable if booked
      rooms = rooms.map(room => ({
        ...room.toObject(),
        available: !bookedRoomIds.includes(room._id.toString())
      }));
    }
    
    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching rooms'
    });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get single room
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    console.log('Requested ID:', req.params.id);
    let room = await Room.findOne({ _id: req.params.id });
    console.log('Room found by _id:', room);
    if (!room) {
      // Fallback: try to find by name (for debugging)
      room = await Room.findOne({ name: req.params.id });
      console.log('Room found by name:', room);
      if (!room) {
        // Log all room IDs for debugging
        const allRooms = await Room.find({}, { _id: 1, name: 1 });
        console.log('All rooms:', allRooms);
        return res.status(404).json({
          success: false,
          message: 'Room not found',
          debug: {
            requestedId: req.params.id,
            allRooms
          }
        });
      }
    }
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching room'
    });
  }
});

// @route   POST /api/rooms/:id/check-availability
// @desc    Check room availability for specific dates
// @access  Public
router.post('/:id/check-availability', [
  body('check_in_date').isISO8601().withMessage('Valid check-in date is required'),
  body('check_out_date').isISO8601().withMessage('Valid check-out date is required')
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
    
    const { check_in_date, check_out_date } = req.body;
    const roomId = req.params.id;
    
    const checkInDate = new Date(check_in_date);
    const checkOutDate = new Date(check_out_date);
    
    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      room: roomId,
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
    
    const available = !conflictingBooking;
    
    res.json({
      success: true,
      data: {
        available,
        room_id: roomId,
        check_in_date,
        check_out_date
      }
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking availability'
    });
  }
});

module.exports = router;