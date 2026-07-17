import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation, // ✅ Now available
} from "../../api/apiSlice";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

const CouponFormModal = ({ isOpen, onClose, coupon }) => {
  const { t } = useTranslation();
  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minBookingAmount: "",
    expiresAt: "",
    usageLimit: 1,
    isActive: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        discountType: coupon.discountType || "percentage",
        discountValue: coupon.discountValue || "",
        maxDiscount: coupon.maxDiscount || "",
        minBookingAmount: coupon.minBookingAmount || "",
        expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
        usageLimit: coupon.usageLimit || 1,
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      });
    } else {
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxDiscount: "",
        minBookingAmount: "",
        expiresAt: "",
        usageLimit: 1,
        isActive: true,
      });
    }
    setError("");
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (coupon) {
        await updateCoupon({ id: coupon._id, data: formData }).unwrap();
      } else {
        await createCoupon(formData).unwrap();
      }
      onClose();
    } catch (err) {
      setError(err.data?.message || "Failed to save coupon");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={coupon ? "Edit Coupon" : "Add Coupon"}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <Input
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleChange}
          className="input"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <Input
          label="Discount Value"
          name="discountValue"
          type="number"
          value={formData.discountValue}
          onChange={handleChange}
          required
        />
        <Input
          label="Max Discount (for percentage)"
          name="maxDiscount"
          type="number"
          value={formData.maxDiscount}
          onChange={handleChange}
        />
        <Input
          label="Min Booking Amount"
          name="minBookingAmount"
          type="number"
          value={formData.minBookingAmount}
          onChange={handleChange}
        />
        <Input
          label="Expires At"
          name="expiresAt"
          type="date"
          value={formData.expiresAt}
          onChange={handleChange}
          required
        />
        <Input
          label="Usage Limit"
          name="usageLimit"
          type="number"
          value={formData.usageLimit}
          onChange={handleChange}
        />
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span className="ml-2">Active</span>
          </label>
        </div>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default CouponFormModal;
