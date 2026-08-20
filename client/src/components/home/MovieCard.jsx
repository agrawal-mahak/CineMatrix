import React from 'react';
import { Star, Clock, Ticket, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWatchlist } from '../../store/movieSlice';
import { formatDuration } from '../../utils/formatters';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { watchlist } = useSelector((state) => state.movies);

  const isBookmarked = watchlist.includes(movie._id);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    dispatch(toggleWatchlist(movie._id));
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="glow-card group relative bg-surface-secondary/70 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-2"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-tertiary">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Top Badges & Watchlist Heart */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-yellow-400 font-extrabold text-[11px] border border-yellow-400/30 gold-glow">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>{movie.rating}</span>
          </div>

          <button
            onClick={handleWatchlistClick}
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-gray-300 hover:text-white border border-white/15 transition-all hover:scale-110 active:scale-95"
            title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Heart className={`w-4 h-4 transition-colors ${isBookmarked ? 'fill-brand-primary text-brand-primary drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]' : 'text-gray-300'}`} />
          </button>
        </div>

        {/* Quick Book Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-extrabold text-xs shadow-lg shadow-brand-primary/50 flex items-center justify-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <Ticket className="w-4 h-4" />
            <span>Book Tickets</span>
          </button>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-surface-secondary/40">
        <div>
          <h3 className="font-extrabold text-base text-gray-100 group-hover:text-brand-primary transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-primary" />
              {formatDuration(movie.duration)}
            </span>
            <span>•</span>
            <span className="truncate">{movie.genre?.join(', ')}</span>
          </div>

          {movie.format && movie.format.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {movie.format.map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10 group-hover:border-white/20 transition-colors"
                >
                  {fmt}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
