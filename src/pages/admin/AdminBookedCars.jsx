import React from "react";
import { useTranslation } from "react-i18next";
import { useGetBookedCarsQuery } from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import CountdownTimer from "../../components/common/CountdownTimer";
import { formatDate } from "../../utils/dateHelpers";
import { formatCurrency } from "../../utils/currency";

const AdminBookedCars = () => {
  const { t } = useTranslation();
  const { data: bookings, isLoading, error, refetch } = useGetBookedCarsQuery();

  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div className="text-red-500 p-4">
        Failed to load booked cars.{" "}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Currently Booked Cars</h1>
      {bookings && bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-lg shadow-md bg-white p-4"
            >
              {/* Car Image */}
              <div className="h-40 bg-gray-200 rounded-md overflow-hidden mb-3">
                {booking.car?.images && booking.car.images.length > 0 ? (
                  <img
                    src={booking.car.images[0]}
                    alt={`${booking.car.make} ${booking.car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold">
                {booking.car?.make} {booking.car?.model}
              </h3>
              <p className="text-sm text-gray-600">
                {booking.car?.licensePlate}
              </p>
              <p className="text-sm">
                <span className="font-medium">Booked by:</span>
                <span className="ml-1 flex items-center">
                  {booking.user?.profilePicture && (
                    <img
                      src={booking.user.profilePicture}
                      alt={booking.user.name}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                  )}
                  {booking.user?.name || "Unknown"}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Pickup:</span>{" "}
                {formatDate(booking.pickupDate)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Dropoff:</span>{" "}
                {formatDate(booking.dropoffDate)}
              </p>
              <p className="text-sm font-medium mt-2">
                Total: {formatCurrency(booking.totalCost)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Status: {booking.status}
              </p>

              {/* Countdown & Penalty for active */}
              {booking.status === "active" && (
                <div className="mt-2 p-2 bg-blue-50 rounded">
                  <p className="text-sm font-medium">⏳ Return in:</p>
                  <CountdownTimer targetDate={booking.dropoffDate} />
                  {booking.overdueHours > 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠️ Overdue: {booking.overdueHours}h, Penalty:{" "}
                      {formatCurrency(booking.penaltyAmount)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No cars currently booked.</p>
      )}
    </div>
  );
};

export default AdminBookedCars;
