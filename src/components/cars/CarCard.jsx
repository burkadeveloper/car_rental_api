import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/currency";
import { useAuth } from "../../hooks/useAuth";
import {
  MapPinIcon,
  CalendarIcon,
  CogIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

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

  // Status configuration
  const statusConfig = {
    available: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircleIcon className="h-3.5 w-3.5" />,
    },
    rented: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <UserGroupIcon className="h-3.5 w-3.5" />,
    },
    maintenance: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <WrenchScrewdriverIcon className="h-3.5 w-3.5" />,
    },
  };
  const status = statusConfig[car.status] || {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <XCircleIcon className="h-3.5 w-3.5" />,
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100/80 hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* Image section */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${status.color}`}
          >
            {status.icon}
            {car.status}
          </span>
        </div>

        {/* Favorite button (optional, can be added later) */}
        {/* <button className="absolute top-3 left-3 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition-colors">
          <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button> */}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Car name & year */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-800 truncate pr-2">
            {car.make} {car.model}
          </h3>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {car.year}
          </span>
        </div>

        {/* Details with icons */}
        <div className="space-y-1.5 mt-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{car.location}</span>
          </div>

          {/* Transmission & Fuel (if available) */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <CogIcon className="h-4 w-4 text-gray-400" />
              <span>{car.transmission}</span>
            </div>
            {car.fuel && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">|</span>
                <span>{car.fuel}</span>
              </div>
            )}
            {car.seatingCapacity && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">|</span>
                <UserGroupIcon className="h-4 w-4 text-gray-400" />
                <span>{car.seatingCapacity}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(car.dailyRate)}
            </span>
            <span className="text-sm text-gray-500 ml-1">/day</span>
          </div>

          {!isAvailable && !isAdminOrStaff && (
            <span className="text-xs text-gray-400 italic">
              {car.status === "rented" ? "Not available" : car.status}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/cars/${car._id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <EyeIcon className="h-4 w-4" />
            {t("viewDetails")}
          </Link>
          {showBookButton ? (
            <Link
              to={`/book/${car._id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {t("bookNow")}
            </Link>
          ) : (
            <div className="flex-1 text-center text-xs text-gray-400 italic">
              {isAdminOrStaff ? "Admin view" : "Unavailable"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
