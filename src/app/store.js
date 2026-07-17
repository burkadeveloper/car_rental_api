import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import carReducer from "../features/cars/carSlice";
import bookingReducer from "../features/bookings/bookingSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import { apiSlice } from "../api/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carReducer,
    bookings: bookingReducer,
    notifications: notificationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});
