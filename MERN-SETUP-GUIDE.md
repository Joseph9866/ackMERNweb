# ACK Mt. Kenya Guest House - MERN Stack Setup Guide

This guide will help you set up the complete MERN (MongoDB, Express, React, Node.js) stack for the ACK Mt. Kenya Guest House booking system.

## 🏗️ Architecture Overview

```
Frontend (React + TypeScript + Vite)
    ↓ HTTP Requests
Backend (Node.js + Express)
    ↓ Database Queries
Database (MongoDB)
```

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or Atlas account) - [Setup guide below](#mongodb-setup)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd ack-guest-house

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration

**Frontend (.env)**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env)**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ack-guesthouse

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (choose one)
RESEND_API_KEY=re_your_resend_api_key_here
# OR
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=bookings@ackguesthouse.com

# Admin
ADMIN_EMAIL=manager@ackguesthouse.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# CORS
CLIENT_URL=http://localhost:5173
```

### 3. Database Setup

Choose one of these options:

#### Option A: Local MongoDB

1. **Install MongoDB**
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Windows - Download installer from https://www.mongodb.com/try/download/community
```

2. **Start MongoDB**
```bash
# macOS/Linux
sudo systemctl start mongod
# OR
mongod

# Windows
net start MongoDB
```

3. **Verify Installation**
```bash
mongo --version
```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Create" → "Shared" (Free tier)
   - Choose cloud provider and region
   - Click "Create Cluster"

3. **Setup Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Set role to "Atlas Admin" (for development)

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in `server/.env`

### 4. Seed Database

```bash
cd server
npm run seed
```

This will create sample rooms in your database.

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# From project root
npm run dev
```

Your application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🗄️ Database Schema

### MongoDB Collections

#### 1. Rooms Collection
```javascript
{
  _id: ObjectId("..."),
  name: "Single Room",
  description: "Ideal for solo travelers...",
  capacity: 1,
  amenities: ["TV", "Desk", "Free Wi-Fi"],
  image_url: "Images/ACKbed.jpeg",
  pricing: {
    bed_only: 1000,
    bb: 1200,
    half_board: 2500,
    full_board: 3500
  },
  available: true,
  createdAt: ISODate("2025-01-01T00:00:00.000Z"),
  updatedAt: ISODate("2025-01-01T00:00:00.000Z")
}
```

#### 2. Bookings Collection
```javascript
{
  _id: ObjectId("..."),
  room: ObjectId("..."), // Reference to rooms collection
  guest_name: "John Doe",
  guest_email: "john@example.com",
  guest_phone: "+254712345678",
  check_in_date: ISODate("2025-02-01T00:00:00.000Z"),
  check_out_date: ISODate("2025-02-03T00:00:00.000Z"),
  number_of_guests: 2,
  meal_plan: "bb", // bed_only, bb, half_board, full_board
  special_requests: "Late check-in requested",
  status: "pending", // pending, confirmed, cancelled, completed
  total_amount: 2400,
  deposit_amount: 1200, // 50% of total
  deposit_paid: false,
  balance_amount: 2400,
  payment_status: "pending_deposit",
  createdAt: ISODate("2025-01-01T00:00:00.000Z"),
  updatedAt: ISODate("2025-01-01T00:00:00.000Z")
}
```

#### 3. Payments Collection
```javascript
{
  _id: ObjectId("..."),
  booking: ObjectId("..."), // Reference to bookings collection
  amount: 1200,
  payment_type: "deposit", // deposit, balance, full
  payment_method: "mpesa", // mpesa, cash, cheque, bank_transfer
  payment_reference: "ABC123XYZ",
  status: "completed", // pending, completed, failed, refunded
  paid_at: ISODate("2025-01-01T10:30:00.000Z"),
  createdAt: ISODate("2025-01-01T10:30:00.000Z"),
  updatedAt: ISODate("2025-01-01T10:30:00.000Z")
}
```

#### 4. Contacts Collection
```javascript
{
  _id: ObjectId("..."),
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "+254712345678",
  subject: "Room Inquiry",
  message: "I would like to know about availability...",
  status: "new", // new, read, replied
  createdAt: ISODate("2025-01-01T00:00:00.000Z"),
  updatedAt: ISODate("2025-01-01T00:00:00.000Z")
}
```

### Database Indexes

MongoDB automatically creates these indexes for better performance:

```javascript
// Rooms
db.rooms.createIndex({ "available": 1 })
db.rooms.createIndex({ "name": 1 })

// Bookings
db.bookings.createIndex({ "room": 1, "check_in_date": 1, "check_out_date": 1 })
db.bookings.createIndex({ "guest_email": 1 })
db.bookings.createIndex({ "status": 1 })
db.bookings.createIndex({ "payment_status": 1 })

// Payments
db.payments.createIndex({ "booking": 1 })
db.payments.createIndex({ "status": 1 })

// Contacts
db.contacts.createIndex({ "status": 1 })
db.contacts.createIndex({ "createdAt": -1 })
```

## 🔧 MongoDB Commands

### Basic MongoDB Operations

```bash
# Connect to MongoDB
mongo

# Or if using authentication
mongo -u username -p password

# Show databases
show dbs

# Use specific database
use ack-guesthouse

# Show collections
show collections

# Find all rooms
db.rooms.find().pretty()

# Find available rooms
db.rooms.find({ available: true }).pretty()

# Find bookings for a specific room
db.bookings.find({ room: ObjectId("room_id_here") }).pretty()

# Count total bookings
db.bookings.countDocuments()

# Find pending bookings
db.bookings.find({ status: "pending" }).pretty()

# Aggregate total revenue
db.payments.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: null, total: { $sum: "$amount" } } }
])
```

### Useful Queries

```javascript
// Find bookings with room details
db.bookings.aggregate([
  {
    $lookup: {
      from: "rooms",
      localField: "room",
      foreignField: "_id",
      as: "room_details"
    }
  },
  { $unwind: "$room_details" },
  { $limit: 5 }
])

// Find rooms with booking count
db.rooms.aggregate([
  {
    $lookup: {
      from: "bookings",
      localField: "_id",
      foreignField: "room",
      as: "bookings"
    }
  },
  {
    $project: {
      name: 1,
      booking_count: { $size: "$bookings" }
    }
  }
])

// Monthly booking statistics
db.bookings.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" }
      },
      count: { $sum: 1 },
      revenue: { $sum: "$total_amount" }
    }
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } }
])
```

## 🧪 Testing the Setup

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Get all rooms
curl http://localhost:5000/api/rooms

# Create a test booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": "ROOM_ID_FROM_DATABASE",
    "guest_name": "Test User",
    "guest_email": "test@example.com",
    "guest_phone": "+254712345678",
    "check_in_date": "2025-02-01",
    "check_out_date": "2025-02-03",
    "number_of_guests": 2,
    "meal_plan": "bb"
  }'
```

### 2. Test Frontend

1. Open http://localhost:5173
2. Navigate through different pages
3. Try making a booking
4. Submit a contact form

## 📧 Email Configuration

### Option 1: Resend (Recommended)

1. **Sign up at [Resend](https://resend.com)**
2. **Get API Key**
   - Go to API Keys section
   - Create new API key
   - Copy the key (starts with `re_`)

3. **Update server/.env**
```env
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAIL=your-email@example.com
```

### Option 2: SendGrid

1. **Sign up at [SendGrid](https://sendgrid.com)**
2. **Get API Key**
   - Go to Settings → API Keys
   - Create new API key
   - Copy the key (starts with `SG.`)

3. **Update server/.env**
```env
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=bookings@yourdomain.com
ADMIN_EMAIL=your-email@example.com
```

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Environment Variables**
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secure-production-secret
CLIENT_URL=https://your-frontend-domain.com
```

2. **Build Command**: `npm install`
3. **Start Command**: `npm start`

### Frontend Deployment (Netlify/Vercel)

1. **Environment Variables**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Make sure MongoDB is running
   ```bash
   # Start MongoDB
   sudo systemctl start mongod
   # OR
   mongod
   ```

2. **CORS Error**
   ```
   Access to fetch at 'http://localhost:5000/api/rooms' from origin 'http://localhost:5173' has been blocked by CORS policy
   ```
   **Solution**: Check `CLIENT_URL` in `server/.env`

3. **Port Already in Use**
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   **Solution**: Kill the process or change port
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Or change PORT in server/.env
   PORT=5001
   ```

4. **Email Not Sending**
   - Check API keys are correct
   - Verify email service is configured
   - Check spam folder

### Debug Commands

```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo journalctl -u mongod

# Check if ports are open
netstat -tulpn | grep :5000
netstat -tulpn | grep :27017

# Test MongoDB connection
mongo --eval "db.adminCommand('ismaster')"
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose ODM](https://mongoosejs.com/docs/)

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** in your terminal
2. **Verify environment variables** are set correctly
3. **Test API endpoints** individually
4. **Check database connection** and data

For technical support:
- Email: josekeam01@gmail.com
- Phone: +254 720 577 442

---

**🎉 Congratulations! You now have a fully functional MERN stack application for ACK Mt. Kenya Guest House!**