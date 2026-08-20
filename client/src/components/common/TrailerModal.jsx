import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen || !trailerUrl) return null;

  // Convert standard watch URL to embed URL if needed
  let embedUrl = trailerUrl;
  if (trailerUrl.includes('watch?v=')) {
    const videoId = trailerUrl.split('watch?v=')[1].split('&')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (!trailerUrl.includes('autoplay=1')) {
    embedUrl = `${trailerUrl}?autoplay=1`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-surface-secondary border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-primary/60">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-brand-primary">🎬 Trailer:</span> {movieTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={`${movieTitle} Official Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
