# ACK Mt. Kenya Guest House - Backend Server

This is the backend server for the ACK Mt. Kenya Guest House booking system, built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ack-guesthouse
# For MongoDB Atlas: Use your connection string from Atlas dashboard, e.g. mongodb+srv://<username>:<password>@cluster.mongodb.net/ack-guesthouse

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration (Choose one)
RESEND_API_KEY=re_your_resend_api_key_here
# OR
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=bookings@ackguesthouse.com

# Admin
ADMIN_EMAIL=manager@ackguesthouse.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, just ensure your connection string is correct
```

5. **Seed the database**
```bash
npm run seed
```

6. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Collections

#### Rooms
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  capacity: Number,
  amenities: [String],
  image_url: String,
  pricing: {
    bed_only: Number,
    bb: Number,
    half_board: Number,
    full_board: Number
  },
  available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Bookings
```javascript
{
  _id: ObjectId,
  room: ObjectId (ref: Room),
  guest_name: String,
  guest_email: String,
  guest_phone: String,
  check_in_date: Date,
  check_out_date: Date,
  number_of_guests: Number,
  meal_plan: String, // 'bed_only', 'bb', 'half_board', 'full_board'
  special_requests: String,
  status: String, // 'pending', 'confirmed', 'cancelled', 'completed'
  total_amount: Number,
  deposit_amount: Number,
  deposit_paid: Boolean,
  balance_amount: Number,
  payment_status: String, // 'pending_deposit', 'deposit_paid', 'fully_paid'
  createdAt: Date,
  updatedAt: Date
}
```

#### Payments
```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: Booking),
  amount: Number,
  payment_type: String, // 'deposit', 'balance', 'full'
  payment_method: String, // 'mpesa', 'cash', 'cheque', 'bank_transfer'
  payment_reference: String,
  status: String, // 'pending', 'completed', 'failed', 'refunded'
  paid_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Contacts
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String, // 'new', 'read', 'replied'
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠 API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms with availability check
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms/:id/check-availability` - Check room availability

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status

### Payments
- `POST /api/payments` - Record new payment
- `GET /api/payments/booking/:bookingId` - Get payments for booking
- `GET /api/payments/:id` - Get payment by ID
- `PUT /api/payments/:id/status` - Update payment status

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all contacts (admin)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/bookings` - Get all bookings with filters

## 🔧 MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB**
```bash
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Windows - Download from https://www.mongodb.com/try/download/community
```

2. **Start MongoDB**
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

3. **Connect to MongoDB**
```bash
mongo
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to you

3. **Setup Database User**
   - Go to Database Access
   - Add new database user
   - Choose password authentication

4. **Setup Network Access**
   - Go to Network Access
   - Add IP address (0.0.0.0/0 for development)

5. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

### Database Indexes (Automatic)

The application automatically creates these indexes for better performance:

```javascript
// Rooms
{ available: 1 }
{ name: 1 }

// Bookings
{ room: 1, check_in_date: 1, check_out_date: 1 }
{ guest_email: 1 }
{ status: 1 }
{ payment_status: 1 }

// Payments
{ booking: 1 }
{ status: 1 }
{ payment_type: 1 }

// Contacts
{ status: 1 }
{ createdAt: -1 }
```

## 📧 Email Configuration

### Option 1: Resend (Recommended)
```env
RESEND_API_KEY=re_your_api_key_here
```

### Option 2: SendGrid
```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=bookings@ackguesthouse.com
```

### Option 3: Gmail (Development Only)
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevents abuse
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Express-validator
- **JWT Authentication** - For admin routes
- **Password Hashing** - bcryptjs

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secure-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

### PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start server.js --name "ack-guesthouse-api"
pm2 startup
pm2 save
```

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get rooms
curl http://localhost:5000/api/rooms

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": "ROOM_ID_HERE",
    "guest_name": "John Doe",
    "guest_email": "john@example.com",
    "guest_phone": "+254712345678",
    "check_in_date": "2025-02-01",
    "check_out_date": "2025-02-03",
    "number_of_guests": 2,
    "meal_plan": "bb"
  }'
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string
   - Check network access (for Atlas)

2. **Email Not Sending**
   - Verify API keys
   - Check spam folder
   - Review email service logs

3. **CORS Errors**
   - Update CLIENT_URL in .env
   - Check frontend URL

4. **Port Already in Use**
   - Change PORT in .env
   - Kill process: `lsof -ti:5000 | xargs kill -9`

### Logs
```bash
# View server logs
tail -f logs/server.log

# PM2 logs
pm2 logs ack-guesthouse-api
```

## 📞 Support

For technical support or questions:
- Email: josekeam01@gmail.com
- Phone: +254 720 577 442

## 📄 License

This project is licensed under the MIT License.