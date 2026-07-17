import React from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/currency";

const CarDetailInfo = ({ car }) => {
  const { t } = useTranslation();

  if (!car) return null;

  const statusStyles = {
    available: "bg-green-100 text-green-800 border border-green-200",
    rented: "bg-blue-100 text-blue-800 border border-blue-200",
    maintenance: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    unavailable: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header with car name and status */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {car.make} {car.model}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {car.year} · {car.fuelType} · {car.transmission}
          </p>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              statusStyles[car.status] || statusStyles.unavailable
            }`}
          >
            {car.status}
          </span>
        </div>
      </div>

      {/* Body: two columns with clean label/value pairs */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p className="text-sm text-gray-500">Year</p>
            <p className="text-gray-800 font-medium">{car.year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Color</p>
            <p className="text-gray-800 font-medium">{car.color || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fuel Type</p>
            <p className="text-gray-800 font-medium">{car.fuelType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transmission</p>
            <p className="text-gray-800 font-medium">{car.transmission}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Seating Capacity</p>
            <p className="text-gray-800 font-medium">{car.seatingCapacity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-gray-800 font-medium">{car.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Daily Rate</p>
            <p className="text-gray-800 font-medium">
              {formatCurrency(car.dailyRate)}
            </p>
          </div>
          {car.weeklyRate && (
            <div>
              <p className="text-sm text-gray-500">Weekly Rate</p>
              <p className="text-gray-800 font-medium">
                {formatCurrency(car.weeklyRate)}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Security Deposit</p>
            <p className="text-gray-800 font-medium">
              {formatCurrency(car.securityDeposit)}
            </p>
          </div>
        </div>

        {/* Features */}
        {car.features && car.features.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              {t("features")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            {t("description")}
          </h4>
          {car.description?.en && (
            <p className="text-gray-700 text-sm leading-relaxed">
              {car.description.en}
            </p>
          )}
          {car.description?.am && (
            <p className="text-gray-700 text-sm leading-relaxed mt-2 font-amharic">
              {car.description.am}
            </p>
          )}
          {!car.description?.en && !car.description?.am && (
            <p className="text-gray-500 text-sm italic">No description</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailInfo;
