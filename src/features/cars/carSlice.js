import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";

// Async thunks (unchanged)
export const fetchAllCars = createAsyncThunk(
  "cars/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cars");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchCarById = createAsyncThunk(
  "cars/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/cars/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateCarStatus = createAsyncThunk(
  "cars/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cars/${id}/status`, { status });
      toast.success(`Car status updated to "${status}"`);
      return response.data;
    } catch (error) {
      toast.error("Failed to update car status");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateCarLocation = createAsyncThunk(
  "cars/updateLocation",
  async ({ id, lat, lng }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cars/${id}/location`, { lat, lng });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState = {
  cars: [],
  currentCar: null,
  loading: false,
  error: null,
  // ✅ ADD: filters object
  filters: {
    location: "",
    startDate: "",
    endDate: "",
    minPrice: "",
    maxPrice: "",
    fuel: "",
    transmission: "",
    seating: "",
  },
};

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    clearCurrentCar: (state) => {
      state.currentCar = null;
    },
    // ✅ ADD: setFilters action
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // ✅ ADD: clearFilters action
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchAllCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCar = action.payload;
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCarStatus.fulfilled, (state, action) => {
        const updatedCar = action.payload;
        const index = state.cars.findIndex((c) => c.id === updatedCar.id);
        if (index !== -1) {
          state.cars[index] = updatedCar;
        }
        if (state.currentCar && state.currentCar.id === updatedCar.id) {
          state.currentCar = updatedCar;
        }
      })
      .addCase(updateCarLocation.fulfilled, (state, action) => {
        const updatedCar = action.payload;
        const index = state.cars.findIndex((c) => c.id === updatedCar.id);
        if (index !== -1) {
          state.cars[index] = updatedCar;
        }
        if (state.currentCar && state.currentCar.id === updatedCar.id) {
          state.currentCar = updatedCar;
        }
      });
  },
});

// ✅ Export actions
export const { clearCurrentCar, setFilters, clearFilters } = carSlice.actions;
export default carSlice.reducer;
