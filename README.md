# ACK Mt. Kenya Guest House Website – Nyeri, Kenya

Welcome to the official repository of the **ACK Mt. Kenya Guest House Website**, a modern web application for a guest house in **Nyeri Town, Kenya**. The website features accommodation listings, a booking system, contact information, and more—built for performance and scalability using the MERN stack (Supabase, Express, React, Node.js).

Access the website using
https://ackweb.vercel.app/

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
- 🔒 Secure booking management with authentication and validation

---

## 🧰 Tech Stack

| Tool/Framework     | Purpose                             |
|--------------------|-------------------------------------|
| [React](https://react.dev/)        | Frontend UI library               |
| [TypeScript](https://www.typescriptlang.org/)   | Type-safe JavaScript development |
| [Vite](https://vitejs.dev/)        | Lightning-fast dev/build tooling |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Supabase](https://supabase.com/) | Backend-as-a-Service (PostgreSQL, Auth, Storage) |
| [Express](https://expressjs.com/)  | Backend API framework |
| [Node.js](https://nodejs.org/)     | Server runtime |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Beautiful icon library |

---

## 🗄️ Database Schema

The application uses Supabase with the following tables:

### Rooms Table
- `id` (UUID, primary key)
- `name` (text) - Room name
- `description` (text) - Room description
- `price` (float) - Price per night in KSh
- `capacity` (integer) - Maximum guests
- `amenities` (text[]) - List of amenities
- `imageUrls` (text[]) - Room image URLs
- `created_at` / `updated_at` (timestamp)

### Bookings Table
- `id` (UUID, primary key)
- `room_id` (UUID, foreign key reference to rooms)
- `guest_name`, `guest_email`, `guest_phone` (text)
- `check_in_date`, `check_out_date` (timestamp)
- `num_guests` (integer)
- `special_requests` (text, optional)
- `status` (text: pending, confirmed, cancelled, completed)
- `total_amount` (float)
- `created_at` / `updated_at` (timestamp)

### Other Tables
- Contacts, Payments, Admins, etc. as needed

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Joseph9866/ackMERNweb
.git
cd ackMERNweb
