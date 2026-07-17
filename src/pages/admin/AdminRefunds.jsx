import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../../components/common/Button";
import { Spinner } from "../../components/common/Spinner";
import {
  fetchCancelledBookings,
  refundBooking,
} from "../../features/bookings/bookingSlice";

const AdminRefunds = () => {
  const dispatch = useDispatch();
  const { cancelledBookings, loading, error } = useSelector(
    (state) => state.bookings,
  );

  useEffect(() => {
    dispatch(fetchCancelledBookings());
  }, [dispatch]);

  const handleRefund = (bookingId) => {
    if (window.confirm("Refund this booking?")) {
      dispatch(refundBooking(bookingId));
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return <div className="text-red-500">Error loading cancelled bookings</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Refund Cancelled Bookings</h1>
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Car
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Refund Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cancelledBookings?.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4">#{booking.id}</td>
                <td className="px-6 py-4">{booking.carName}</td>
                <td className="px-6 py-4">{booking.customerName}</td>
                <td className="px-6 py-4">{booking.totalAmount} birr</td>
                <td className="px-6 py-4">
                  {booking.refunded ? "Refunded" : "Pending"}
                </td>
                <td className="px-6 py-4">
                  {!booking.refunded && (
                    <Button size="sm" onClick={() => handleRefund(booking.id)}>
                      Refund
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cancelledBookings?.length === 0 && (
          <div className="p-4 text-gray-500">No cancelled bookings.</div>
        )}
      </div>
    </div>
  );
};

export default AdminRefunds;
