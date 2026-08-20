import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Film, Clock, Star, Image, Globe, Tag, Loader2, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import { fetchMovies } from '../../store/movieSlice';

const AddMovieModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(120);
  const [genre, setGenre] = useState('Sci-Fi, Action');
  const [language, setLanguage] = useState('English, Hindi');
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [rating, setRating] = useState(8.5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const formatYouTubeEmbed = (url) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const genreArray = genre.split(',').map((g) => g.trim()).filter(Boolean);
      const languageArray = language.split(',').map((l) => l.trim()).filter(Boolean);

      const payload = {
        title,
        description,
        duration: Number(duration),
        genre: genreArray,
        language: languageArray,
        posterUrl: posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
        bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80',
        trailerUrl: formatYouTubeEmbed(trailerUrl) || 'https://www.youtube.com/embed/YoHD9XEInc0',
        rating: Number(rating),
      };

      await API.post('/movies', payload);

      setSuccess(true);
      dispatch(fetchMovies());

      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#141A29] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-primary/50">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
              <Film className="w-4 h-4" />
            </div>
            <span>Admin: Add New Movie to Catalog</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Movie added to catalog successfully! Refreshing...</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Movie Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Interstellar 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Synopsis & Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Enter synopsis..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary resize-none"
            />
          </div>

          {/* Duration & Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Duration (Minutes)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min={30}
                  max={300}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                IMDb Rating (0 to 10)
              </label>
              <div className="relative">
                <Star className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Genre & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Genres (Comma Separated)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Sci-Fi, Action, Thriller"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Languages (Comma Separated)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="English, Hindi, Spanish"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Poster & Banner Image URLs */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Poster Image URL
            </label>
            <div className="relative">
              <Image className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Backdrop Banner Image URL (Optional)
            </label>
            <div className="relative">
              <Image className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              YouTube Trailer URL or Embed Link
            </label>
            <div className="relative">
              <Film className="w-4 h-4 text-brand-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=YoHD9XEInc0"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-surface-primary hover:bg-surface-tertiary text-gray-300 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm shadow-lg shadow-brand-primary/30 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding Movie...</span>
                </>
              ) : (
                <span>Publish Movie</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;
