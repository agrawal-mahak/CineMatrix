import React from 'react';
import { Star, Play, Ticket, Sparkles, Clock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroBillboard = ({ featuredMovie, onWatchTrailer }) => {
  const navigate = useNavigate();

  if (!featuredMovie) return null;

  return (
    <div className="relative w-full h-[460px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl my-6 group">
      
      {/* Background Banner Image with Gradient Mask */}
      <img
        src={featuredMovie.bannerUrl || featuredMovie.posterUrl}
        alt={featuredMovie.title}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-primary via-surface-primary/60 to-transparent" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end pb-10">
        
        {/* Featured Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand-primary/20 border border-brand-primary/40 text-brand-primary text-xs font-bold w-fit mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FEATURED BLOCKBUSTER</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md max-w-2xl mb-3">
          {featuredMovie.title}
        </h1>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-300 mb-4">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>{featuredMovie.rating || '8.8'}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-300">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span>{featuredMovie.duration} Mins</span>
          </div>

          <div className="flex items-center gap-1 text-gray-300">
            <Globe className="w-3.5 h-3.5 text-brand-accent" />
            <span>{featuredMovie.language?.join(', ')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {featuredMovie.genre?.map((g) => (
              <span key={g} className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-200 border border-white/5">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Synopsis */}
        <p className="text-sm text-gray-300 max-w-xl line-clamp-2 mb-6 font-normal leading-relaxed">
          {featuredMovie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/movie/${featuredMovie._id}`)}
            className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm shadow-xl shadow-brand-primary/40 transition-all flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Tickets Now</span>
          </button>

          <button
            onClick={() => onWatchTrailer && onWatchTrailer(featuredMovie)}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Watch Trailer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBillboard;
