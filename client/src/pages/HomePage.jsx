import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../store/movieSlice';
import HeroBillboard from '../components/home/HeroBillboard';
import GenreFilter from '../components/home/GenreFilter';
import MovieCard from '../components/home/MovieCard';
import TrailerModal from '../components/common/TrailerModal';
import { Loader2, Film, Sparkles, Filter } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const { movies, selectedGenre, searchQuery, loading, error } = useSelector(
    (state) => state.movies
  );

  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [trailerState, setTrailerState] = useState({ isOpen: false, url: '', title: '' });

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // Filter movies by genre, search query, format, and language
  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === 'All' || (movie.genre && movie.genre.includes(selectedGenre));
    const matchesSearch =
      !searchQuery ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre?.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFormat =
      selectedFormat === 'All' || (movie.format && movie.format.includes(selectedFormat));
    const matchesLanguage =
      selectedLanguage === 'All' || (movie.language && movie.language.includes(selectedLanguage));

    return matchesGenre && matchesSearch && matchesFormat && matchesLanguage;
  });

  const featuredMovie = movies[0];

  const handleOpenTrailer = (movie) => {
    setTrailerState({
      isOpen: true,
      url: movie.trailerUrl || 'https://www.youtube.com/embed/YoHD9XEInc0',
      title: movie.title,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* Featured Hero Billboard */}
      {featuredMovie && (
        <HeroBillboard featuredMovie={featuredMovie} onWatchTrailer={handleOpenTrailer} />
      )}

      {/* BookMyShow Quick Filters Bar (Format & Language) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface-secondary/50 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-primary" /> Filter Movies:
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Format:</span>
          {['All', '2D', '3D', 'IMAX 3D', '4DX'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedFormat === fmt
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Language:</span>
          {['All', 'English', 'Hindi', 'Telugu', 'Tamil'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedLanguage === lang
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Section Header & Genre Filter Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Film className="w-6 h-6 text-brand-primary" />
            <span>Now Showing in Cinemas</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Book tickets for the latest blockbuster releases</p>
        </div>

        {/* Category Pills */}
        <GenreFilter />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-3" />
          <p className="text-sm font-semibold">Loading movie catalog...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center my-8">
          {error}
        </div>
      )}

      {/* 4-Column Movie Poster Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} onWatchTrailer={() => handleOpenTrailer(movie)} />
          ))}
        </div>
      )}

      {!loading && filteredMovies.length === 0 && (
        <div className="text-center py-16 text-gray-400 rounded-2xl bg-surface-secondary/30 border border-white/5 space-y-2">
          <Sparkles className="w-10 h-10 text-gray-500 mx-auto" />
          <p className="text-base font-semibold text-gray-300">No movies found matching your selected filters.</p>
          <p className="text-xs text-gray-500">Try resetting genre, format, or search keywords.</p>
        </div>
      )}

      {/* Trailer Video Player Modal */}
      <TrailerModal
        isOpen={trailerState.isOpen}
        onClose={() => setTrailerState({ isOpen: false, url: '', title: '' })}
        trailerUrl={trailerState.url}
        movieTitle={trailerState.title}
      />
    </div>
  );
};

export default HomePage;
