const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { adminAuth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Contact = require('../models/Contact');
const Payment = require('../models/Payment');

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const { username, password } = req.body;

    // Simple hardcoded admin credentials (in production, use database)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const payload = {
      user: {
        id: 'admin',
        username: adminUsername,
        role: 'admin'
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        username: adminUsername,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Get statistics
    const [
      totalBookings,
      monthlyBookings,
      yearlyBookings,
      pendingBookings,
      confirmedBookings,
      totalRooms,
      availableRooms,
      totalContacts,
      unreadContacts,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ createdAt: { $gte: startOfYear } }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Room.countDocuments(),
      Room.countDocuments({ available: true }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: startOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('room', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('guest_name guest_email check_in_date check_out_date status total_amount createdAt');

    res.json({
      success: true,
      data: {
        statistics: {
          bookings: {
            total: totalBookings,
            monthly: monthlyBookings,
            yearly: yearlyBookings,
            pending: pendingBookings,
            confirmed: confirmedBookings
          },
          rooms: {
            total: totalRooms,
            available: availableRooms,
            occupied: totalRooms - availableRooms
          },
          contacts: {
            total: totalContacts,
            unread: unreadContacts
          },
          revenue: {
            total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
            monthly: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0
          }
        },
        recentBookings
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters
// @access  Private (Admin)
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { guest_name: { $regex: search, $options: 'i' } },
        { guest_email: { $regex: search, $options: 'i' } },
        { guest_phone: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'room',
        select: 'name'
      }
    };

    const bookings = await Booking.find(query)
      .populate(options.populate.path, options.populate.select)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

module.exports = router;