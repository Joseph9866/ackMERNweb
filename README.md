# ACK Mt. Kenya Guest House Website – Nyeri, Kenya

Welcome to the official repository of the **ACK Mt. Kenya Guest House Website**, a modern web application for a guest house in **Nyeri Town, Kenya**. The website features accommodation listings, a booking system, contact information, and more—built for performance and scalability using the MERN stack (MongoDB, Express, React, Node.js).

---

## 🌍 About ACK Mt. Kenya Guest House – Nyeri

The **ACK Mt. Kenya Guest House – Nyeri** is a serene, faith-based hospitality facility offering:

- Comfortable and affordable accommodation
- Modern amenities and excellent service
- A calm, secure environment ideal for travelers and organizations
- Strategic location in Nyeri with easy access to local attractions

---

## ✨ Website Features

- 🛏️ Detailed accommodation listings with real-time availability
- 📅 Online booking system with MongoDB backend
- 📸 Visual gallery of rooms and amenities
- 📍 Location information with interactive map
- 📱 Responsive design for mobile, tablet, and desktop
- ⚡ Fast-loading SPA with modern performance optimization
- 💬 WhatsApp integration for instant communication
- 🔒 Secure booking management with authentication and validation

---

## 🧰 Tech Stack

| Tool/Framework     | Purpose                             |
|--------------------|-------------------------------------|
| [React](https://react.dev/)        | Frontend UI library               |
| [TypeScript](https://www.typescriptlang.org/)   | Type-safe JavaScript development |
| [Vite](https://vitejs.dev/)        | Lightning-fast dev/build tooling |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [MongoDB](https://www.mongodb.com/) | NoSQL database |
| [Express](https://expressjs.com/)  | Backend API framework |
| [Node.js](https://nodejs.org/)     | Server runtime |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Beautiful icon library |

---

## 🗄️ Database Schema

The application uses MongoDB with the following collections:

### Rooms Collection
- `_id` (ObjectId, primary key)
- `name` (string) - Room name
- `description` (string) - Room description
- `price` (number) - Price per night in KSh
- `capacity` (number) - Maximum guests
- `amenities` (array of strings) - List of amenities
- `imageUrls` (array of strings) - Room image URLs
- `createdAt` / `updatedAt` (Date)

### Bookings Collection
- `_id` (ObjectId, primary key)
- `roomId` (ObjectId, reference to rooms)
- `guestName`, `guestEmail`, `guestPhone` (string)
- `checkInDate`, `checkOutDate` (Date)
- `numberOfGuests` (number)
- `specialRequests` (string, optional)
- `status` (string: pending, confirmed, cancelled, completed)
- `totalAmount` (number)
- `createdAt` / `updatedAt` (Date)

### Other Collections
- Contacts, Payments, Admins, etc. as needed

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account and cluster

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Joseph9866/ackMERNweb
.git
cd ackMERNweb
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas URI and other required variables:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

4. **Set up MongoDB database**
- Create a new MongoDB Atlas cluster
- Add your connection string to `.env`
- The backend will auto-create collections as needed

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🏗️ Project Structure

```
project/
├── src/                 # Frontend React app
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── utils/
│   └── App.tsx
├── server/              # Backend Express API
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.js
├── public/              # Static assets
├── README.md            # Project documentation
└── ...                  # Other config and setup files
```

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🌐 Deployment

The website can be deployed to various platforms:

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel
1. Import project from GitHub
2. Set framework preset to Vite
3. Add environment variables

---

## 📱 Features in Detail

### Booking System
- Real-time room availability checking (MongoDB)
- Form validation and error handling
- WhatsApp integration for instant booking
- Booking status management

### Room Management
- Dynamic room listing from MongoDB database
- Image galleries with lightbox
- Amenity filtering and display
- Pricing and capacity information

### Contact System
- Contact form with validation
- Multiple contact methods
- Interactive location map
- Business hours and information

---

## 🔒 Security Features

- Input validation and sanitization
- Secure environment variable handling
- JWT authentication for admin routes
- HTTPS enforcement in production

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact

**ACK Mt. Kenya Guest House**
- Phone: +254 759 750 318
- Email: josekeam01@gmail.com
- Location: Nyeri, Kenya

**Developer**
- GitHub: [@Joseph9866](https://github.com/Joseph9866)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Images provided by [Pexels](https://pexels.com)
- Icons by [Lucide](https://lucide.dev)
- Built with [Vite](https://vitejs.dev) and [React](https://react.dev)
- Backend powered by [MongoDB](https://mongodb.com), [Express](https://expressjs.com), and [Node.js](https://nodejs.org)