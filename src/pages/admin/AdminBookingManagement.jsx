import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useAdminCancelBookingMutation,
  useMarkReturnedMutation,
} from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import CountdownTimer from "../../components/common/CountdownTimer";
import { formatDate } from "../../utils/dateHelpers";
import { formatCurrency } from "../../utils/currency";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminBookingManagement = () => {
  const { t } = useTranslation();
  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = useGetAllBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();
  const [adminCancel] = useAdminCancelBookingMutation();
  const [markReturned] = useMarkReturnedMutation();
  const [filter, setFilter] = useState("all");

  const filteredBookings =
    filter === "all" ? bookings : bookings?.filter((b) => b.status === filter);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Status updated");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    }
  };

  const handleAdminCancel = async (id) => {
    if (!window.confirm("Cancel this booking and refund if paid?")) return;
    try {
      await adminCancel(id).unwrap();
      toast.success("Booking cancelled and refunded (if paid)");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to cancel");
    }
  };

  const handleMarkReturned = async (id) => {
    if (!window.confirm("Mark this car as returned?")) return;
    try {
      await markReturned(id).unwrap();
      toast.success("Car marked as returned");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to mark returned");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div className="text-red-500 p-4">
        Failed to load bookings.{" "}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Management</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "all",
          "pending",
          "confirmed",
          "active",
          "completed",
          "cancelled",
        ].map((s) => (
          <button
            key={s}
            className={`px-3 py-1 rounded ${filter === s ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filteredBookings && filteredBookings.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Car</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Dates</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Payment</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{b._id.slice(-6)}</td>
                  <td className="px-4 py-2 text-sm">
                    {b.car?.make} {b.car?.model}
                    {b.car?.images && b.car.images.length > 0 && (
                      <img
                        src={b.car.images[0]}
                        alt="car"
                        className="w-12 h-8 object-cover inline ml-2 rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {b.user?.name}
                    {b.user?.profilePicture && (
                      <img
                        src={b.user.profilePicture}
                        alt={b.user.name}
                        className="w-6 h-6 rounded-full inline ml-2"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {formatDate(b.pickupDate)} → {formatDate(b.dropoffDate)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {formatCurrency(b.totalCost)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        b.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : b.paymentStatus === "refunded"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {b.paymentStatus || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1 items-center">
                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleStatusUpdate(b._id, e.target.value)
                        }
                        className="input py-1 text-sm w-28"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="active">Active</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>

                      {b.status === "active" && (
                        <>
                          <CountdownTimer targetDate={b.dropoffDate} />
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleMarkReturned(b._id)}
                          >
                            Return
                          </Button>
                          {b.overdueHours > 0 && (
                            <span className="text-red-600 text-xs">
                              Overdue: {b.overdueHours}h / Penalty:{" "}
                              {formatCurrency(b.penaltyAmount)}
                            </span>
                          )}
                        </>
                      )}

                      <Link
                        to={`/bookings/${b._id}/edit`}
                        className="btn btn-secondary text-sm py-1"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleAdminCancel(b._id)}
                        className="btn btn-danger text-sm py-1"
                        disabled={
                          b.status === "completed" || b.status === "cancelled"
                        }
                      >
                        Cancel/Refund
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No bookings found.</p>
      )}
    </div>
  );
};

export default AdminBookingManagement;
