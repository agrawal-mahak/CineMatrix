import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Star, Clock, Calendar, Play, MapPin, ChevronRight, Loader2, Sparkles } from 'lucide-react';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Generate Date Strip options (Today, Tomorrow, +2 Days)
  const dateOptions = Array.from({ length: 4 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    return {
      label: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateString: d.toISOString().split('T')[0],
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieRes = await API.get(`/movies/${id}`);
        setMovie(movieRes.data.movie);

        const showsRes = await API.get(`/shows?movieId=${id}`);
        setShows(showsRes.data.shows || []);
      } catch (err) {
        console.error('Failed to load movie detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-3" />
        <p className="text-sm font-semibold">Loading movie showtimes...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20 text-gray-400">
        <h2 className="text-xl font-bold">Movie not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Movie Backdrop Header */}
      <div className="relative w-full h-[380px] lg:h-[440px] rounded-3xl overflow-hidden shadow-2xl mb-8">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-primary via-surface-primary/60 to-transparent" />

        <div className="absolute bottom-8 left-6 lg:left-12 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-primary mb-2">
              <Sparkles className="w-4 h-4" />
              <span>IN CINEMAS NOW</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-300 mt-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>{movie.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                <span>{movie.duration} Mins</span>
              </div>
              <span>•</span>
              <div>{movie.genre?.join(', ')}</div>
              <span>•</span>
              <div>{movie.language?.join(', ')}</div>
            </div>
          </div>

          {/* Trailer Button */}
          <button
            onClick={() => setShowTrailerModal(true)}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Play Trailer</span>
          </button>
        </div>
      </div>

      {/* Horizontal Date Selection Strip (DateChip) */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Select Date</h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {dateOptions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDateIndex(idx)}
              className={`px-5 py-3 rounded-2xl border text-center transition-all min-w-[100px] ${
                selectedDateIndex === idx
                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/30 scale-105'
                  : 'bg-surface-secondary hover:bg-surface-tertiary text-gray-400 border-white/5'
              }`}
            >
              <div className="text-xs font-bold uppercase">{item.label}</div>
              <div className="text-lg font-black">{item.dayNumber} {item.month}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Theatre & Showtime Badges */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Available Theatres & Showtimes</h3>

        {shows.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-secondary border border-white/5 text-center text-gray-400">
            No active showtimes available for this movie right now.
          </div>
        ) : (
          shows.map((show) => {
            const theatre = show.theatreId || {};
            const startTimeStr = new Date(show.startTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={show._id}
                className="p-6 rounded-2xl bg-surface-secondary border border-white/5 hover:border-white/15 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Theatre Header Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-100">
                    <MapPin className="w-4 h-4 text-brand-primary" />
                    <span>{theatre.name || 'CineMatrix IMAX Multiplex'}</span>
                  </div>
                  <div className="text-xs text-gray-400 pl-6">
                    {theatre.address || theatre.city || 'Manhattan, NY'} • Screen {show.screenNumber || 1}
                  </div>
                </div>

                {/* Showtime Badge Chips */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/select-seats/${show._id}`)}
                    className="group px-4 py-3 rounded-xl bg-surface-primary hover:bg-brand-primary border border-white/10 hover:border-brand-primary transition-all text-center flex flex-col items-center hover:scale-105"
                  >
                    <div className="text-sm font-extrabold text-emerald-400 group-hover:text-white transition-colors">
                      {startTimeStr}
                    </div>
                    <div className="text-[10px] text-gray-400 group-hover:text-white/80 uppercase font-semibold mt-0.5">
                      4K Laser 3D
                    </div>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trailer Modal Dialog */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-surface-secondary rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">{movie.title} - Official Trailer</h3>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="text-gray-400 hover:text-white font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieDetailPage;
