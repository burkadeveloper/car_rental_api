import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGetCarsQuery } from "../../api/apiSlice";
import CarCard from "../../components/cars/CarCard";
import CarFilters from "../../components/cars/CarFilters";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

const CarListPage = () => {
  const { t } = useTranslation();
  const filters = useSelector((state) => state.cars.filters);
  const [retryCount, setRetryCount] = useState(0);

  const { data: cars, isLoading, error, refetch } = useGetCarsQuery(filters);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("cars")}</h1>
        <CarFilters />
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
          <p className="ml-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    const status = error?.status || error?.originalStatus || "unknown";
    const message =
      error?.data?.message || error?.message || "Failed to load cars.";
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("cars")}</h1>
        <CarFilters />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-8">
          <p className="text-red-600 text-lg font-medium">⚠️ {message}</p>
          {status === 429 && (
            <p className="text-gray-600 mt-2">
              Too many requests. Please wait a moment and try again.
            </p>
          )}
          <Button variant="primary" onClick={handleRetry} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("cars")}</h1>
      <CarFilters />
      {cars && cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">{t("noResults")}</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default CarListPage;
