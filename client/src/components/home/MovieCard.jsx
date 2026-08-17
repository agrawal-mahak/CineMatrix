import React from 'react';
import { Star, Clock, Ticket, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWatchlist } from '../../store/movieSlice';

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
      className="group relative bg-surface-secondary border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1.5"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-tertiary">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Top Badges & Watchlist Heart */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-primary/80 backdrop-blur-md text-yellow-400 font-bold text-[11px] border border-white/10">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{movie.rating}</span>
          </div>

          <button
            onClick={handleWatchlistClick}
            className="p-1.5 rounded-lg bg-surface-primary/80 backdrop-blur-md text-gray-300 hover:text-white border border-white/10 transition-colors"
            title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-brand-primary text-brand-primary' : 'text-gray-300'}`} />
          </button>
        </div>

        {/* Quick Book Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button className="w-full py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-lg shadow-brand-primary/40 flex items-center justify-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Ticket className="w-3.5 h-3.5" />
            <span>Quick Book</span>
          </button>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-base text-gray-100 group-hover:text-brand-primary transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500" />
              {movie.duration}m
            </span>
            <span>•</span>
            <span className="truncate">{movie.genre?.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
