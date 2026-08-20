import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Star, Clock, Calendar, Play, Ticket, MapPin, ChevronRight, Loader2, Sparkles, Film } from 'lucide-react';
import ReviewList from '../components/reviews/ReviewList';
import TrailerModal from '../components/common/TrailerModal';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieRes = await API.get(`/movies/${id}`);
        setMovie(movieRes.data.movie);

        const showsRes = await API.get(`/shows`);
        const allShows = showsRes.data.shows || [];
        const movieShows = allShows.filter((s) => s.movieId?._id === id || s.movieId === id);
        setShows(movieShows);
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
        <p className="text-sm font-semibold">Loading movie details...</p>
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* Movie Hero Banner */}
      <div className="relative w-full h-[400px] lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-primary via-surface-primary/60 to-transparent" />

        <div className="absolute bottom-8 left-6 lg:left-12 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/40 text-brand-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NOW SHOWING IN CINEMAS</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-300">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>{movie.rating} / 10</span>
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

            {movie.format && movie.format.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-gray-400 font-medium">Formats:</span>
                {movie.format.map((fmt) => (
                  <span key={fmt} className="px-2 py-0.5 rounded bg-white/10 text-gray-200 text-xs font-bold border border-white/10">
                    {fmt}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Call to Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/movie/${id}/shows`)}
              className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-extrabold text-sm shadow-xl shadow-brand-primary/40 transition-all flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </button>

            <button
              onClick={() => setShowTrailerModal(true)}
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movie Synopsis */}
      <div className="p-6 rounded-2xl bg-surface-secondary/40 border border-white/10 backdrop-blur-md space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-brand-primary" /> About the Movie
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">{movie.description}</p>
      </div>

      {/* BookMyShow Quick Showtimes Preview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-primary/20 via-surface-secondary to-surface-secondary border border-brand-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Looking for showtimes in your city?</h3>
          <p className="text-xs text-gray-300 mt-1">Select date, cinema hall, and view available seats status in real-time.</p>
        </div>
        <button
          onClick={() => navigate(`/movie/${id}/shows`)}
          className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-primary/30 shrink-0"
        >
          <span>View Cinema Showtimes</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Audience Reviews & Rating Breakdown Section */}
      <ReviewList movieId={id} movieTitle={movie.title} />

      {/* Embedded Trailer Modal */}
      <TrailerModal
        isOpen={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default MovieDetailPage;
