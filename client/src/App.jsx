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
            <Route path="/select-seats/:showId" element={<SeatSelectionPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/ticket-success" element={<TicketSuccessPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/5 py-8 mt-16 bg-surface-primary/50 text-center text-xs text-gray-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-bold text-gray-300">
              Cine<span className="text-brand-primary">Matrix</span> Ticket Booking Platform
            </div>
            <div>© 2026 CineMatrix. All rights reserved. Powered by Node.js, Express, MongoDB & React.</div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
