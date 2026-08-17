import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import API from '../services/api';
import {
  setSelectedShow,
  toggleSeatSelection,
  holdSeatsAction,
} from '../store/bookingSlice';
import { openAuthModal } from '../store/authSlice';
import ScreenArcSVG from '../components/seats/ScreenArcSVG';
import SeatItem from '../components/seats/SeatItem';
import SeatLegend from '../components/seats/SeatLegend';
import FloatingCartBar from '../components/seats/FloatingCartBar';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { selectedShow, selectedSeats, loading, error } = useSelector(
    (state) => state.booking
  );

  const [showData, setShowData] = useState(null);
  const [fetching, setFetching] = useState(true);

  // Fetch show details & seat layout from API
  useEffect(() => {
    const fetchShow = async () => {
      setFetching(true);
      try {
        const res = await API.get(`/shows/${showId}`);
        setShowData(res.data.show);
        dispatch(setSelectedShow(res.data.show));
      } catch (err) {
        console.error('Failed to load show seats:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchShow();
  }, [showId, dispatch]);

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-3" />
        <p className="text-sm font-semibold">Generating interactive seat matrix...</p>
      </div>
    );
  }

  if (!showData) {
    return (
      <div className="text-center py-20 text-gray-400">
        <h2 className="text-xl font-bold">Showtime not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm">
          Return Home
        </button>
      </div>
    );
  }

  const movie = showData.movieId || {};
  const theatre = showData.theatreId || {};

  // Organize seats by Rows (e.g. Row 'A', Row 'B', Row 'C', Row 'D')
  const rowsMap = {};
  showData.seats.forEach((seat) => {
    const rowChar = seat.seatNumber.charAt(0);
    if (!rowsMap[rowChar]) rowsMap[rowChar] = [];
    rowsMap[rowChar].push(seat);
  });

  // Calculate Total Price
  const totalPrice = selectedSeats.reduce((sum, seatNum) => {
    const seatObj = showData.seats.find((s) => s.seatNumber === seatNum);
    return sum + (seatObj ? seatObj.price : 200);
  }, 0);

  // Trigger Hold Seats API
  const handleHoldSeats = async () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'));
      return;
    }

    const result = await dispatch(
      holdSeatsAction({ showId: showData._id, seatNumbers: selectedSeats })
    );

    if (holdSeatsAction.fulfilled.match(result)) {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 pb-28">
      
      {/* Top Navigation Bar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Movie</span>
      </button>

      {/* Showtime Details Header */}
      <div className="p-6 rounded-2xl bg-surface-secondary border border-white/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">{movie.title}</h1>
          <div className="text-xs text-gray-400 mt-1">
            {theatre.name} • Screen {showData.screenNumber} •{' '}
            <span className="text-emerald-400 font-bold">
              {new Date(showData.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase font-bold text-gray-500">Tier Pricing</div>
          <div className="text-xs font-semibold text-gray-300">Standard ₹200 | Premium ₹350 | VIP ₹500</div>
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Curved Screen Arc SVG */}
      <ScreenArcSVG />

      {/* Interactive Seating Grid Frame (Rows A through D) */}
      <div className="my-8 space-y-3 flex flex-col items-center">
        {Object.keys(rowsMap).sort().map((rowChar) => (
          <div key={rowChar} className="flex items-center gap-3 sm:gap-4">
            
            {/* Row Label */}
            <span className="w-5 text-xs font-extrabold text-gray-500 text-center uppercase">
              {rowChar}
            </span>

            {/* Row Seats Matrix */}
            <div className="flex items-center gap-2">
              {rowsMap[rowChar].map((seat) => (
                <SeatItem
                  key={seat.seatNumber}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.seatNumber)}
                  onToggleSelect={(seatNum) => dispatch(toggleSeatSelection(seatNum))}
                />
              ))}
            </div>

            {/* Right Row Label */}
            <span className="w-5 text-xs font-extrabold text-gray-500 text-center uppercase">
              {rowChar}
            </span>

          </div>
        ))}
      </div>

      {/* Color Tokens Legend */}
      <SeatLegend />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        onHoldSeats={handleHoldSeats}
        loading={loading}
      />

    </div>
  );
};

export default SeatSelectionPage;
