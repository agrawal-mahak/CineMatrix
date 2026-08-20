// Utility to generate clean, professional animated 2D character avatar URLs

export const getAvatarUrl = (name = 'User', role = 'USER', customAvatar = '') => {
  if (customAvatar) return customAvatar;

  const sanitizedSeed = encodeURIComponent(name || 'User');

  if (role === 'ADMIN') {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss&backgroundColor=e50914`;
  }

  // Generate unique, stylish 2D animated cartoon avatars based on the user's name
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${sanitizedSeed}&backgroundColor=121824,1c2536,2d3748`;
};
