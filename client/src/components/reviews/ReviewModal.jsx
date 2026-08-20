import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import API from '../../services/api';

const ReviewModal = ({ isOpen, onClose, movieId, movieTitle, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!headline.trim() || !comment.trim()) {
      setError('Please provide both a headline and review comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await API.post(`/reviews/movie/${movieId}`, {
        rating,
        headline,
        comment,
      });

      setLoading(false);
      onReviewSubmitted();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#141A29] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-primary/50">
          <div>
            <h3 className="text-lg font-bold text-white">Rate & Review</h3>
            <p className="text-xs text-gray-400">{movieTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Star Rating Input */}
          <div className="text-center space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Your Rating</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-yellow-400">
              {rating === 5 ? '⭐ Masterpiece (5/5)' : rating === 4 ? '👍 Very Good (4/5)' : rating === 3 ? '👌 Average (3/5)' : rating === 2 ? '👎 Below Average (2/5)' : '💩 Terrible (1/5)'}
            </p>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Headline / Title
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Mind-blowing visuals and masterpiece story!"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-primary transition-colors"
              required
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Detailed Review
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share what you liked or disliked about the direction, acting, music, or plot..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-primary transition-colors resize-none"
              required
            />
          </div>

          {/* Submit button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-brand-primary/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : <>Submit Review <Send className="w-3.5 h-3.5" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
