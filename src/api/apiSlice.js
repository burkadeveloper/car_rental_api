import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const getTokenFromCookies = () => {
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "/api/v1",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getTokenFromCookies();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const customBaseQuery = retry(
  async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 429) {
      retry.fail(result.error);
    }
    return result;
  },
  { maxRetries: 2 },
);

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["User", "Car", "Booking", "Coupon", "Ticket", "Notification"],
  endpoints: (builder) => ({
    // ─── AUTH ──────────────────────────────────────────────
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `/auth/verify-email/${token}`,
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, newPassword },
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfilePicture: builder.mutation({
      query: (formData) => ({
        url: "/auth/profile-picture",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    sendPhoneOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyPhoneOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    uploadLicenseImage: builder.mutation({
      query: (formData) => ({
        url: "/auth/upload-license",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    uploadIdImage: builder.mutation({
      query: (formData) => ({
        url: "/auth/upload-id",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // ─── CARS ──────────────────────────────────────────────
    getCars: builder.query({
      query: (params) => ({ url: "/cars", params }),
      providesTags: ["Car"],
      keepUnusedDataFor: 60,
    }),
    getCar: builder.query({
      query: (id) => `/cars/${id}`,
      providesTags: (result, error, id) => [{ type: "Car", id }],
      keepUnusedDataFor: 300,
    }),
    createCar: builder.mutation({
      query: (formData) => ({
        url: "/cars",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Car"],
    }),
    updateCar: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cars/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Car", id }],
    }),
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `/cars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Car"],
    }),

    // ─── BOOKINGS ──────────────────────────────────────────
    getMyBookings: builder.query({
      query: () => "/bookings",
      providesTags: ["Booking"],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: false,
    }),
    getBooking: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
      keepUnusedDataFor: 300,
    }),
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking", "Car"],
    }),
    updateBooking: builder.mutation({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Booking", id }],
    }),
    adminCancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/admin/cancel/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Booking", id }],
    }),
    markReturned: builder.mutation({
      query: (id) => ({
        url: `/bookings/admin/return/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    // ─── PAYMENTS ──────────────────────────────────────────
    initiatePayment: builder.mutation({
      query: ({ bookingId, method }) => ({
        url: "/payments/initiate",
        method: "POST",
        body: { bookingId, method },
      }),
    }),

    // ─── REVIEWS ───────────────────────────────────────────
    getCarReviews: builder.query({
      query: (carId) => `/reviews/car/${carId}`,
      keepUnusedDataFor: 300,
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
    }),

    // ─── COUPONS ───────────────────────────────────────────
    getCoupons: builder.query({
      query: () => "/coupons",
      providesTags: ["Coupon"],
      keepUnusedDataFor: 300,
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/coupons/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Coupon", id }],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
    validateCoupon: builder.mutation({
      query: ({ code, bookingTotal }) => ({
        url: "/coupons/validate",
        method: "POST",
        body: { code, bookingTotal },
      }),
    }),

    // ─── TICKETS ───────────────────────────────────────────
    getTickets: builder.query({
      query: () => "/tickets",
      providesTags: ["Ticket"],
      keepUnusedDataFor: 300,
    }),
    getTicket: builder.query({
      query: (id) => `/tickets/${id}`,
      providesTags: (result, error, id) => [{ type: "Ticket", id }],
    }),
    createTicket: builder.mutation({
      query: (data) => ({
        url: "/tickets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Ticket"],
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Ticket", id }],
    }),
    addTicketResponse: builder.mutation({
      query: ({ id, message }) => ({
        url: `/tickets/${id}/response`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Ticket", id }],
    }),
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ticket"],
    }),

    // ─── ADMIN ─────────────────────────────────────────────
    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["User"],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: false,
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    toggleUserActive: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/toggle`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    getUserBookings: builder.query({
      query: (userId) => `/admin/users/${userId}/bookings`,
      providesTags: ["Booking"],
      keepUnusedDataFor: 300,
    }),
    getAllBookings: builder.query({
      query: () => "/admin/bookings",
      providesTags: ["Booking"],
      keepUnusedDataFor: 300,
    }),
    getBookedCars: builder.query({
      query: () => "/admin/booked-cars",
      providesTags: ["Booking"],
      keepUnusedDataFor: 60,
    }),
    getRevenueReport: builder.query({
      query: ({ from, to }) => `/admin/reports/revenue?from=${from}&to=${to}`,
      keepUnusedDataFor: 600,
      refetchOnMountOrArgChange: false,
    }),
    getUtilisationReport: builder.query({
      query: () => "/admin/reports/utilisation",
      keepUnusedDataFor: 600,
      refetchOnMountOrArgChange: false,
    }),

    // ─── NOTIFICATIONS ─────────────────────────────────────
    getNotifications: builder.query({
      query: () => "/notifications",
      providesTags: ["Notification"],
      keepUnusedDataFor: 60,
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  // Auth
  useGetMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useSendPhoneOTPMutation,
  useVerifyPhoneOTPMutation,
  useUploadLicenseImageMutation,
  useUploadIdImageMutation,

  // Cars
  useGetCarsQuery,
  useGetCarQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,

  // Bookings
  useGetMyBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useAdminCancelBookingMutation,
  useMarkReturnedMutation,

  // Payments
  useInitiatePaymentMutation,

  // Reviews
  useGetCarReviewsQuery,
  useCreateReviewMutation,

  // Coupons
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,

  // Tickets
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketStatusMutation,
  useAddTicketResponseMutation,
  useDeleteTicketMutation,

  // Admin
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useGetUserBookingsQuery,
  useGetAllBookingsQuery,
  useGetBookedCarsQuery,
  useGetRevenueReportQuery,
  useGetUtilisationReportQuery,

  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = apiSlice;
