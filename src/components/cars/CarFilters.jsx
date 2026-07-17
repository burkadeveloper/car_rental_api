import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setFilters, clearFilters } from "../../features/cars/carSlice";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import {
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const CarFilters = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentFilters = useSelector((state) => state.cars.filters);
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const fuelOptions = [
    { value: "", label: "All" },
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
  ];
  const transmissionOptions = [
    { value: "", label: "All" },
    { value: "Automatic", label: "Automatic" },
    { value: "Manual", label: "Manual" },
  ];
  const seatingOptions = [
    { value: "", label: "Any" },
    { value: "4", label: "4+" },
    { value: "5", label: "5+" },
    { value: "7", label: "7+" },
  ];

  const handleChange = (e) => {
    setLocalFilters({ ...localFilters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    dispatch(setFilters(localFilters));
  };

  const handleClear = () => {
    const emptyFilters = {
      location: "",
      startDate: "",
      endDate: "",
      minPrice: "",
      maxPrice: "",
      fuel: "",
      transmission: "",
      seating: "",
    };
    setLocalFilters(emptyFilters);
    dispatch(clearFilters());
  };

  // Count active filters (non-empty values)
  const activeFilterCount = Object.values(localFilters).filter(
    (val) => val !== "" && val !== null && val !== undefined,
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden transition-all duration-300">
      {/* Header / Toggle */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {t("filter_cars") || "Filter Cars"}
          </h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-transform duration-200"
          aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
        >
          <svg
            className={`h-5 w-5 transform transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filter Body */}
      <div
        className={`px-6 pb-6 transition-all duration-300 ease-in-out ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("location")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="location"
                value={localFilters.location}
                onChange={handleChange}
                placeholder={t("location_placeholder") || "City, area..."}
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-shadow"
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("pickupDate")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="startDate"
                type="date"
                value={localFilters.startDate}
                onChange={handleChange}
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-shadow"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("dropoffDate")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="endDate"
                type="date"
                value={localFilters.endDate}
                onChange={handleChange}
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-shadow"
              />
            </div>
          </div>

          {/* Min Price */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("min_price") || "Min Price (ETB)"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="minPrice"
                type="number"
                value={localFilters.minPrice}
                onChange={handleChange}
                placeholder="0"
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-shadow"
              />
            </div>
          </div>

          {/* Max Price */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("max_price") || "Max Price (ETB)"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="maxPrice"
                type="number"
                value={localFilters.maxPrice}
                onChange={handleChange}
                placeholder="10000"
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-shadow"
              />
            </div>
          </div>

          {/* Fuel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("fuelType")}
            </label>
            <Select
              name="fuel"
              options={fuelOptions}
              value={localFilters.fuel}
              onChange={handleChange}
              className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-shadow"
            />
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("transmission")}
            </label>
            <Select
              name="transmission"
              options={transmissionOptions}
              value={localFilters.transmission}
              onChange={handleChange}
              className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-shadow"
            />
          </div>

          {/* Seating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("seatingCapacity")}
            </label>
            <Select
              name="seating"
              options={seatingOptions}
              value={localFilters.seating}
              onChange={handleChange}
              className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-shadow"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleApply}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t("apply")}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClear}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
            >
              <XMarkIcon className="h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
          {activeFilterCount > 0 && (
            <div className="text-sm text-gray-500">
              {activeFilterCount} {t("filters_active") || "filter(s) active"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
