import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetBookingQuery,
  useUpdateBookingMutation,
} from "../../api/apiSlice";
import BookingForm from "../../components/booking/BookingForm";
import Spinner from "../../components/common/Spinner";
import { toast } from "react-toastify";

const EditBookingPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: booking, isLoading, error } = useGetBookingQuery(id);
  const [updateBooking, { isLoading: updating }] = useUpdateBookingMutation();

  const handleSubmit = async (formData) => {
    try {
      await updateBooking({ id, data: formData }).unwrap();
      toast.success("Booking updated successfully");
      navigate(`/bookings/${id}`);
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">Error loading booking</div>;
  if (!booking) return <div>Booking not found</div>;

  // Prepare initial data for form
  const initialData = {
    ...booking,
    pickupDate: booking.pickupDate?.split("T")[0] || "",
    dropoffDate: booking.dropoffDate?.split("T")[0] || "",
    driverName: booking.driverDetails?.name || "",
    driverLicense: booking.driverDetails?.licenseNumber || "",
    driverPhone: booking.driverDetails?.phone || "",
    pickupLat: booking.pickupLat || null,
    pickupLng: booking.pickupLng || null,
    dropoffLat: booking.dropoffLat || null,
    dropoffLng: booking.dropoffLng || null,
    extras: booking.extras || [],
    _id: booking._id,
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Booking</h2>
      <BookingForm
        car={booking.car}
        onSubmit={handleSubmit}
        isLoading={updating}
        initialData={initialData}
      />
    </div>
  );
};

export default EditBookingPage;
