import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Ticket, Calendar, MapPin, Loader2, Clock } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await API.get('/bookings/my-bookings');
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Failed to fetch user bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-3" />
        <p className="text-sm font-semibold">Fetching your booking records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
          <Ticket className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Ticket Bookings</h1>
          <p className="text-xs text-gray-400">Your upcoming cinema shows and booking history</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="p-12 rounded-3xl bg-surface-secondary border border-white/5 text-center text-gray-400">
          <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-300">No bookings yet</h3>
          <p className="text-xs text-gray-500 mt-1">Book your first cinema ticket to see it listed here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const show = b.showId || {};
            const movie = show.movieId || {};
            const theatre = show.theatreId || {};

            const isConfirmed = b.status === 'CONFIRMED';
            const isHeld = b.status === 'HELD';

            return (
              <div
                key={b._id}
                className="p-5 rounded-2xl bg-surface-secondary border border-white/5 hover:border-white/15 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Movie & Theatre Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80'}
                    alt={movie.title || 'Movie'}
                    className="w-16 h-20 object-cover rounded-xl border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{movie.title || 'Cinema Movie'}</h3>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                          isConfirmed
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : isHeld
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>{theatre.name || 'CineMatrix Multiplex'}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                        {show.startTime ? new Date(show.startTime).toLocaleDateString() : 'N/A'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {show.startTime ? new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking ID & Seats */}
                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-gray-500 font-bold">Seats</div>
                    <div className="text-sm font-extrabold text-emerald-400">
                      {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}
                    </div>
                  </div>

                  <div className="text-right mt-1">
                    <div className="text-[10px] uppercase text-gray-500 font-bold">Booking Ref</div>
                    <div className="text-xs font-mono font-bold text-gray-300">{b.bookingId}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
