/**
 * Helper to format movie duration in minutes into Hours and Minutes (e.g., 145 -> "2h 25m")
 */
export const formatDuration = (mins) => {
  if (!mins) return '2h 00m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
