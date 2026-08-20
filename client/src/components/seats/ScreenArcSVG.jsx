import React from 'react';

const ScreenArcSVG = () => {
  return (
    <div className="w-full flex flex-col items-center my-6 relative">
      {/* Top Ambient Cinema Light Beam */}
      <div className="w-4/5 h-16 bg-gradient-to-b from-brand-accent/40 via-brand-primary/20 to-transparent blur-2xl rounded-full -mb-8 pointer-events-none" />

      {/* Cinema Screen Arc SVG */}
      <div className="relative w-full max-w-2xl">
        <svg viewBox="0 0 800 60" className="w-full drop-shadow-[0_8px_20px_rgba(99,102,241,0.6)]">
          <path
            d="M 50,45 Q 400,5 750,45"
            fill="none"
            stroke="url(#screenGradient)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E50914" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#E50914" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-[11px] font-extrabold tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 uppercase mt-2 drop-shadow">
        ALL EYES THIS WAY • CINEMA SCREEN
      </div>
    </div>
  );
};

export default ScreenArcSVG;
