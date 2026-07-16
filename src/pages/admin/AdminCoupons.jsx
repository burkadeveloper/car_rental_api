import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
} from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import CouponFormModal from "../../components/admin/CouponFormModal";
import { toast } from "react-toastify";

const AdminCoupons = () => {
  const { t } = useTranslation();
  const { data: coupons, isLoading, error, refetch } = useGetCouponsQuery();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Delete failed");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Failed to load coupons</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("coupons")}</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingCoupon(null);
            setIsModalOpen(true);
          }}
        >
          Add Coupon
        </Button>
      </div>

      {coupons && coupons.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                    {coupon.discountType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {coupon.discountValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {coupon.usedCount}/{coupon.usageLimit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(coupon.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:underline"
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No coupons found.</p>
      )}

      <CouponFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCoupon(null);
          refetch();
        }}
        coupon={editingCoupon}
      />
    </div>
  );
};

export default AdminCoupons;
