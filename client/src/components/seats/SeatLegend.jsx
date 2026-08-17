import React from 'react';

const SeatLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 px-6 rounded-2xl bg-surface-secondary/70 border border-white/5 backdrop-blur-md my-6 text-xs text-gray-300">
      
      {/* Standard */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-seat bg-seat-standard border border-slate-600" />
        <span>Standard ($200)</span>
      </div>

      {/* Premium/VIP */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-seat bg-seat-premium border border-sky-400/30" />
        <span>Premium / VIP ($350-$500)</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-seat bg-seat-selected shadow-sm shadow-emerald-500/50" />
        <span className="font-semibold text-emerald-400">Selected</span>
      </div>

      {/* Held / Locked */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-seat bg-seat-locked" />
        <span className="text-amber-400">Held (10m)</span>
      </div>

      {/* Booked */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-seat bg-seat-booked/50 border border-white/5 opacity-50" />
        <span className="text-gray-500">Sold Out</span>
      </div>
    </div>
  );
};

export default SeatLegend;
