import React from 'react';

const ScreenArcSVG = () => {
  return (
    <div className="w-full flex flex-col items-center my-6">
      {/* Top Ambient Glow */}
      <div className="w-3/4 h-8 bg-gradient-to-b from-brand-accent/30 via-brand-primary/10 to-transparent blur-xl rounded-full -mb-4" />

      {/* Cinema Screen Arc SVG */}
      <div className="relative w-full max-w-2xl">
        <svg viewBox="0 0 800 60" className="w-full drop-shadow-[0_4px_12px_rgba(99,102,241,0.5)]">
          <path
            d="M 50,45 Q 400,5 750,45"
            fill="none"
            stroke="url(#screenGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E50914" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#E50914" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase mt-1">
        All Eyes This Way
      </div>
    </div>
  );
};

export default ScreenArcSVG;
