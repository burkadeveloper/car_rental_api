import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetCarQuery,
  useGetCarReviewsQuery,
  useCreateReviewMutation,
} from "../../api/apiSlice";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/currency";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const CarDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: car, isLoading } = useGetCarQuery(id);
  const { data: reviews, refetch: refetchReviews } = useGetCarReviewsQuery(id);
  const [createReview, { isLoading: reviewLoading }] =
    useCreateReviewMutation();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const isAdminOrStaff =
    user && (user.role === "admin" || user.role === "staff");
  const canBook =
    car?.status === "available" && car?.isActive && !isAdminOrStaff;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await createReview({
        carId: id,
        bookingId: "some-booking-id",
        rating,
        comment,
      }).unwrap();
      setComment("");
      setRating(5);
      refetchReviews();
    } catch (err) {
      setReviewError(err.data?.message || "Failed to submit review");
    }
  };

  if (isLoading) return <Spinner />;
  if (!car) return <div>Car not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={
                car.images && car.images[0]
                  ? car.images[0]
                  : "/placeholder-car.jpg"
              }
              alt={car.make}
              className="w-full h-96 object-cover"
            />
          </div>
          {car.images && car.images.length > 1 && (
            <div className="flex mt-2 space-x-2 overflow-x-auto">
              {car.images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`car ${idx}`}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            {car.make} {car.model}
          </h1>
          <p className="text-gray-600">
            {car.year} · {car.transmission} · {car.fuelType}
          </p>
          <p className="text-gray-700 mt-2">{car.location}</p>
          <div className="mt-4">
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(car.dailyRate)}
            </span>
            <span className="text-gray-600"> / day</span>
          </div>
          {car.weeklyRate && (
            <p className="text-gray-600">
              Weekly rate: {formatCurrency(car.weeklyRate)}
            </p>
          )}
          <p className="mt-4">
            <strong>Security Deposit:</strong>{" "}
            {formatCurrency(car.securityDeposit)}
          </p>
          <p className="mt-2">
            <strong>Seating Capacity:</strong> {car.seatingCapacity}
          </p>
          <div className="mt-2">
            <strong>Status:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                car.status === "available"
                  ? "bg-green-100 text-green-800"
                  : car.status === "rented"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {car.status}
            </span>
          </div>
          {car.features && car.features.length > 0 && (
            <div className="mt-4">
              <strong>{t("features")}:</strong>
              <ul className="list-disc pl-5 mt-1">
                {car.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4">
            <p>
              <strong>{t("description")}:</strong>
            </p>
            <p className="text-gray-700">
              {car.description?.en || "No description"}
            </p>
          </div>

          {canBook ? (
            <Link
              to={`/book/${car._id}`}
              className="btn btn-primary mt-6 inline-block"
            >
              {t("bookNow")}
            </Link>
          ) : isAdminOrStaff ? (
            <div className="mt-6 p-3 bg-gray-100 rounded text-gray-600">
              <strong>Admin view</strong> – This car is{" "}
              <span className="font-medium">{car.status}</span>.
              {car.status === "rented" &&
                " It is currently rented and cannot be booked by customers."}
            </div>
          ) : (
            <div className="mt-6 p-3 bg-gray-100 rounded text-gray-600">
              {car.status === "rented"
                ? "This car is currently rented and not available for booking."
                : car.status === "maintenance"
                  ? "This car is under maintenance."
                  : "This car is not available for booking."}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t("reviews")}</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="border-b pb-4">
                <div className="flex items-center">
                  <span className="font-medium">
                    {rev.user?.name || "Anonymous"}
                  </span>
                  <span className="ml-2 text-yellow-500">⭐ {rev.rating}</span>
                </div>
                <p className="text-gray-700 mt-1">{rev.comment}</p>
                <span className="text-sm text-gray-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="mt-6 max-w-md">
            <h3 className="text-lg font-semibold mb-2">{t("writeReview")}</h3>
            {reviewError && <div className="text-red-500">{reviewError}</div>}
            <div className="mb-3">
              <label className="label">{t("rating")}</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="input"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label={t("comment")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" disabled={reviewLoading}>
              {reviewLoading ? t("loading") : t("submit")}
            </Button>
          </form>
        ) : (
          <p className="mt-4">
            Please{" "}
            <Link to="/login" className="text-blue-600">
              login
            </Link>{" "}
            to write a review.
          </p>
        )}
      </div>
    </div>
  );
};

export default CarDetailPage;
