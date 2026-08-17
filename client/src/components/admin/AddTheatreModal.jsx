import React, { useState } from 'react';
import { X, Building2, MapPin, Layers, Loader2, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';

const AddTheatreModal = ({ isOpen, onClose, onTheatreAdded }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('New York');
  const [address, setAddress] = useState('');
  const [screenName, setScreenName] = useState('Screen 1 (IMAX)');
  const [rowsCount, setRowsCount] = useState(4);
  const [seatsPerRow, setSeatsPerRow] = useState(8);

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
      // Generate seats matrix
      const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const seats = [];

      for (let r = 0; r < Math.min(rowsCount, rowLetters.length); r++) {
        const rowChar = rowLetters[r];
        for (let col = 1; col <= seatsPerRow; col++) {
          let seatType = 'STANDARD';
          if (rowChar === 'C' || rowChar === 'D') seatType = 'PREMIUM';
          if (rowChar >= 'E') seatType = 'VIP';

          seats.push({
            seatNumber: `${rowChar}${col}`,
            row: rowChar,
            column: col,
            seatType,
          });
        }
      }

      const payload = {
        name,
        city,
        address,
        screens: [
          {
            screenNumber: 1,
            name: screenName,
            totalSeats: seats.length,
            seats,
          },
        ],
      };

      await API.post('/theatres', payload);

      setSuccess(true);
      if (onTheatreAdded) onTheatreAdded();

      setTimeout(() => {
        setSuccess(false);
        onClose();
        setName('');
        setAddress('');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add theatre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface-secondary border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-primary/50">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
              <Building2 className="w-4 h-4" />
            </div>
            <span>Admin: Add New Theatre</span>
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
              <span>Theatre registered successfully!</span>
            </div>
          )}

          {/* Theatre Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Theatre Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CineMatrix Grand Dolby Cinema"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* City & Address */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              >
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Miami">Miami</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                placeholder="742 Broadway Ave"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Screen Info */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Screen Auditorium Name
            </label>
            <input
              type="text"
              required
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Seating Grid Spec */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Number of Rows (A-H)
              </label>
              <input
                type="number"
                min={2}
                max={8}
                value={rowsCount}
                onChange={(e) => setRowsCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Seats per Row
              </label>
              <input
                type="number"
                min={4}
                max={12}
                value={seatsPerRow}
                onChange={(e) => setSeatsPerRow(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Total seats indicator */}
          <div className="p-3 rounded-xl bg-surface-primary/60 border border-white/5 text-xs text-gray-400 flex items-center justify-between">
            <span>Generated Screen Capacity:</span>
            <span className="font-extrabold text-brand-primary">{rowsCount * seatsPerRow} Seats</span>
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>Create Theatre</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTheatreModal;
