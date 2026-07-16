import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { PENALTY_RATE_PER_HOUR } from "../../utils/constants";

// --- Async thunks ---

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post("/bookings", bookingData);
      toast.success("Booking created successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to create booking");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/bookings/my");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/bookings");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchCancelledBookings = createAsyncThunk(
  "bookings/fetchCancelled",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/bookings/cancelled");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const pickUpCar = createAsyncThunk(
  "bookings/pickUp",
  async ({ bookingId, location }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/pickup`, {
        location,
      });
      toast.success("Car picked up successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to pick up car");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const returnCar = createAsyncThunk(
  "bookings/return",
  async ({ bookingId, penalty, dropoffLocation }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/return`, {
        penalty,
        dropoffLocation,
      });
      toast.success("Car returned successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to return car");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const refundBooking = createAsyncThunk(
  "bookings/refund",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/refund`);
      toast.success("Refund processed successfully");
      return response.data;
    } catch (error) {
      toast.error("Refund failed");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking status updated to "${status}"`);
      return response.data;
    } catch (error) {
      toast.error("Failed to update booking status");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const calculatePenalty = createAsyncThunk(
  "bookings/calculatePenalty",
  async ({ bookingId }, { getState, rejectWithValue }) => {
    try {
      // Optionally, you can compute penalty on frontend or call an API
      // Here we call the API to get the updated booking with penalty
      const response = await api.get(`/bookings/${bookingId}/penalty`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// --- Slice ---

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    currentBooking: null,
    cancelledBookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    // local penalty calculation (if you don't want to call API)
    updatePenaltyLocal: (state, action) => {
      const { bookingId, penalty } = action.payload;
      if (state.currentBooking && state.currentBooking.id === bookingId) {
        state.currentBooking.penalty = penalty;
      }
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (booking) booking.penalty = penalty;
    },
  },
  extraReducers: (builder) => {
    builder
      // createBooking
      .addCase(createBooking.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // fetchUserBookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // fetchAllBookings
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // fetchCancelledBookings
      .addCase(fetchCancelledBookings.fulfilled, (state, action) => {
        state.cancelledBookings = action.payload;
      })
      .addCase(fetchCancelledBookings.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // pickUpCar
      .addCase(pickUpCar.fulfilled, (state, action) => {
        const updated = action.payload;
        state.currentBooking = updated;
        const idx = state.bookings.findIndex((b) => b.id === updated.id);
        if (idx !== -1) state.bookings[idx] = updated;
      })
      .addCase(pickUpCar.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // returnCar
      .addCase(returnCar.fulfilled, (state, action) => {
        const updated = action.payload;
        state.currentBooking = updated;
        const idx = state.bookings.findIndex((b) => b.id === updated.id);
        if (idx !== -1) state.bookings[idx] = updated;
      })
      .addCase(returnCar.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // refundBooking
      .addCase(refundBooking.fulfilled, (state, action) => {
        const refunded = action.payload;
        const idx = state.cancelledBookings.findIndex(
          (b) => b.id === refunded.id,
        );
        if (idx !== -1) state.cancelledBookings[idx] = refunded;
        // also update in bookings if exists
        const idx2 = state.bookings.findIndex((b) => b.id === refunded.id);
        if (idx2 !== -1) state.bookings[idx2] = refunded;
      })
      // updateBookingStatus
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.bookings.findIndex((b) => b.id === updated.id);
        if (idx !== -1) state.bookings[idx] = updated;
        if (state.currentBooking && state.currentBooking.id === updated.id) {
          state.currentBooking = updated;
        }
      })
      // calculatePenalty
      .addCase(calculatePenalty.fulfilled, (state, action) => {
        const updated = action.payload;
        if (state.currentBooking && state.currentBooking.id === updated.id) {
          state.currentBooking = updated;
        }
        const idx = state.bookings.findIndex((b) => b.id === updated.id);
        if (idx !== -1) state.bookings[idx] = updated;
      });
  },
  setCurrentBooking: (state, action) => {
    state.currentBooking = action.payload;
  },
  clearCurrentBooking: (state) => {
    state.currentBooking = null;
  },
});

export const { setCurrentBooking, clearCurrentBooking, updatePenaltyLocal } =
  bookingSlice.actions;
export default bookingSlice.reducer;
