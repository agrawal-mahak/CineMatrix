import React from 'react';
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

const FloatingCartBar = ({ selectedSeats, totalPrice, onHoldSeats, loading }) => {
  if (!selectedSeats || selectedSeats.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto z-40 animate-slide-up">
      <div className="glass-panel rounded-2xl p-4 sm:px-6 shadow-2xl border border-white/10 flex items-center justify-between gap-4">
        
        {/* Selected Seats Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">
              {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
            </div>
            <div className="text-sm font-bold text-gray-100 truncate max-w-[200px] sm:max-w-md">
              {selectedSeats.join(', ')}
            </div>
          </div>
        </div>

        {/* Total & Checkout CTA */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-gray-400">Total Price</div>
            <div className="text-lg font-extrabold text-emerald-400">₹{totalPrice}</div>
          </div>

          <button
            onClick={onHoldSeats}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm shadow-xl shadow-brand-primary/40 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Holding Seats...</span>
              </>
            ) : (
              <>
                <span>Hold & Pay (₹{totalPrice})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingCartBar;
