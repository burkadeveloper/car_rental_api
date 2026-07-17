import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetCarsQuery } from "../../api/apiSlice";
import CarCard from "../../components/cars/CarCard";
import Spinner from "../../components/common/Spinner";

const HomePage = () => {
  const { t } = useTranslation();
  const { data: cars, isLoading } = useGetCarsQuery({ limit: 6 });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">
          {t("welcome")} to {t("appName")}
        </h1>
        <p className="text-xl text-gray-600 mt-2">
          Find the perfect car for your journey
        </p>
        <Link to="/cars" className="btn btn-primary mt-4 inline-block">
          Browse Cars
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Featured Cars</h2>
        {isLoading ? (
          <Spinner />
        ) : cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{t("noResults")}</p>
        )}
        <div className="text-center mt-8">
          <Link to="/cars" className="text-blue-600 hover:underline">
            View all cars →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
