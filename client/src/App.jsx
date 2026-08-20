import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AuthModal from './components/common/AuthModal';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import TicketSuccessPage from './pages/TicketSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TheatreShowtimesPage from './pages/TheatreShowtimesPage';

import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-surface-primary text-gray-100 selection:bg-brand-primary selection:text-white">
        {/* Global Navigation Header */}
        <Navbar />

        {/* Global Auth Modal Dialog */}
        <AuthModal />

        {/* Main View Router */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/movie/:id/shows" element={<TheatreShowtimesPage />} />
            <Route path="/select-seats/:showId" element={<SeatSelectionPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/ticket-success" element={<TicketSuccessPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>

        {/* Professional Ticket Booking Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
