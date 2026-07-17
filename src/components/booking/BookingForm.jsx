import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useValidateCouponMutation } from "../../api/apiSlice";
import Input from "../common/Input";
import Button from "../common/Button";
import Modal from "../common/Modal";
import MapPicker from "../common/MapPicker";
import { formatCurrency } from "../../utils/currency";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  IdentificationIcon,
  PhoneIcon,
  CreditCardIcon,
  GiftIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const BookingForm = ({ car, onSubmit, isLoading, initialData = {} }) => {
  const { t } = useTranslation();
  const [validateCoupon] = useValidateCouponMutation();

  const [formData, setFormData] = useState({
    pickupLocation: initialData.pickupLocation || "",
    dropoffLocation: initialData.dropoffLocation || "",
    pickupDate: initialData.pickupDate || "",
    dropoffDate: initialData.dropoffDate || "",
    pickupTime: initialData.pickupTime || "10:00",
    dropoffTime: initialData.dropoffTime || "10:00",
    driverName: initialData.driverName || "",
    driverLicense: initialData.driverLicense || "",
    driverPhone: initialData.driverPhone || "",
    couponCode: "",
    paymentMethod: "pay_on_arrival",
    pickupLat: initialData.pickupLat || null,
    pickupLng: initialData.pickupLng || null,
    dropoffLat: initialData.dropoffLat || null,
    dropoffLng: initialData.dropoffLng || null,
  });
  const [extras, setExtras] = useState(initialData.extras || []);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [error, setError] = useState("");
  const [mapModal, setMapModal] = useState({ isOpen: false, type: "pickup" });

  const extraRates = { GPS: 200, "Child Seat": 150 };

  useEffect(() => {
    if (car && formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.dropoffDate);
      if (dropoff <= pickup) {
        setTotalCost(0);
        setTax(0);
        return;
      }
      const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
      if (days < 1) {
        setTotalCost(0);
        setTax(0);
        return;
      }

      let base = car.dailyRate * days;
      if (days >= 7 && car.weeklyRate) {
        const weeks = Math.floor(days / 7);
        const rem = days % 7;
        base = weeks * car.weeklyRate + rem * car.dailyRate;
      }

      let extrasCost = 0;
      extras.forEach((e) => {
        extrasCost += (extraRates[e] || 0) * days;
      });
      let total = base + extrasCost;
      const taxAmount = total * 0.15;
      total += taxAmount;
      setTotalCost(total);
      setTax(taxAmount);
    }
  }, [car, formData.pickupDate, formData.dropoffDate, extras]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExtras = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setExtras([...extras, value]);
    } else {
      setExtras(extras.filter((x) => x !== value));
    }
  };

  const handleValidateCoupon = async () => {
    if (!formData.couponCode) return;
    try {
      const result = await validateCoupon({
        code: formData.couponCode,
        bookingTotal: totalCost,
      }).unwrap();
      if (result.valid) {
        setCouponDiscount(result.discount);
        setError("");
      } else {
        setError(result.message);
        setCouponDiscount(0);
      }
    } catch (err) {
      setError(err.data?.message || "Invalid coupon");
      setCouponDiscount(0);
    }
  };

  const handleMapSelect = (type, coords) => {
    setFormData({
      ...formData,
      [`${type}Lat`]: coords.lat,
      [`${type}Lng`]: coords.lng,
    });
    setMapModal({ isOpen: false, type: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.pickupLocation ||
      !formData.dropoffLocation ||
      !formData.pickupDate ||
      !formData.dropoffDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    const pickup = new Date(formData.pickupDate);
    const dropoff = new Date(formData.dropoffDate);
    if (dropoff <= pickup) {
      setError("Dropoff date must be after pickup date.");
      return;
    }
    const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
    if (days < 1) {
      setError("Minimum rental period is 1 day.");
      return;
    }

    const bookingData = {
      ...formData,
      extras,
      couponCode: formData.couponCode || undefined,
      pickupDate: pickup.toISOString(),
      dropoffDate: dropoff.toISOString(),
      driverDetails: {
        name: formData.driverName,
        licenseNumber: formData.driverLicense,
        phone: formData.driverPhone,
      },
    };
    onSubmit(bookingData);
  };

  const isEditMode = !!initialData._id;

  // Helper to compute days
  const getDays = () => {
    if (formData.pickupDate && formData.dropoffDate) {
      const diff = Math.ceil(
        (new Date(formData.dropoffDate) - new Date(formData.pickupDate)) /
          (1000 * 60 * 60 * 24),
      );
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <XCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Location & Map Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("pickupLocation")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                placeholder="Enter pickup address"
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setMapModal({ isOpen: true, type: "pickup" })}
                className="text-sm flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <MapPinIcon className="h-4 w-4" />
                Select on Map
              </Button>
              {formData.pickupLat && (
                <span className="text-xs text-gray-500">
                  📍 {formData.pickupLat.toFixed(4)},{" "}
                  {formData.pickupLng.toFixed(4)}
                </span>
              )}
            </div>
          </div>

          {/* Dropoff */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("dropoffLocation")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={handleChange}
                required
                placeholder="Enter dropoff address"
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setMapModal({ isOpen: true, type: "dropoff" })}
                className="text-sm flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <MapPinIcon className="h-4 w-4" />
                Select on Map
              </Button>
              {formData.dropoffLat && (
                <span className="text-xs text-gray-500">
                  📍 {formData.dropoffLat.toFixed(4)},{" "}
                  {formData.dropoffLng.toFixed(4)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("pickupDate")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("dropoffDate")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="date"
                name="dropoffDate"
                value={formData.dropoffDate}
                onChange={handleChange}
                required
                min={
                  formData.pickupDate || new Date().toISOString().split("T")[0]
                }
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("pickupTime")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                required
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("dropoffTime")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="time"
                name="dropoffTime"
                value={formData.dropoffTime}
                onChange={handleChange}
                required
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCardIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 pr-8 bg-white shadow-sm transition-shadow"
            >
              <option value="pay_on_arrival">Pay on Arrival</option>
              <option value="chapa">Chapa</option>
              <option value="stripe">Credit Card</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pay on arrival available for bookings within 2 hours.
          </p>
        </div>

        {/* Driver Details */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <UserIcon className="h-5 w-5" />
            Driver (if different from renter)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                label={false}
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="Full name"
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                label={false}
                name="driverLicense"
                value={formData.driverLicense}
                onChange={handleChange}
                placeholder="License number"
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                label={false}
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleChange}
                placeholder="09xxxxxxxx"
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Extras */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-md font-semibold text-gray-700 mb-3">
            {t("extras")}
          </h4>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
              <input
                type="checkbox"
                value="GPS"
                onChange={handleExtras}
                checked={extras.includes("GPS")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              GPS (+200/day)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
              <input
                type="checkbox"
                value="Child Seat"
                onChange={handleExtras}
                checked={extras.includes("Child Seat")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              Child Seat (+150/day)
            </label>
          </div>
        </div>

        {/* Coupon */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <GiftIcon className="h-5 w-5" />
            {t("coupon")}
          </h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GiftIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="couponCode"
                value={formData.couponCode}
                onChange={handleChange}
                placeholder="Enter coupon code"
                className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleValidateCoupon}
              className="px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors border border-blue-200"
            >
              {t("apply")}
            </Button>
          </div>
          {couponDiscount > 0 && (
            <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
              <CheckCircleIcon className="h-4 w-4" />
              Coupon applied: -{formatCurrency(couponDiscount)}
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 p-5 rounded-xl border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Price Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Rate</span>
              <span className="font-medium">
                {formatCurrency(car?.dailyRate || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total days</span>
              <span className="font-medium">{getDays()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (15%)</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            {extras.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Extras</span>
                <span className="font-medium">
                  {extras.map((e) => `${e}`).join(", ")}
                </span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon discount</span>
                <span>-{formatCurrency(couponDiscount)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-blue-600">
                  {formatCurrency(totalCost - couponDiscount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={isLoading}
        >
          {isLoading
            ? t("loading")
            : isEditMode
              ? "Update Booking"
              : "Proceed to Payment"}
        </Button>
      </form>

      {/* Map Modal */}
      <Modal
        isOpen={mapModal.isOpen}
        onClose={() => setMapModal({ isOpen: false, type: "" })}
        title={`Select ${mapModal.type === "pickup" ? "Pickup" : "Dropoff"} Location on Map`}
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <MapPicker
            onLocationSelect={(coords) =>
              handleMapSelect(mapModal.type, coords)
            }
            initialPosition={
              formData[`${mapModal.type}Lat`]
                ? [
                    formData[`${mapModal.type}Lat`],
                    formData[`${mapModal.type}Lng`],
                  ]
                : [9.03, 38.74]
            }
          />
          <p className="text-sm text-gray-500">
            Click on the map to set the location. Coordinates will be saved.
          </p>
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setMapModal({ isOpen: false, type: "" })}
              className="px-4 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingForm;
