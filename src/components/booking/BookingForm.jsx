import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useValidateCouponMutation } from "../../api/apiSlice";
import Input from "../common/Input";
import Button from "../common/Button";
import Modal from "../common/Modal";
import MapPicker from "../common/MapPicker";
import { formatCurrency } from "../../utils/currency";

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

    // ✅ Removed the 2‑hour restriction for pay‑on‑arrival

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label={t("pickupLocation")}
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setMapModal({ isOpen: true, type: "pickup" })}
            className="mt-1"
          >
            📍 Select on Map
          </Button>
          {formData.pickupLat && (
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {formData.pickupLat.toFixed(4)},{" "}
              {formData.pickupLng.toFixed(4)}
            </p>
          )}
        </div>
        <div>
          <Input
            label={t("dropoffLocation")}
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            required
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setMapModal({ isOpen: true, type: "dropoff" })}
            className="mt-1"
          >
            📍 Select on Map
          </Button>
          {formData.dropoffLat && (
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {formData.dropoffLat.toFixed(4)},{" "}
              {formData.dropoffLng.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      <Input
        label={t("pickupDate")}
        type="date"
        name="pickupDate"
        value={formData.pickupDate}
        onChange={handleChange}
        required
        min={new Date().toISOString().split("T")[0]}
      />
      <Input
        label={t("dropoffDate")}
        type="date"
        name="dropoffDate"
        value={formData.dropoffDate}
        onChange={handleChange}
        required
        min={formData.pickupDate || new Date().toISOString().split("T")[0]}
      />
      <Input
        label={t("pickupTime")}
        type="time"
        name="pickupTime"
        value={formData.pickupTime}
        onChange={handleChange}
        required
      />
      <Input
        label={t("dropoffTime")}
        type="time"
        name="dropoffTime"
        value={formData.dropoffTime}
        onChange={handleChange}
        required
      />

      <div>
        <label className="label">Payment Method</label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="input"
        >
          <option value="pay_on_arrival">Pay on Arrival</option>
          <option value="chapa">Chapa</option>
          <option value="stripe">Credit Card</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Pay on arrival only available for bookings within 2 hours.
        </p>
      </div>

      <div>
        <label className="label">Driver (if different from renter)</label>
        <Input
          label="Name"
          name="driverName"
          value={formData.driverName}
          onChange={handleChange}
          placeholder="Full name"
        />
        <Input
          label="License Number"
          name="driverLicense"
          value={formData.driverLicense}
          onChange={handleChange}
          placeholder="License number"
        />
        <Input
          label="Phone"
          name="driverPhone"
          value={formData.driverPhone}
          onChange={handleChange}
          placeholder="09xxxxxxxx"
        />
      </div>

      <div>
        <label className="label">{t("extras")}</label>
        <div className="space-x-4">
          <label>
            <input
              type="checkbox"
              value="GPS"
              onChange={handleExtras}
              checked={extras.includes("GPS")}
            />
            GPS (+200/day)
          </label>
          <label>
            <input
              type="checkbox"
              value="Child Seat"
              onChange={handleExtras}
              checked={extras.includes("Child Seat")}
            />
            Child Seat (+150/day)
          </label>
        </div>
      </div>

      <div>
        <label className="label">{t("coupon")}</label>
        <div className="flex space-x-2">
          <Input
            name="couponCode"
            value={formData.couponCode}
            onChange={handleChange}
            placeholder="Enter code"
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleValidateCoupon}
          >
            {t("apply")}
          </Button>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-bold">Price Summary</h3>
        <p>Daily Rate: {formatCurrency(car?.dailyRate || 0)}</p>
        <p>
          Total days:{" "}
          {formData.pickupDate && formData.dropoffDate
            ? Math.ceil(
                (new Date(formData.dropoffDate) -
                  new Date(formData.pickupDate)) /
                  (1000 * 60 * 60 * 24),
              )
            : 0}
        </p>
        <p>Tax (15%): {formatCurrency(tax)}</p>
        {couponDiscount > 0 && (
          <p>Coupon discount: -{formatCurrency(couponDiscount)}</p>
        )}
        <p className="text-lg font-bold mt-2">
          Total: {formatCurrency(totalCost - couponDiscount)}
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading
          ? t("loading")
          : isEditMode
            ? "Update Booking"
            : "Proceed to Payment"}
      </Button>

      {/* Map Modal */}
      <Modal
        isOpen={mapModal.isOpen}
        onClose={() => setMapModal({ isOpen: false, type: "" })}
        title={`Select ${mapModal.type === "pickup" ? "Pickup" : "Dropoff"} Location on Map`}
      >
        <MapPicker
          onLocationSelect={(coords) => handleMapSelect(mapModal.type, coords)}
          initialPosition={
            formData[`${mapModal.type}Lat`]
              ? [
                  formData[`${mapModal.type}Lat`],
                  formData[`${mapModal.type}Lng`],
                ]
              : [9.03, 38.74]
          }
        />
        <p className="text-xs text-gray-500 mt-2">
          Click on the map to set the location. The coordinates will be saved.
        </p>
        <div className="mt-3 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => setMapModal({ isOpen: false, type: "" })}
          >
            Close
          </Button>
        </div>
      </Modal>
    </form>
  );
};

export default BookingForm;
