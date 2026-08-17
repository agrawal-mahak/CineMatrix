import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedGenre } from '../../store/movieSlice';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Thriller', 'Cyberpunk', 'Comedy', 'Drama'];

const GenreFilter = () => {
  const dispatch = useDispatch();
  const { selectedGenre } = useSelector((state) => state.movies);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 my-4 scrollbar-none">
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => dispatch(setSelectedGenre(genre))}
          className={`px-4 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-all ${
            selectedGenre === genre
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105'
              : 'bg-surface-secondary hover:bg-surface-tertiary text-gray-400 hover:text-gray-200 border border-white/5'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
