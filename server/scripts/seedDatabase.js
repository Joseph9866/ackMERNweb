const mongoose = require('mongoose');
require('dotenv').config();

const Room = require('../models/Room');
const connectDB = require('../config/database');

const rooms = [
  {
    name: 'Single Room',
    description: 'Ideal for solo travelers. Includes one bed and access to essential amenities.',
    capacity: 1,
    amenities: ['TV', 'Desk', 'Free Wi-Fi'],
    image_url: 'Images/ACKbed.jpeg',
    pricing: {
      bed_only: 1000,
      bb: 1200,
      half_board: 2500,
      full_board: 3500
    },
    available: true
  },
  {
    name: 'Double Room',
    description: 'Perfect for couples or friends. Comes with a double bed and cozy atmosphere.',
    capacity: 2,
    amenities: ['Desk', 'Wardrobe', 'Private Bathroom', 'Free Wi-Fi', 'TV'],
    image_url: 'Images/ACKbedmain.jpeg',
    pricing: {
      bed_only: 1200,
      bb: 1500,
      half_board: 2800,
      full_board: 4300
    },
    available: true
  },
  {
    name: 'Double Room + Extra Bed',
    description: 'Spacious enough for a small family or group. Includes an additional bed for extra comfort.',
    capacity: 3,
    amenities: ['Desk', 'Wardrobe', 'Private Bathroom', 'Free Wi-Fi', 'TV'],
    image_url: 'Images/ACKbedview.jpeg',
    pricing: {
      bed_only: 2500,
      bb: 2900,
      half_board: 4300,
      full_board: 6300
    },
    available: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Seeding database...');
    
    // Clear existing rooms
    await Room.deleteMany({});
    console.log('✅ Cleared existing rooms');
    
    // Insert new rooms
    const createdRooms = await Room.insertMany(rooms);
    console.log(`✅ Created ${createdRooms.length} rooms`);
    
    console.log('🎉 Database seeded successfully!');
    
    // Display created rooms
    console.log('\n📋 Created Rooms:');
    createdRooms.forEach((room, index) => {
      console.log(`${index + 1}. ${room.name} (ID: ${room._id})`);
      console.log(`   Capacity: ${room.capacity} guests`);
      console.log(`   Bed Only: KSh ${room.pricing.bed_only.toLocaleString()}`);
      console.log(`   Full Board: KSh ${room.pricing.full_board.toLocaleString()}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();