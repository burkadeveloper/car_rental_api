import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "../../api/apiSlice";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { toast } from "react-toastify";

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

    // Basic validation
    if (!formData.code || !formData.discountValue || !formData.expiresAt) {
      setError("Please fill in all required fields.");
      return;
    }

    // Build payload
    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue),
      maxDiscount: formData.maxDiscount
        ? Number(formData.maxDiscount)
        : undefined,
      minBookingAmount: formData.minBookingAmount
        ? Number(formData.minBookingAmount)
        : 0,
      usageLimit: Number(formData.usageLimit),
    };

    try {
      if (coupon) {
        await updateCoupon({ id: coupon._id, data: payload }).unwrap();
        toast.success("Coupon updated");
      } else {
        await createCoupon(payload).unwrap();
        toast.success("Coupon created");
      }
      onClose();
    } catch (err) {
      const msg = err.data?.message || "Failed to save coupon";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={coupon ? "Edit Coupon" : "Add Coupon"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        <Input
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          placeholder="SUMMER20"
        />
        <div>
          <label className="label">Discount Type</label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="input"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount (ETB)</option>
          </select>
        </div>
        <Input
          label={
            formData.discountType === "percentage"
              ? "Discount %"
              : "Discount Amount (ETB)"
          }
          name="discountValue"
          type="number"
          value={formData.discountValue}
          onChange={handleChange}
          required
          placeholder={formData.discountType === "percentage" ? "20" : "500"}
        />
        {formData.discountType === "percentage" && (
          <Input
            label="Maximum Discount (ETB) – optional"
            name="maxDiscount"
            type="number"
            value={formData.maxDiscount}
            onChange={handleChange}
            placeholder="1000"
          />
        )}
        <Input
          label="Minimum Booking Amount (ETB) – optional"
          name="minBookingAmount"
          type="number"
          value={formData.minBookingAmount}
          onChange={handleChange}
          placeholder="2000"
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
          min="1"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Active</label>
        </div>
        <div className="flex justify-end space-x-3 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CouponFormModal;
