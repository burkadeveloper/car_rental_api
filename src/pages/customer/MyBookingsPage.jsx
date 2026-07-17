import React from "react";
import { useTranslation } from "react-i18next";
import { useGetMyBookingsQuery } from "../../api/apiSlice";
import BookingCard from "../../components/booking/BookingCard";
import Spinner from "../../components/common/Spinner";
import { Link } from "react-router-dom";

const MyBookingsPage = () => {
  const { t } = useTranslation();
  const { data: bookings, isLoading, error, refetch } = useGetMyBookingsQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("bookings")}</h1>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
          <p className="ml-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("bookings")}</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load bookings.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("bookings")}</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No bookings yet.</p>
          <Link
            to="/cars"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("bookings")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
