# 🎬 CineMatrix - Cinema Ticket Booking Platform

**CineMatrix** is a high-concurrency, real-time cinema ticket booking web platform built with Node.js, Express.js, MongoDB (Mongoose), React 18 (Vite), Tailwind CSS, Lucide Icons, and Redux Toolkit.

Built following the **Figma UI/UX Design System Specification & Wireframe Blueprint** and enhanced with iconic **BookMyShow** cinema ticketing features.

---

## 🌟 Key Features

### 🍿 BookMyShow Ticketing Features

- **🏙️ City & Device Geolocation Location Selector**:
  - Browser Geolocation API integration ("Detect My Location") with dual reverse-geocoding fallbacks (OpenStreetMap Nominatim + BigDataCloud).
  - Multi-city selector (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, Chennai, Kolkata, Ratlam, Indore, Bhopal, etc.) that filters movies, cinema halls, and showtimes by city.
- **🏛️ Dedicated Theatre Showtime Matrix Grid (`/movie/:id/shows`)**:
  - Multi-date tab selector (**Today, Tomorrow, Day 3, Day 4**).
  - Cinema halls listing with showtime pills color-coded by real-time seat availability:
    - 🟢 **Green**: Available Seats
    - 🟡 **Orange**: Fast Filling
    - 🔴 **Red**: Almost Full
- **🎭 Movie Cast & Director Showcase**:
  - Movie Details page showcases actor photos, character roles, and director credit.
  - Seeder & Admin Add Movie modal supporting star cast inputs and director attribution.
- **⭐ Movie Reviews & Audience Rating System**:
  - Rating submission modal with 1–5 star hover feedback and review headline/comment.
  - Aggregate score calculator, 1–5 star rating distribution bar chart, and **Audience Approval Score %**.
- **🏷️ Discount Promo Codes & Offers Engine**:
  - Promo code system supporting vouchers:
    - `FIRST50`: **50% OFF up to ₹150**
    - `BOOKMYSHOW20`: **20% Instant Discount**
    - `CINEMA100`: **₹100 Flat Discount** on orders over ₹300
  - Live API coupon validation (`POST /api/bookings/validate-coupon`) with dynamic itemized bill breakdown.
- **🎥 Embedded Movie Trailer Modal & Auto-Embed Converter**:
  - Embedded YouTube video trailer modal player integrated across Hero Billboard, Movie Cards, Movie Details page, and Admin Add Movie modal.
  - Automatic YouTube URL formatter converts standard YouTube links into embeddable player URLs.
- **🔍 Multi-Criteria Search & Format/Language Filters**:
  - Real-time search bar for movies by title or genre.
  - Filter chips for Formats (**2D, 3D, IMAX 3D, 4DX**) and Languages (**English, Hindi, Telugu, Tamil**).
- **🌐 Professional Ticket Booking Footer**:
  - Multi-column footer featuring popular movies, cities, 24/7 customer care banner, instant E-ticket resend, newsletter subscription, and payment gateway badges (Visa, Mastercard, UPI).

### 🎟️ Core Cinema Platform Capabilities

- **Dark Cinema Aesthetic**: Harmonized dark cinema color tokens (`#090D16` Surface Primary, `#121824` Surface Secondary, `#E50914` Cinema Crimson, `#F59E0B` Warm Gold) with ambient radial lighting.
- **📱 100% Fully Responsive Layout**:
  - Tested across mobile, tablet, and desktop viewports.
  - Non-overlapping Concessions selector cards with corner badges.
  - Mobile location & movie search sub-bar in Navigation.
- **JWT Authentication & Role-Based Access Control**:
  - Secure Registration & Login with password encryption (`bcryptjs`).
  - Access control distinguishing standard `USER` accounts from `ADMIN` console managers.
- **Interactive Cinema Seat Matrix**:
  - Curved screen SVG arc (_"ALL EYES THIS WAY • CINEMA SCREEN"_).
  - Tier-segmented seat layout (Standard ₹200, Premium ₹350, VIP ₹500).
- **10-Minute Database Seat Holds**:
  - Atomic seat locking for 10 minutes preventing double bookings.
  - Background cron worker (`node-cron`) automatically releasing expired seat holds.
- **Pre-order Cinema Concessions & Food Store**:
  - Pre-order Jumbo Popcorn, Sodas, Cheese Nachos, and VIP Combos during checkout.
- **📊 Interactive Box Office Revenue & Analytics Intelligence**:
  - Live revenue analytics dashboard featuring Total Sales Revenue (₹), Total Tickets Issued, and Avg Theatre Occupancy %.
  - Top Grossing Movies ranking chart and Regional Revenue Breakdown by Cinema City.
  - Interactive Admin tab navigation (`Revenue Analytics`, `Movie Catalog`, `Showtimes Grid`).
- **Single-Page Digital E-Ticket Pass**:
  - Perforated ticket pass with QR Code entrance scanner.
  - Print-optimized single page layout (`window.print()`).

---

## 🛠️ Technology Stack

| Layer                | Technologies                                                                         |
| :------------------- | :----------------------------------------------------------------------------------- |
| **Frontend**         | React 18, Vite, Tailwind CSS, Lucide Icons, Redux Toolkit, Axios, React Router v6    |
| **Backend API**      | Node.js, Express.js, CORS, Dotenv, JWT, BcryptJS, Geolocation APIs                   |
| **Database**         | MongoDB + Mongoose Schemas (`User`, `Movie`, `Theatre`, `Show`, `Booking`, `Review`) |
| **Background Tasks** | Node-Cron (Automatic 10-minute hold release worker), Nodemailer                      |

---

## 🚀 Quick Start & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/cinematrix` or MongoDB Atlas URI)

### 1. Setup Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables (.env)
# Default MONGO_URI=mongodb://127.0.0.1:27017/cinematrix

# Seed database (Populates sample movies, theatres, multi-date showtimes, cast & user reviews)
npm run seed

# Start Server (Development mode with nodemon auto-restart)
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

## 📡 REST API Reference

### 🔐 Auth Endpoints (`/api/auth`)

- `POST /api/auth/register` – Register new user or admin
- `POST /api/auth/login` – Login and obtain JWT token
- `GET /api/auth/me` – Fetch current user profile (Protected)
- `GET /api/auth/users` – List all users (Admin only)

### 🍿 Movie Catalog (`/api/movies`)

- `GET /api/movies` – List active movies
- `GET /api/movies/:id` – Fetch movie by ID (Includes cast & director)
- `POST /api/movies` – Add movie with trailer URL, director & cast (Admin only)
- `PUT /api/movies/:id` – Update movie (Admin only)
- `DELETE /api/movies/:id` – Deactivate movie (Admin only)

### ⭐ Audience Reviews (`/api/reviews`)

- `GET /api/reviews/movie/:movieId` – Get all user reviews & rating statistics for a movie
- `POST /api/reviews/movie/:movieId` – Submit or update a user review (Protected)

### 🏛️ Theatres & Shows (`/api/theatres`, `/api/shows`)

- `GET /api/theatres` – List theatres (filter by city)
- `POST /api/theatres` – Add new theatre (Admin only)
- `GET /api/shows` – List showtimes
- `GET /api/shows/:id` – Fetch show details & seat layout
- `POST /api/shows` – Schedule showtime (Admin only)

### 🎟️ Bookings & Coupons (`/api/bookings`)

- `POST /api/bookings/hold` – Reserve seats for 10 minutes (Protected)
- `POST /api/bookings/validate-coupon` – Validate promo code and compute discount amount
- `POST /api/bookings/confirm` – Finalize purchase & issue digital E-ticket (Protected)
- `GET /api/bookings/my-bookings` – View user booking history (Protected)
- `POST /api/bookings/cancel` – Release seat hold (Protected)
- `GET /api/bookings/admin/analytics` – Box Office Revenue & Analytics Intelligence (Admin only)

---

## 📄 License

This project is licensed under the ISC License.
