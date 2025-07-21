# ACK Mt. Kenya Guest House Website – Nyeri, Kenya

Welcome to the official repository of the **ACK Mt. Kenya Guest House Website**, a modern web application developed for a guest house located in **Nyeri Town, Kenya**. The website showcases accommodation options, booking system, contact information, and more—built with performance and scalability in mind.

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
- 📅 Online booking system with Supabase backend
- 📸 Visual gallery of rooms and amenities
- 📍 Location information with interactive map
- 📱 Responsive design for mobile, tablet, and desktop
- ⚡ Fast-loading SPA with modern performance optimization
- 💬 WhatsApp integration for instant communication
- 🔒 Secure booking management with row-level security

---

## 🧰 Tech Stack

| Tool/Framework     | Purpose                             |
|--------------------|-------------------------------------|
| [React](https://react.dev/)        | Frontend UI library               |
| [TypeScript](https://www.typescriptlang.org/)   | Type-safe JavaScript development |
| [Vite](https://vitejs.dev/)        | Lightning-fast dev/build tooling |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Supabase](https://supabase.com/)  | Backend database and authentication |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Beautiful icon library |

---

## 🗄️ Database Schema

The application uses Supabase with the following tables:

### Rooms Table
- `id` (text, primary key)
- `name` (text) - Room name
- `description` (text) - Room description
- `price` (integer) - Price per night in KSh
- `capacity` (integer) - Maximum guests
- `amenities` (text array) - List of amenities
- `image_url` (text) - Room image URL
- `created_at` / `updated_at` (timestamps)

### Bookings Table
- `id` (uuid, primary key)
- `room_id` (text, foreign key to rooms)
- `guest_name`, `guest_email`, `guest_phone` (text)
- `check_in_date`, `check_out_date` (date)
- `number_of_guests` (integer)
- `special_requests` (text, optional)
- `status` (enum: pending, confirmed, cancelled, completed)
- `total_amount` (integer)
- `created_at` / `updated_at` (timestamps)

### Database Functions
- `check_room_availability()` - Checks if a room is available for given dates

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Joseph9866/ACK_guest_house_website.git
cd ACK_guest_house_website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**
- Create a new Supabase project
- Run the migration file in `supabase/migrations/` in your Supabase SQL editor
- This will create the rooms and bookings tables with sample data

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookingForm.tsx
│   ├── ContactForm.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── hooks/              # Custom React hooks
│   ├── useRooms.ts
│   ├── useBookings.ts
│   └── useContacts.ts
├── lib/                # External service configurations
│   ├── supabase.ts
│   └── database.ts
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Rooms.tsx
│   ├── Gallery.tsx
│   ├── Booking.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── utils/              # Utility functions and types
│   ├── types.ts
│   ├── constants.ts
│   └── helpers.ts
└── App.tsx             # Main application component
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
- Real-time room availability checking
- Form validation and error handling
- WhatsApp integration for instant booking
- Booking status management

### Room Management
- Dynamic room listing from database
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

- Row Level Security (RLS) enabled on all tables
- Input validation and sanitization
- Secure environment variable handling
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
- Backend powered by [Supabase](https://supabase.com)