import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Calendar, Film, Info, ArrowLeft, Clock } from 'lucide-react';
import API from '../services/api';
import LocationSelector from '../components/common/LocationSelector';

const TheatreShowtimesPage = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const selectedCity = useSelector((state) => state.movies.selectedCity);

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Generate next 4 dates (Today, Tomorrow, Day 3, Day 4)
  const dateTabs = Array.from({ length: 4 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return {
      dateObj: d,
      dayLabel: idx === 0 ? 'TODAY' : idx === 1 ? 'TOMORROW' : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  const selectedDate = dateTabs[selectedDateIndex].dateObj;

  const fetchMovieAndShows = useCallback(async () => {
    try {
      setLoading(true);
      const [movieRes, showsRes] = await Promise.all([
        API.get(`/movies/${movieId}`),
        API.get(`/shows`),
      ]);

      setMovie(movieRes.data.movie);

      // Filter shows for this movie
      const allShows = showsRes.data.shows || [];
      const movieShows = allShows.filter((s) => s.movieId?._id === movieId || s.movieId === movieId);
      setShows(movieShows);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load showtimes:', err);
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchMovieAndShows();
  }, [fetchMovieAndShows]);

  // Group shows by Theatre for the selected Date and City
  const filteredShowsByTheatre = React.useMemo(() => {
    const theatreMap = {};

    shows.forEach((show) => {
      const showDate = new Date(show.startTime);
      const isSameDate =
        showDate.getDate() === selectedDate.getDate() &&
        showDate.getMonth() === selectedDate.getMonth() &&
        showDate.getFullYear() === selectedDate.getFullYear();

      const theatre = show.theatreId;
      if (!theatre) return;

      const isSameCity = theatre.city?.toLowerCase() === selectedCity?.toLowerCase();

      if (isSameDate && isSameCity) {
        if (!theatreMap[theatre._id]) {
          theatreMap[theatre._id] = {
            theatre,
            shows: [],
          };
        }
        theatreMap[theatre._id].shows.push(show);
      }
    });

    return Object.values(theatreMap);
  }, [shows, selectedDate, selectedCity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Loading Showtimes & Cinema Halls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-primary text-gray-100 pb-16">
      {/* Movie Top Header Bar */}
      <div className="bg-surface-secondary/80 border-b border-white/10 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/movie/${movieId}`)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
              title="Back to Movie Details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">{movie?.title}</h1>
                <span className="px-2 py-0.5 rounded bg-brand-primary/20 border border-brand-primary/40 text-brand-primary font-bold text-xs">
                  {movie?.rating}★
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>{movie?.genre?.join(', ')}</span>
                <span>•</span>
                <span>{movie?.language?.join(', ')}</span>
                <span>•</span>
                <span>{movie?.duration} mins</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">Location:</span>
            <LocationSelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* Date Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {dateTabs.map((tab, idx) => {
            const isSelected = selectedDateIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDateIndex(idx)}
                className={`flex flex-col items-center px-5 py-2.5 rounded-xl text-center transition-all min-w-[100px] border ${
                  isSelected
                    ? 'bg-brand-primary text-white font-bold border-brand-primary shadow-lg shadow-brand-primary/30 scale-105'
                    : 'bg-surface-secondary/70 hover:bg-surface-secondary text-gray-300 border-white/10'
                }`}
              >
                <span className="text-[10px] font-semibold tracking-wider opacity-80">{tab.dayLabel}</span>
                <span className="text-sm font-extrabold mt-0.5">{tab.dateLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Legend Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-surface-secondary/40 border border-white/5 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Fast Filling
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Almost Full
            </span>
          </div>
          <div className="text-[11px] text-gray-500">
            Select a showtime to choose your seats
          </div>
        </div>

        {/* Theatres & Showtimes Listing */}
        {filteredShowsByTheatre.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-surface-secondary/30 border border-white/5 space-y-3">
            <Film className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-gray-200">No Showtimes Found in {selectedCity}</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              There are no available showtimes for <span className="text-white font-semibold">{movie?.title}</span> on{' '}
              <span className="text-white font-semibold">{dateTabs[selectedDateIndex].dateLabel}</span> in {selectedCity}. Try changing the date or city above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShowsByTheatre.map(({ theatre, shows }) => (
              <div
                key={theatre._id}
                className="p-6 rounded-2xl bg-surface-secondary/50 border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-xl"
              >
                {/* Theatre Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>🏛️ {theatre.name}</span>
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" /> {theatre.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-medium text-gray-300">
                      M-Ticket & Food Pre-order Supported
                    </span>
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {shows.map((show) => {
                    const timeStr = new Date(show.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });

                    // Calculate availability status
                    const totalSeats = show.seats?.length || 32;
                    const availableSeats = show.seats?.filter((s) => s.status === 'AVAILABLE').length || 0;
                    const availRatio = availableSeats / totalSeats;

                    let statusClass = 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20';
                    if (availRatio < 0.2) {
                      statusClass = 'border-rose-500/40 text-rose-400 hover:bg-rose-500/20';
                    } else if (availRatio < 0.5) {
                      statusClass = 'border-amber-500/40 text-amber-400 hover:bg-amber-500/20';
                    }

                    return (
                      <button
                        key={show._id}
                        onClick={() => navigate(`/select-seats/${show._id}`)}
                        className={`group px-4 py-2.5 rounded-xl border bg-surface-primary/80 transition-all text-center hover:scale-105 ${statusClass}`}
                      >
                        <div className="text-sm font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 opacity-75" />
                          <span>{timeStr}</span>
                        </div>
                        <div className="text-[10px] opacity-75 font-semibold mt-0.5">
                          Screen {show.screenNumber || 1} • {availableSeats} seats left
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheatreShowtimesPage;
