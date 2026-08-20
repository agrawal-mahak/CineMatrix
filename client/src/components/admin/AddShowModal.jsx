import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';

const AddShowModal = ({ isOpen, onClose, movies, theatres, onShowAdded }) => {
  const [movieId, setMovieId] = useState(movies[0]?._id || '');
  const [theatreId, setTheatreId] = useState(theatres[0]?._id || '');
  const [screenNumber, setScreenNumber] = useState(1);
  const [showDate, setShowDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTime, setShowTime] = useState('18:30');
  const [standardPrice, setStandardPrice] = useState(200);
  const [premiumPrice, setPremiumPrice] = useState(350);
  const [vipPrice, setVipPrice] = useState(500);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const startDateTime = new Date(`${showDate}T${showTime}:00`);

      const payload = {
        movieId: movieId || movies[0]?._id,
        theatreId: theatreId || theatres[0]?._id,
        screenNumber: Number(screenNumber),
        startTime: startDateTime.toISOString(),
        pricing: {
          STANDARD: Number(standardPrice),
          PREMIUM: Number(premiumPrice),
          VIP: Number(vipPrice),
        },
      };

      await API.post('/shows', payload);

      setSuccess(true);
      if (onShowAdded) onShowAdded();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule showtime');
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
        className="relative w-full max-w-lg bg-[#141A29] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scale-in"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-primary/50">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
              <Calendar className="w-4 h-4" />
            </div>
            <span>Admin: Schedule Showtime</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Showtime scheduled successfully!</span>
            </div>
          )}

          {/* Select Movie */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Select Movie
            </label>
            <select
              value={movieId || movies[0]?._id}
              onChange={(e) => setMovieId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
            >
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title} ({m.duration} mins)
                </option>
              ))}
            </select>
          </div>

          {/* Select Theatre */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Select Theatre
            </label>
            <select
              value={theatreId || theatres[0]?._id}
              onChange={(e) => setTheatreId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
            >
              {theatres.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.city})
                </option>
              ))}
            </select>
          </div>

          {/* Screen Number, Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Screen #
              </label>
              <input
                type="number"
                min={1}
                value={screenNumber}
                onChange={(e) => setScreenNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={showDate}
                onChange={(e) => setShowDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Pricing Tiers */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Seat Pricing Tiers (₹)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-gray-500 font-bold">STANDARD</span>
                <input
                  type="number"
                  value={standardPrice}
                  onChange={(e) => setStandardPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-primary border border-white/5 text-xs text-gray-100 font-bold focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] text-sky-400 font-bold">PREMIUM</span>
                <input
                  type="number"
                  value={premiumPrice}
                  onChange={(e) => setPremiumPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-primary border border-white/5 text-xs text-gray-100 font-bold focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] text-brand-primary font-bold">VIP</span>
                <input
                  type="number"
                  value={vipPrice}
                  onChange={(e) => setVipPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-primary border border-white/5 text-xs text-gray-100 font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
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
                  <span>Scheduling...</span>
                </>
              ) : (
                <span>Schedule Showtime</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddShowModal;
