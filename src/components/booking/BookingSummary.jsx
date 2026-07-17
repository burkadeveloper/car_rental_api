import React from "react";
import { useTranslation } from "react-i18next";
import BookingStatusBadge from "../common/BookingStatusBadge";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dateHelpers";
import Button from "../common/Button";

const BookingSummary = ({ booking, onCancel, onStatusUpdate, isStaff }) => {
  const { t } = useTranslation();

  if (!booking) return null;

  const canCancel =
    ["pending", "confirmed"].includes(booking.status) &&
    new Date(booking.pickupDate) > new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <div className="bg-white shadow-md rounded p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h3 className="text-lg font-bold">
            {booking.car?.make} {booking.car?.model}
          </h3>
          <p>
            <strong>Booking ID:</strong> {booking._id}
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
          {booking.driverDetails?.name && (
            <p>
              <strong>Driver:</strong> {booking.driverDetails.name}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2 mt-4 md:mt-0">
          {isStaff && (
            <select
              value={booking.status}
              onChange={(e) =>
                onStatusUpdate && onStatusUpdate(booking._id, e.target.value)
              }
              className="input py-1 text-sm w-32"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirm</option>
              <option value="active">Active</option>
              <option value="completed">Complete</option>
              <option value="cancelled">Cancel</option>
            </select>
          )}
          {!isStaff && canCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel && onCancel(booking._id)}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
