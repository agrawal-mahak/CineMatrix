import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/movies');
      return response.data.movies;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch movies');
    }
  }
);

const savedWatchlist = localStorage.getItem('cinematrix_watchlist')
  ? JSON.parse(localStorage.getItem('cinematrix_watchlist'))
  : [];

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    selectedCity: 'Mumbai',
    selectedGenre: 'All',
    searchQuery: '',
    watchlist: savedWatchlist,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleWatchlist: (state, action) => {
      const movieId = action.payload;
      if (state.watchlist.includes(movieId)) {
        state.watchlist = state.watchlist.filter((id) => id !== movieId);
      } else {
        state.watchlist.push(movieId);
      }
      localStorage.setItem('cinematrix_watchlist', JSON.stringify(state.watchlist));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCity,
  setSelectedGenre,
  setSearchQuery,
  toggleWatchlist,
} = movieSlice.actions;

export default movieSlice.reducer;
