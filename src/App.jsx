import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public Pages
import HomePage from "./pages/customer/HomePage";
import CarListPage from "./pages/customer/CarListPage";
import CarDetailPage from "./pages/customer/CarDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import VerifyEmailPending from "./pages/auth/VerifyEmailPending";
import VerificationPendingPage from "./pages/auth/VerificationPendingPage";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage";
import NotFoundPage from "./pages/shared/NotFoundPage";

// Customer (logged-in)
import ProfilePage from "./pages/customer/ProfilePage";
import MyBookingsPage from "./pages/customer/MyBookingsPage";
import BookingDetailPage from "./pages/customer/BookingDetailPage";
import BookingPage from "./pages/customer/BookingPage";
import EditBookingPage from "./pages/customer/EditBookingPage";
import PaymentPage from "./pages/customer/PaymentPage";
import SupportPage from "./pages/customer/SupportPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarManagement from "./pages/admin/AdminCarManagement";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminReports from "./pages/admin/AdminReports";
import AdminBookingManagement from "./pages/admin/AdminBookingManagement";
import AdminBookedCars from "./pages/admin/AdminBookedCars";

// Staff Pages
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffBookings from "./pages/staff/StaffBookings";

import ProfileCompletionPage from "./pages/customer/ProfileCompletionPage";

import { useGetMeQuery } from "./api/apiSlice";
import { setUser, logout } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetMeQuery(undefined, {
    skip: !!user,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data.user));
    }
    if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/cars" element={<CarListPage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/profile/complete"
                element={<ProfileCompletionPage />}
              />
              {/* ... other customer routes */}
            </Route>
            <Route
              path="/register"
              element={!user ? <RegisterPage /> : <Navigate to="/" />}
            />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route
              path="/verify-email-pending"
              element={<VerifyEmailPending />}
            />
            <Route
              path="/verify-pending"
              element={<VerificationPendingPage />}
            />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* ===== PROTECTED (CUSTOMER) ===== */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/bookings/:id" element={<BookingDetailPage />} />
              <Route path="/bookings/:id/edit" element={<EditBookingPage />} />
              <Route path="/book/:id" element={<BookingPage />} />
              <Route path="/payment/:bookingId" element={<PaymentPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Route>

            {/* ===== ADMIN ROUTES ===== */}
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/cars" element={<AdminCarManagement />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route
                path="/admin/bookings"
                element={<AdminBookingManagement />}
              />
              <Route path="/admin/booked-cars" element={<AdminBookedCars />} />
            </Route>

            {/* ===== STAFF ROUTES ===== */}
            <Route element={<ProtectedRoute roles={["staff", "admin"]} />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/bookings" element={<StaffBookings />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
