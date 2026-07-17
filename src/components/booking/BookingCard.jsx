import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BookingStatusBadge from "../common/BookingStatusBadge";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dateHelpers";

const BookingCard = ({ booking }) => {
  const { t } = useTranslation();
  const car = booking.car || {};
  const user = booking.user || {};

  // Payment status colors
  const paymentStatusColors = {
    paid: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    refunded: "bg-red-100 text-red-800 border-red-200",
    failed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200/80 hover:border-gray-300 transition-all duration-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-5 p-5">
        {/* Car Image */}
        <div className="flex-shrink-0">
          {car.images && car.images.length > 0 ? (
            <img
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              className="w-full sm:w-32 h-24 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-full sm:w-32 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            {/* Left: Car details */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {car.make} {car.model}
                </h3>
                {user.badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    {user.badge}
                  </span>
                )}
              </div>

              {/* License plate */}
              {car.licensePlate && (
                <div className="text-sm text-gray-600">
                  <span className="text-gray-400">License:</span>{" "}
                  <span className="font-mono uppercase">
                    {car.licensePlate}
                  </span>
                </div>
              )}

              {/* Date range */}
              <div className="text-sm text-gray-700">
                <span className="text-gray-400">Dates:</span>{" "}
                {formatDate(booking.pickupDate)}
                <span className="mx-2 text-gray-300">→</span>
                {formatDate(booking.dropoffDate)}
              </div>

              {/* Price */}
              <div className="text-sm font-medium text-gray-800">
                <span className="text-gray-400 font-normal">Total:</span>{" "}
                {formatCurrency(booking.totalCost)}
              </div>

              {/* Driver details */}
              {booking.driverDetails?.name && (
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">Driver:</span>{" "}
                  {booking.driverDetails.name}
                  {booking.driverDetails.phone &&
                    ` (${booking.driverDetails.phone})`}
                </div>
              )}

              {/* Payment method */}
              {booking.paymentMethod && (
                <div className="text-xs text-gray-500 capitalize">
                  <span className="text-gray-400">Payment:</span>{" "}
                  {booking.paymentMethod.replace(/_/g, " ")}
                </div>
              )}
            </div>

            {/* Right: Statuses and Actions */}
            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Booking Status */}
                <BookingStatusBadge status={booking.status} />

                {/* Payment Status */}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    paymentStatusColors[booking.paymentStatus] ||
                    paymentStatusColors.pending
                  }`}
                >
                  {booking.paymentStatus || "pending"}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-1">
                <Link
                  to={`/bookings/${booking._id}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  View
                </Link>
                {booking.status !== "completed" &&
                  booking.status !== "cancelled" && (
                    <Link
                      to={`/bookings/${booking._id}/edit`}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
