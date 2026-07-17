import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
// import { fetchBookings, updateBookingStatus } from '../../features/bookings/bookingSlice';

const StaffBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    // dispatch(fetchBookings());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    // dispatch(updateBookingStatus({ id, status }));
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">Error loading bookings</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Car
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings?.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4">#{booking.id}</td>
                <td className="px-6 py-4">{booking.customerName}</td>
                <td className="px-6 py-4">{booking.carName}</td>
                <td className="px-6 py-4">
                  {booking.startDate} – {booking.endDate}
                </td>
                <td className="px-6 py-4 capitalize">{booking.status}</td>
                <td className="px-6 py-4 space-x-2">
                  {booking.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(booking.id, "confirmed")
                        }
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(booking.id, "cancelled")
                        }
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(booking.id, "completed")
                      }
                    >
                      Mark Complete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffBookings;
