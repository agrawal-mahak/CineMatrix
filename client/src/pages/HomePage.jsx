import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../store/movieSlice';
import HeroBillboard from '../components/home/HeroBillboard';
import GenreFilter from '../components/home/GenreFilter';
import MovieCard from '../components/home/MovieCard';
import { Loader2, Film } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const { movies, selectedGenre, searchQuery, loading, error } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // Filter movies by genre and search query
  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === 'All' ||
      (movie.genre && movie.genre.includes(selectedGenre));
    const matchesSearch =
      !searchQuery ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre?.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  const featuredMovie = movies[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Featured Hero Billboard Carousel */}
      {featuredMovie && <HeroBillboard featuredMovie={featuredMovie} />}

      {/* Section Header & Genre Filter Chips */}
      <div className="mt-10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
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
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}

      {!loading && filteredMovies.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-base font-semibold">No movies found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
