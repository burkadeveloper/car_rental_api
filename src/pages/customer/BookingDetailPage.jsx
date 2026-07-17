import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetBookingQuery,
  useCancelBookingMutation,
  useUpdateBookingStatusMutation,
} from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import CountdownTimer from "../../components/common/CountdownTimer";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dateHelpers";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const BookingDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: booking, isLoading, refetch } = useGetBookingQuery(id);
  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff" || isAdmin;

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id).unwrap();
        toast.success("Booking cancelled");
        refetch();
      } catch (err) {
        toast.error(err.data?.message || "Cancellation failed");
      }
    }
  };

  if (isLoading) return <Spinner />;
  if (!booking) return <div>Booking not found</div>;

  const canCancel =
    ["pending", "confirmed"].includes(booking.status) &&
    new Date(booking.pickupDate) > new Date(Date.now() + 24 * 60 * 60 * 1000);
  const canEdit = ["pending", "confirmed"].includes(booking.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <div className="bg-white shadow-md rounded p-6">
        <div className="flex justify-between items-start">
          <div>
            <p>
              <strong>Booking ID:</strong> {booking._id}
            </p>
            <p>
              <strong>Car:</strong> {booking.car?.make} {booking.car?.model}
            </p>
            <p>
              <strong>Pickup:</strong> {formatDate(booking.pickupDate)} at{" "}
              {booking.pickupTime}
            </p>
            <p>
              <strong>Dropoff:</strong> {formatDate(booking.dropoffDate)} at{" "}
              {booking.dropoffTime}
            </p>
            <p>
              <strong>Location:</strong> {booking.pickupLocation} →{" "}
              {booking.dropoffLocation}
            </p>
            <p>
              <strong>Total:</strong> {formatCurrency(booking.totalCost)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <BookingStatusBadge status={booking.status} />
            </p>
            <p>
              <strong>Payment:</strong> {booking.paymentStatus} (
              {booking.paymentMethod || "N/A"})
            </p>
          </div>
          <div className="space-y-2">
            {canCancel && (
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </Button>
            )}
            {canEdit && (
              <Link
                to={`/bookings/${booking._id}/edit`}
                className="btn btn-secondary block"
              >
                Edit Booking
              </Link>
            )}
            <Button variant="secondary" onClick={() => navigate("/bookings")}>
              Back to Bookings
            </Button>
          </div>
        </div>

        {booking.driverDetails?.name && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold">Driver Details</h3>
            <p>Name: {booking.driverDetails.name}</p>
            <p>License: {booking.driverDetails.licenseNumber}</p>
            <p>Phone: {booking.driverDetails.phone}</p>
          </div>
        )}

        {/* Countdown & Penalty for active bookings */}
        {booking.status === "active" && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="font-medium">⏳ Time remaining to return:</p>
            <CountdownTimer
              targetDate={booking.dropoffDate}
              onExpire={() =>
                toast.warn("Rental period has ended. Please return the car.")
              }
            />
            {booking.overdueHours > 0 && (
              <p className="text-red-600 mt-1">
                ⚠️ Overdue by {booking.overdueHours} hour(s). Penalty:{" "}
                {formatCurrency(booking.penaltyAmount)}
              </p>
            )}
            {booking.returnedAt && (
              <p className="text-green-600">
                Returned at: {formatDate(booking.returnedAt)}
              </p>
            )}
          </div>
        )}

        {/* Admin actions */}
        {isAdmin && booking.status === "active" && (
          <div className="mt-4 p-3 bg-gray-50 rounded flex gap-2">
            <span className="text-sm text-gray-500">Admin: </span>
            <Link
              to={`/admin/bookings?highlight=${booking._id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Manage in Admin Panel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailPage;
