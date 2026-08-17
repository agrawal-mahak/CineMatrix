import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const holdSeatsAction = createAsyncThunk(
  'booking/holdSeats',
  async ({ showId, seatNumbers }, { rejectWithValue }) => {
    try {
      const response = await API.post('/bookings/hold', { showId, seatNumbers });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to hold seats');
    }
  }
);

export const confirmBookingAction = createAsyncThunk(
  'booking/confirmBooking',
  async ({ bookingId, selectedSnacks }, { rejectWithValue }) => {
    try {
      const response = await API.post('/bookings/confirm', { bookingId, selectedSnacks });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Booking confirmation failed');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    selectedShow: null,
    selectedSeats: [], // Array of seat numbers: ["A1", "A2"]
    selectedSnacks: [], // Array of { id, name, price, quantity }
    currentBooking: null,
    holdExpiresAt: null, // ISO Date string for 10-min countdown
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedShow: (state, action) => {
      state.selectedShow = action.payload;
      state.selectedSeats = [];
      state.selectedSnacks = [];
    },
    toggleSeatSelection: (state, action) => {
      const seatNumber = action.payload;
      if (state.selectedSeats.includes(seatNumber)) {
        state.selectedSeats = state.selectedSeats.filter((s) => s !== seatNumber);
      } else {
        if (state.selectedSeats.length >= 8) {
          state.error = 'Maximum 8 seats allowed per booking';
          return;
        }
        state.selectedSeats.push(seatNumber);
        state.error = null;
      }
    },
    updateSnackQuantity: (state, action) => {
      const { snack, delta } = action.payload;
      const existing = state.selectedSnacks.find((s) => s.id === snack.id);

      if (existing) {
        existing.quantity += delta;
        if (existing.quantity <= 0) {
          state.selectedSnacks = state.selectedSnacks.filter((s) => s.id !== snack.id);
        }
      } else if (delta > 0) {
        state.selectedSnacks.push({ ...snack, quantity: 1 });
      }
    },
    clearSeatSelection: (state) => {
      state.selectedSeats = [];
      state.selectedSnacks = [];
      state.error = null;
    },
    clearBookingState: (state) => {
      state.selectedSeats = [];
      state.selectedSnacks = [];
      state.currentBooking = null;
      state.holdExpiresAt = null;
      state.error = null;
    },
    setBookingError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Hold Seats
      .addCase(holdSeatsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(holdSeatsAction.fulfilled, (state, action) => {
        state.loading = false;
        let booking = action.payload.booking;

        // Ensure showId has populated movie and theatre details
        if (state.selectedShow && (!booking.showId || typeof booking.showId === 'string')) {
          booking = {
            ...booking,
            showId: state.selectedShow,
          };
        }

        state.currentBooking = booking;
        state.holdExpiresAt = booking.expiresAt;
      })
      .addCase(holdSeatsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Confirm Booking
      .addCase(confirmBookingAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmBookingAction.fulfilled, (state, action) => {
        state.loading = false;
        let booking = action.payload.booking;

        // Fallback: Preserve showId details from previous state or selectedShow if missing
        if (!booking.showId || typeof booking.showId === 'string') {
          const prevShowId = state.currentBooking?.showId || state.selectedShow;
          if (prevShowId) {
            booking = {
              ...booking,
              showId: prevShowId,
            };
          }
        }

        state.currentBooking = {
          ...state.currentBooking,
          ...booking,
        };
      })
      .addCase(confirmBookingAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedShow,
  toggleSeatSelection,
  updateSnackQuantity,
  clearSeatSelection,
  clearBookingState,
  setBookingError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
