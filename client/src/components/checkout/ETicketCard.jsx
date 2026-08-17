import React, { useEffect } from 'react';
import { QrCode, Download, Share2, Ticket, Calendar, Clock, MapPin, CheckCircle2, Receipt, Star, Popcorn } from 'lucide-react';
import confetti from 'canvas-confetti';

const ETicketCard = ({ booking, selectedSnacks }) => {
  useEffect(() => {
    // Trigger celebratory confetti on ticket view
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback
    }
  }, []);

  if (!booking) return null;

  // Extract show, movie, and theatre objects cleanly with robust fallbacks
  const show = typeof booking.showId === 'object' ? booking.showId : {};
  const movie = (typeof show.movieId === 'object' ? show.movieId : null) || booking.movie || {
    title: 'Inception: Resonance',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
    duration: 148,
    rating: 9.1,
    language: ['English', 'Hindi'],
  };
  const theatre = (typeof show.theatreId === 'object' ? show.theatreId : null) || booking.theatre || {
    name: 'CineMatrix IMAX & Multiplex',
    city: 'New York',
    address: '742 Broadway Ave',
  };

  // Calculate bill details
  const seatList = Array.isArray(booking.seats) ? booking.seats : [booking.seats];
  const ticketAmount = booking.totalAmount || 0;
  const convenienceFee = 35;
  const snacksList = selectedSnacks || [];
  const snacksTotal = snacksList.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const grandTotal = ticketAmount + convenienceFee + snacksTotal;

  const movieTitle = movie.title || 'Inception: Resonance';
  const moviePoster = movie.posterUrl || movie.bannerUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80';

  return (
    <div className="max-w-lg mx-auto my-4 animate-fade-in">
      
      {/* Confirmation Top Header (Hidden on Print) */}
      <div className="text-center mb-4 no-print">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Booking Confirmed!</h2>
        <p className="text-xs text-gray-400 mt-0.5">Your official e-ticket and receipt are ready.</p>
      </div>

      {/* Printable Digital Ticket & Receipt Card (Strict Single-Page Height) */}
      <div id="printable-ticket" className="relative bg-surface-secondary border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Banner Header with Movie Image */}
        <div className="relative p-4 sm:p-5 print-p-compact bg-gradient-to-r from-surface-primary via-surface-secondary to-purple-950/40 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            
            {/* Movie Poster Thumbnail */}
            <img
              src={moviePoster}
              alt={movieTitle}
              className="w-16 h-22 print-poster object-cover rounded-xl border border-white/20 shadow-md shrink-0"
            />

            {/* Movie Title & Details */}
            <div className="space-y-1 flex-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary text-[10px] font-bold border border-brand-primary/30 uppercase tracking-wider">
                Digital Entry Pass
              </div>
              <h3 className="text-lg font-black text-white line-clamp-1">{movieTitle}</h3>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-300 font-medium">
                <span className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {movie.rating || 8.8}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-primary" />
                  {movie.duration || 120}m
                </span>
                {movie.language && (
                  <>
                    <span>•</span>
                    <span>{Array.isArray(movie.language) ? movie.language.join(', ') : movie.language}</span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Showtime & Venue Section */}
        <div className="p-4 sm:p-5 print-p-compact space-y-3 border-b border-white/5">
          
          {/* Theatre Location */}
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-gray-100">{theatre.name}</div>
              <div className="text-[11px] text-gray-400">
                {theatre.address || theatre.city || 'Manhattan, NY'} • <strong className="text-gray-200">Screen {show.screenNumber || 1}</strong>
              </div>
            </div>
          </div>

          {/* Date & Time Badge */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-surface-primary/70 border border-white/5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-accent shrink-0" />
              <div>
                <div className="text-[9px] uppercase text-gray-400 font-bold">Show Date</div>
                <div className="text-xs font-bold text-gray-100">
                  {show.startTime ? new Date(show.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[9px] uppercase text-gray-400 font-bold">Show Timing</div>
                <div className="text-xs font-bold text-emerald-400">
                  {show.startTime ? new Date(show.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '07:30 PM'}
                </div>
              </div>
            </div>
          </div>

          {/* Seats & Booking Reference */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-primary/70 border border-white/5">
            <div>
              <div className="text-[9px] uppercase text-gray-400 font-bold">Reserved Seats ({seatList.length})</div>
              <div className="text-sm font-black text-emerald-400 tracking-wide">
                {seatList.join(', ')}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] uppercase text-gray-400 font-bold">Booking Ref</div>
              <div className="text-xs font-mono font-extrabold text-gray-200">{booking.bookingId || 'CNX-98231'}</div>
            </div>
          </div>

        </div>

        {/* Itemized Bill & Payment Breakdown */}
        <div className="p-4 sm:p-5 print-p-compact space-y-2 bg-surface-primary/40 border-b border-white/5">
          <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5 border-b border-white/5 pb-1.5">
            <Receipt className="w-3.5 h-3.5 text-brand-primary" />
            <span>Itemized Bill Details</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-gray-300">
              <span>Tickets ({seatList.length} Seat{seatList.length > 1 ? 's' : ''})</span>
              <span className="font-bold text-gray-100">${ticketAmount}</span>
            </div>

            <div className="flex items-center justify-between text-gray-300">
              <span>Booking Fee</span>
              <span className="font-bold text-gray-100">${convenienceFee}</span>
            </div>

            {snacksList.length > 0 && (
              <div className="space-y-0.5 pt-1 border-t border-white/5">
                <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <Popcorn className="w-3 h-3" /> Snacks & Combos:
                </div>
                {snacksList.map((snack) => (
                  <div key={snack.id} className="flex items-center justify-between pl-3 text-gray-400 text-[10px]">
                    <span>{snack.name} (x{snack.quantity})</span>
                    <span>${snack.price * snack.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-white/10 pt-1.5 flex items-center justify-between text-xs font-black text-white">
              <span>Total Paid</span>
              <span className="text-sm text-emerald-400">${grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Perforated Cutout Divider */}
        <div className="relative py-1.5 bg-surface-secondary">
          <div className="border-b-2 border-dashed border-white/10" />
          <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-primary border border-white/10" />
          <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-primary border border-white/10" />
        </div>

        {/* QR Code Gate Scanner */}
        <div className="p-4 print-p-compact flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-white rounded-xl shadow-lg">
            <QrCode className="w-20 h-20 print-qr text-gray-900" />
          </div>
          <div className="text-[9px] font-mono font-bold text-gray-400 mt-1.5 uppercase tracking-widest">
            Scan at Entrance • {booking.bookingId}
          </div>
        </div>

        {/* Footer Actions (Hidden on Print) */}
        <div className="p-3 bg-surface-primary/80 border-t border-white/5 grid grid-cols-2 gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="py-2.5 px-4 rounded-xl bg-surface-tertiary hover:bg-white/10 text-gray-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/5"
          >
            <Download className="w-4 h-4 text-brand-primary" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'CineMatrix Ticket', text: `My ticket for ${movieTitle}` });
              } else {
                alert('Ticket link copied to clipboard!');
              }
            }}
            className="py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Ticket</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ETicketCard;
