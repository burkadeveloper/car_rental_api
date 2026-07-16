import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
// ✅ Import the actions correctly from the slice
import { setFilters, clearFilters } from "../../features/cars/carSlice";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const CarFilters = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // ✅ Now this will have a valid `filters` object
  const currentFilters = useSelector((state) => state.cars.filters);
  const [localFilters, setLocalFilters] = useState(currentFilters);

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

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label={t("location")}
          name="location"
          value={localFilters.location}
          onChange={handleChange}
          placeholder="Addis Ababa"
        />
        <Input
          label={t("pickupDate")}
          name="startDate"
          type="date"
          value={localFilters.startDate}
          onChange={handleChange}
        />
        <Input
          label={t("dropoffDate")}
          name="endDate"
          type="date"
          value={localFilters.endDate}
          onChange={handleChange}
        />
        <Input
          label="Min Price (ETB)"
          name="minPrice"
          type="number"
          value={localFilters.minPrice}
          onChange={handleChange}
          placeholder="0"
        />
        <Input
          label="Max Price (ETB)"
          name="maxPrice"
          type="number"
          value={localFilters.maxPrice}
          onChange={handleChange}
          placeholder="10000"
        />
        <Select
          label={t("fuelType")}
          name="fuel"
          options={fuelOptions}
          value={localFilters.fuel}
          onChange={handleChange}
        />
        <Select
          label={t("transmission")}
          name="transmission"
          options={transmissionOptions}
          value={localFilters.transmission}
          onChange={handleChange}
        />
        <Select
          label={t("seatingCapacity")}
          name="seating"
          options={seatingOptions}
          value={localFilters.seating}
          onChange={handleChange}
        />
      </div>
      <div className="mt-4 flex space-x-3">
        <Button variant="primary" onClick={handleApply}>
          {t("apply")}
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          {t("clear")}
        </Button>
      </div>
    </div>
  );
};

export default CarFilters;
