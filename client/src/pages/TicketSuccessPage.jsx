import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ETicketCard from '../components/checkout/ETicketCard';
import { Home, Ticket } from 'lucide-react';

const TicketSuccessPage = () => {
  const navigate = useNavigate();
  const { currentBooking, selectedSnacks } = useSelector((state) => state.booking);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
      {/* Digital Ticket Card */}
      <ETicketCard booking={currentBooking} selectedSnacks={selectedSnacks} />

      {/* Action Links */}
      <div className="flex items-center justify-center gap-4 mt-6 no-print">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-gray-200 font-semibold text-sm border border-white/5 transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4 text-brand-primary" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => navigate('/my-bookings')}
          className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm shadow-lg shadow-brand-primary/25 transition-all flex items-center gap-2"
        >
          <Ticket className="w-4 h-4" />
          <span>View All My Bookings</span>
        </button>
      </div>
    </div>
  );
};

export default TicketSuccessPage;
