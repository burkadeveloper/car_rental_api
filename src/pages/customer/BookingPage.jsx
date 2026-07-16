import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useGetCarQuery, useCreateBookingMutation } from "../../api/apiSlice";
import { useAuth } from "../../hooks/useAuth";
import { isProfileComplete } from "../../utils/validators";
import { setCurrentBooking } from "../../features/bookings/bookingSlice";
import BookingForm from "../../components/booking/BookingForm";
import Spinner from "../../components/common/Spinner";
import { toast } from "react-toastify";

const BookingPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const {
    data: car,
    isLoading: carLoading,
    error: carError,
  } = useGetCarQuery(id);
  const [createBooking, { isLoading: bookingLoading }] =
    useCreateBookingMutation();

  // ✅ Check if profile is complete; if not, redirect to profile completion page
  useEffect(() => {
    if (user && !isProfileComplete(user)) {
      toast.warning("Please complete your profile before booking.");
      navigate("/profile/complete", { state: { returnTo: `/book/${id}` } });
    }
  }, [user, id, navigate]);

  // If profile is incomplete, we don't render the form (the effect will redirect)
  if (user && !isProfileComplete(user)) {
    return null; // or a loading spinner while redirecting
  }

  const handleSubmit = async (bookingData) => {
    try {
      const result = await createBooking({
        carId: id,
        ...bookingData,
      }).unwrap();
      if (result.booking && result.booking._id) {
        dispatch(setCurrentBooking(result));
        toast.success("Booking created! Redirecting to payment...");
        navigate(`/payment/${result.booking._id}`);
      } else {
        toast.error("Booking created but missing ID.");
      }
    } catch (err) {
      // If backend returns 403 with redirect, handle it
      if (err?.data?.redirect) {
        navigate(err.data.redirect);
      } else {
        const errorMsg =
          err.data?.message || "Booking failed. Please try again.";
        toast.error(errorMsg);
      }
      console.error("Booking error:", err);
    }
  };

  if (carLoading) return <Spinner />;
  if (carError)
    return <div className="text-red-500">Error loading car details.</div>;
  if (!car) return <div>Car not found.</div>;

  // Optional: prevent booking if car not available (though backend handles it)
  if (car.status !== "available") {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Car Not Available</h2>
        <p className="text-gray-600">
          This car is currently {car.status} and cannot be booked.
        </p>
        <button
          onClick={() => navigate("/cars")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go back to cars
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      // Inside the return, add car image:
      <div className="flex items-center gap-4 mb-4">
        {car.images && car.images.length > 0 && (
          <img
            src={car.images[0]}
            alt={car.make}
            className="w-32 h-24 object-cover rounded"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">
            Book {car.make} {car.model}
          </h2>
          <p className="text-gray-600">
            {car.year} · {car.transmission}
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        Book {car.make} {car.model}
      </h2>
      <BookingForm
        car={car}
        onSubmit={handleSubmit}
        isLoading={bookingLoading}
      />
    </div>
  );
};

export default BookingPage;
