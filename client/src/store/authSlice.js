import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

// Initial state
const token = localStorage.getItem('cinematrix_token');
const savedUser = localStorage.getItem('cinematrix_user')
  ? JSON.parse(localStorage.getItem('cinematrix_user'))
  : null;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    user: savedUser || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    isAuthModalOpen: false,
    authModalTab: 'login', // 'login' | 'register'
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('cinematrix_token');
      localStorage.removeItem('cinematrix_user');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalTab = action.payload || 'login';
      state.error = null;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthModalOpen = false;
        localStorage.setItem('cinematrix_token', action.payload.token);
        localStorage.setItem('cinematrix_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthModalOpen = false;
        localStorage.setItem('cinematrix_token', action.payload.token);
        localStorage.setItem('cinematrix_user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, openAuthModal, closeAuthModal, clearError } = authSlice.actions;
export default authSlice.reducer;
