import React from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/currency";

const CarDetailInfo = ({ car }) => {
  const { t } = useTranslation();

  if (!car) return null;

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">
        {car.make} {car.model}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Year:</strong> {car.year}
          </p>
          <p>
            <strong>Color:</strong> {car.color || "N/A"}
          </p>
          <p>
            <strong>Fuel Type:</strong> {car.fuelType}
          </p>
          <p>
            <strong>Transmission:</strong> {car.transmission}
          </p>
          <p>
            <strong>Seating Capacity:</strong> {car.seatingCapacity}
          </p>
          <p>
            <strong>Location:</strong> {car.location}
          </p>
        </div>
        <div>
          <p>
            <strong>Daily Rate:</strong> {formatCurrency(car.dailyRate)}
          </p>
          {car.weeklyRate && (
            <p>
              <strong>Weekly Rate:</strong> {formatCurrency(car.weeklyRate)}
            </p>
          )}
          <p>
            <strong>Security Deposit:</strong>{" "}
            {formatCurrency(car.securityDeposit)}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${car.status === "available" ? "bg-green-100 text-green-800" : car.status === "rented" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
            >
              {car.status}
            </span>
          </p>
          {car.features && car.features.length > 0 && (
            <div className="mt-2">
              <strong>{t("features")}:</strong>
              <ul className="list-disc pl-5">
                {car.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold">{t("description")}</h4>
        <p className="text-gray-700 mt-1">
          {car.description?.en || "No description"}
        </p>
        {car.description?.am && (
          <p className="text-gray-700 mt-2 font-amharic">
            {car.description.am}
          </p>
        )}
      </div>
    </div>
  );
};

export default CarDetailInfo;
