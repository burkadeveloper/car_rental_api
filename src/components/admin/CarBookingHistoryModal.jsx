import React from "react";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import { useGetCarBookingsQuery } from "../../api/apiSlice";
import { formatDate } from "../../utils/dateHelpers";
import { formatCurrency } from "../../utils/currency";
import { Link } from "react-router-dom";

const CarBookingHistoryModal = ({ isOpen, onClose, carId }) => {
  const {
    data: bookings,
    isLoading,
    error,
  } = useGetCarBookingsQuery(carId, {
    skip: !carId || !isOpen,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Car Booking History">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">Failed to load history</p>
      ) : bookings && bookings.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  User
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Dates
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Total
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="px-4 py-2 text-sm">
                    <Link
                      to={`/admin/users/${b.user?._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {b.user?.name || "Unknown"}
                    </Link>
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
                        b.status === "completed"
                          ? "bg-green-100"
                          : b.status === "cancelled"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No bookings for this car.
        </p>
      )}
    </Modal>
  );
};

export default CarBookingHistoryModal;
