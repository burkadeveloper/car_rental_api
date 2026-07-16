import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/currency";
import { useAuth } from "../../hooks/useAuth";

const CarCard = ({ car }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdminOrStaff =
    user && (user.role === "admin" || user.role === "staff");

  const image =
    car.images && car.images.length > 0
      ? car.images[0]
      : "/placeholder-car.jpg";
  const isAvailable = car.status === "available" && car.isActive;

  const showBookButton = isAvailable && !isAdminOrStaff;

  const statusColor =
    {
      available: "bg-green-100 text-green-800",
      rented: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
    }[car.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}
          >
            {car.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold truncate">
          {car.make} {car.model}
        </h3>
        <p className="text-gray-600 text-sm">
          {car.year} · {car.transmission}
        </p>
        <p className="text-gray-700 text-sm mt-1">{car.location}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold text-blue-600">
            {formatCurrency(car.dailyRate)}
            <span className="text-sm font-normal text-gray-500">/day</span>
          </span>
          {!isAvailable && !isAdminOrStaff && (
            <span className="text-xs text-gray-500">
              {car.status === "rented" ? "Not available" : car.status}
            </span>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/cars/${car._id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {t("viewDetails")}
          </Link>
          {showBookButton ? (
            <Link
              to={`/book/${car._id}`}
              className="btn btn-primary text-sm px-4 py-1"
            >
              {t("bookNow")}
            </Link>
          ) : (
            <span className="text-xs text-gray-400 italic">
              {isAdminOrStaff ? "Admin view" : "Unavailable"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
