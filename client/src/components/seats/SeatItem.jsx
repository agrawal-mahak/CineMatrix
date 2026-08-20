import React from 'react';

const SeatItem = ({ seat, isSelected, onToggleSelect }) => {
  const { seatNumber, status, price } = seat;

  // Determine seat state
  const isBooked = status === 'BOOKED';
  const isHeld = status === 'HELD';
  const isAvailable = status === 'AVAILABLE';

  // Seat Type (Standard vs Premium/VIP)
  const isVipOrPremium = price >= 350;

  // Style classes according to Figma Design System Color Tokens
  let seatStyle = '';

  if (isBooked) {
    seatStyle = 'bg-seat-booked/50 text-gray-600 border border-white/5 cursor-not-allowed';
  } else if (isHeld) {
    seatStyle = 'bg-seat-locked text-gray-950 font-extrabold border border-yellow-500/50 animate-pulse cursor-not-allowed';
  } else if (isSelected) {
    seatStyle = 'bg-seat-selected text-white font-extrabold shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-400 scale-105';
  } else if (isVipOrPremium) {
    seatStyle = 'bg-seat-premium hover:bg-sky-500 text-white font-bold border border-sky-400/30 hover:scale-105';
  } else {
    seatStyle = 'bg-seat-standard hover:bg-slate-600 text-gray-200 font-bold border border-slate-600 hover:scale-105';
  }

  return (
    <button
      disabled={isBooked || isHeld}
      onClick={() => onToggleSelect(seatNumber)}
      title={`${seatNumber} - ₹${price} (${status})`}
      className={`w-8 h-8 rounded-seat text-[11px] flex items-center justify-center transition-all duration-200 ${seatStyle}`}
    >
      {seatNumber}
    </button>
  );
};

export default SeatItem;
