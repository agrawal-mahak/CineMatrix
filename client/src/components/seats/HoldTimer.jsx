import React, { useState, useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

const HoldTimer = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins in seconds

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = timeLeft < 120; // under 2 minutes

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill border text-xs font-bold transition-all ${
        isUrgent
          ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      }`}
    >
      {isUrgent ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Timer className="w-4 h-4 text-amber-400" />}
      <span>Seats Held: <strong className="font-mono text-sm ml-1">{formattedTime}</strong></span>
    </div>
  );
};

export default HoldTimer;
