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

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex gap-4">
        {/* Car Image */}
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            className="w-24 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-24 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-gray-600">{car.licensePlate}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(booking.pickupDate)} →{" "}
                {formatDate(booking.dropoffDate)}
              </p>
              <p className="text-sm font-medium mt-1">
                {formatCurrency(booking.totalCost)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <BookingStatusBadge status={booking.status} />
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : booking.paymentStatus === "refunded"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.paymentStatus || "pending"}
                </span>
                {user.badge && (
                  <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                    {user.badge}
                  </span>
                )}
              </div>
              {booking.driverDetails?.name && (
                <p className="text-xs text-gray-500 mt-1">
                  Driver: {booking.driverDetails.name}
                </p>
              )}
              {booking.paymentMethod && (
                <p className="text-xs text-gray-500">
                  Payment: {booking.paymentMethod}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Link
                to={`/bookings/${booking._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Details
              </Link>
              {booking.status !== "completed" &&
                booking.status !== "cancelled" && (
                  <Link
                    to={`/bookings/${booking._id}/edit`}
                    className="text-gray-600 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
