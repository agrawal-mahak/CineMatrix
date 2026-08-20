import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedGenre } from '../../store/movieSlice';
import { Sparkles, Zap, Flame, Skull, Bot, Smile, Heart } from 'lucide-react';

const GENRES = [
  { name: 'All', icon: Sparkles },
  { name: 'Sci-Fi', icon: Zap },
  { name: 'Action', icon: Flame },
  { name: 'Thriller', icon: Skull },
  { name: 'Cyberpunk', icon: Bot },
  { name: 'Comedy', icon: Smile },
  { name: 'Romance', icon: Heart },
];

const GenreFilter = () => {
  const dispatch = useDispatch();
  const { selectedGenre } = useSelector((state) => state.movies);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {GENRES.map(({ name, icon: Icon }) => {
        const isSelected = selectedGenre === name;
        return (
          <button
            key={name}
            onClick={() => dispatch(setSelectedGenre(name))}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
              isSelected
                ? 'bg-gradient-to-r from-brand-primary to-rose-600 text-white border-brand-primary shadow-lg shadow-brand-primary/40 scale-105'
                : 'bg-surface-secondary/70 hover:bg-surface-secondary text-gray-300 hover:text-white border-white/10 hover:border-white/20'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white animate-bounce' : 'text-brand-primary'}`} />
            <span>{name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default GenreFilter;
