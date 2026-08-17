# 🎬 CineMatrix - Cinema Ticket Booking Platform

**CineMatrix** is a high-concurrency, real-time cinema ticket booking web platform built with Node.js, Express.js, MongoDB (Mongoose), React 18 (Vite), Tailwind CSS, Lucide Icons, and Redux Toolkit.

Built following the **Figma UI/UX Design System Specification & Wireframe Blueprint**.

---

## 🌟 Key Features

- **Dark Cinema UI Aesthetic**: Built using Figma color tokens (`#0B0F19` Surface Primary, `#161F30` Surface Secondary, `#E50914` Brand Accent).
- **JWT Authentication & Authorization**:
  - Secure User Registration & Login with password encryption (`bcryptjs`).
  - Role-Based Access Control (`USER` vs `ADMIN`).
- **Interactive Cinema Seat Matrix**:
  - Top curved screen SVG (*"ALL EYES THIS WAY"*).
  - Tier-segmented seat layout (Standard $200, Premium $350, VIP $500).
  - Real-time seat status indicators (Available, Selected, Held, Sold).
- **10-Minute Database Seat Holds**:
  - Atomic seat locking for 10 minutes preventing double bookings.
  - Background cron worker (`node-cron`) automatically releasing expired seat holds.
- **Pre-order Cinema Concessions & Food Store**:
  - Pre-order Jumbo Popcorn, Sodas, Cheese Nachos, and VIP Combos during checkout.
- **Admin Management Console**:
  - UI modal dialogs for adding new Movies, registering Theatres, and scheduling Showtimes.
- **Single-Page Digital E-Ticket & Receipt Pass**:
  - Perforated ticket card with QR Code entrance scanner.
  - Movie poster image thumbnail, venue details, show timing, and itemized bill breakdown.
  - Single-page print optimization for PDF download (`window.print()`).
- **Personal Watchlist**:
  - Bookmark favorite movies to watch later.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Redux Toolkit, Axios |
| **Backend API** | Node.js, Express.js, CORS, Dotenv, JWT, BcryptJS |
| **Database** | MongoDB + Mongoose Schemas (`User`, `Movie`, `Theatre`, `Show`, `Booking`) |
| **Background Tasks** | Node-Cron (Automatic hold release), Nodemailer |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017/cinematrix` or MongoDB Atlas URI)

### 1. Setup Backend Server
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env if needed
# Default MONGO_URI=mongodb://localhost:27017/cinematrix

# Seed initial database data (Sample movies, theatres, showtimes & test accounts)
npm run seed

# Start Express Development Server
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Setup Frontend Client
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```
The client application will run on `http://localhost:5173`.

---

## 🔑 Test Credentials (Seeded)

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@cinematrix.com` | `adminpassword123` | `ADMIN` |
| **Standard User** | `john@example.com` | `userpassword123` | `USER` |

---

## 📡 REST API Reference

### 🔐 Auth Endpoints (`/api/auth`)
- `POST /api/auth/register` – Register new user or admin
- `POST /api/auth/login` – Login and obtain JWT token
- `GET /api/auth/me` – Fetch current user profile (Protected)
- `GET /api/auth/users` – List all users (Admin only)

### 🍿 Movie Catalog (`/api/movies`)
- `GET /api/movies` – List active movies
- `GET /api/movies/:id` – Fetch movie by ID
- `POST /api/movies` – Add movie (Admin only)
- `PUT /api/movies/:id` – Update movie (Admin only)
- `DELETE /api/movies/:id` – Deactivate movie (Admin only)

### 🏛️ Theatres & Shows (`/api/theatres`, `/api/shows`)
- `GET /api/theatres` – List theatres (filter by city)
- `POST /api/theatres` – Add new theatre (Admin only)
- `GET /api/shows` – List showtimes
- `GET /api/shows/:id` – Fetch show details & seat layout
- `POST /api/shows` – Schedule showtime (Admin only)

### 🎟️ Bookings (`/api/bookings`)
- `POST /api/bookings/hold` – Reserve seats for 10 minutes (Protected)
- `POST /api/bookings/confirm` – Finalize purchase & issue ticket (Protected)
- `GET /api/bookings/my-bookings` – View user booking history (Protected)
- `POST /api/bookings/cancel` – Release seat hold (Protected)

---

## 📄 License
This project is licensed under the ISC License.
