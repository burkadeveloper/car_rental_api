import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetCarsQuery,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useUpdateBookingStatusMutation,
  useGetUserBookingsQuery,
  useCreateCouponMutation,
} from "../../api/apiSlice";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import CarFormModal from "../../components/admin/CarFormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { toast } from "react-toastify";
import { differenceInSeconds } from "date-fns";
import { formatDate } from "../../utils/dateHelpers";
import { formatCurrency } from "../../utils/currency";

const AdminCarManagement = () => {
  const { t } = useTranslation();
  const { data: cars, isLoading, refetch } = useGetCarsQuery({});
  const [updateCar] = useUpdateCarMutation();
  const [deleteCar] = useDeleteCarMutation();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [createCoupon] = useCreateCouponMutation();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Location modal
  const [locationModal, setLocationModal] = useState({
    isOpen: false,
    car: null,
  });

  // History modal
  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    userId: null,
  });

  // Discount modal
  const [discountModal, setDiscountModal] = useState({
    isOpen: false,
    user: null,
  });
  const [discountForm, setDiscountForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiresAt: "",
    usageLimit: 1,
  });

  // Countdown timer component
  const CountdownTimer = ({ dropoffDate }) => {
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
      const interval = setInterval(() => {
        const diff = differenceInSeconds(new Date(dropoffDate), new Date());
        if (diff <= 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / 86400);
          const hours = Math.floor((diff % 86400) / 3600);
          const mins = Math.floor((diff % 3600) / 60);
          setTimeLeft(`${days}d ${hours}h ${mins}m`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [dropoffDate]);
    return <span className="font-mono text-sm">{timeLeft}</span>;
  };

  const handleStatusChange = async (carId, newStatus) => {
    try {
      await updateCar({ id: carId, data: { status: newStatus } }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    }
  };

  const handleReclaim = async (carId, bookingId) => {
    try {
      await updateBookingStatus({
        id: bookingId,
        status: "completed",
      }).unwrap();
      await updateCar({ id: carId, data: { status: "available" } }).unwrap();
      toast.success("Car reclaimed successfully");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Reclaim failed");
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteCar(deletingId);
    setShowConfirm(false);
    setDeletingId(null);
    refetch();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCar(null);
    refetch();
  };

  const handleLocationUpdate = async (carId, location) => {
    try {
      await updateCar({
        id: carId,
        data: { currentLocation: location },
      }).unwrap();
      toast.success("Location updated");
      refetch();
      setLocationModal({ isOpen: false, car: null });
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    }
  };

  const handleCreateDiscount = async (userId) => {
    try {
      await createCoupon({
        ...discountForm,
        user: userId,
        discountValue: Number(discountForm.discountValue),
        usageLimit: Number(discountForm.usageLimit),
      }).unwrap();
      toast.success("Discount coupon created!");
      setDiscountModal({ isOpen: false, user: null });
      setDiscountForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        expiresAt: "",
        usageLimit: 1,
      });
    } catch (err) {
      toast.error(err.data?.message || "Failed to create coupon");
    }
  };

  const statusOptions = ["available", "rented", "maintenance"];

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Car Management</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingCar(null);
            setIsModalOpen(true);
          }}
        >
          Add New Car
        </Button>
      </div>

      {cars && cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => {
            // Find active booking for this car (if any)
            const activeBooking =
              car.bookings?.find(
                (b) => b.status === "active" || b.status === "confirmed",
              ) || null;
            const userId = activeBooking?.user || car.user?._id || null;
            return (
              <div
                key={car._id}
                className="border rounded-lg shadow-md bg-white p-4"
              >
                {/* Image */}
                <div className="h-40 bg-gray-200 rounded-md overflow-hidden mb-3">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {car.year} · {car.transmission}
                    </p>
                    <p className="text-sm text-gray-500">{car.location}</p>
                    <p className="text-sm">
                      <span className="font-medium">📍 Location:</span>{" "}
                      {car.currentLocation || "Not set"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      car.status === "available"
                        ? "bg-green-100 text-green-800"
                        : car.status === "rented"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {car.status}
                  </span>
                </div>

                {/* Countdown Timer for rented cars */}
                {car.status === "rented" && activeBooking && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-sm font-medium">
                      ⏳ Time left to return:
                    </p>
                    <CountdownTimer dropoffDate={activeBooking.dropoffDate} />
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={car.status}
                    onChange={(e) =>
                      handleStatusChange(car._id, e.target.value)
                    }
                    className="input py-1 text-sm w-32"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {/* Reclaim button */}
                  {car.status === "rented" && activeBooking && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleReclaim(car._id, activeBooking._id)}
                    >
                      🔄 Reclaim
                    </Button>
                  )}

                  {/* Location button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setLocationModal({ isOpen: true, car })}
                  >
                    📍 Location
                  </Button>

                  {/* History button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (userId) {
                        setHistoryModal({ isOpen: true, userId });
                      } else {
                        toast.info("No user associated with this car");
                      }
                    }}
                  >
                    📋 History
                  </Button>

                  {/* Discount button – if user exists */}
                  {userId && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setDiscountModal({
                          isOpen: true,
                          user: { id: userId, name: car.user?.name || "User" },
                        })
                      }
                    >
                      🎟️ Discount
                    </Button>
                  )}

                  <div className="ml-auto space-x-1">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No cars found.</p>
      )}

      {/* Modals */}
      <CarFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        car={editingCar}
      />

      {/* Location Modal */}
      <Modal
        isOpen={locationModal.isOpen}
        onClose={() => setLocationModal({ isOpen: false, car: null })}
        title="Update Car Location"
      >
        {locationModal.car && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const loc = e.target.location.value;
              handleLocationUpdate(locationModal.car._id, loc);
            }}
          >
            <Input
              label="Current Location"
              name="location"
              defaultValue={locationModal.car.currentLocation || ""}
              placeholder="e.g., Addis Ababa, Bole"
              required
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setLocationModal({ isOpen: false, car: null })}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal({ isOpen: false, userId: null })}
        title="Booking History"
      >
        {historyModal.userId && <BookingHistory userId={historyModal.userId} />}
      </Modal>

      {/* Discount Modal */}
      <Modal
        isOpen={discountModal.isOpen}
        onClose={() => setDiscountModal({ isOpen: false, user: null })}
        title={`Create Discount for ${discountModal.user?.name || "User"}`}
      >
        {discountModal.user && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateDiscount(discountModal.user.id);
            }}
          >
            <Input
              label="Coupon Code"
              value={discountForm.code}
              onChange={(e) =>
                setDiscountForm({
                  ...discountForm,
                  code: e.target.value.toUpperCase(),
                })
              }
              required
            />
            <div className="mb-4">
              <label className="label">Discount Type</label>
              <select
                value={discountForm.discountType}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    discountType: e.target.value,
                  })
                }
                className="input"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <Input
              label={
                discountForm.discountType === "percentage"
                  ? "Discount %"
                  : "Discount Amount (ETB)"
              }
              type="number"
              value={discountForm.discountValue}
              onChange={(e) =>
                setDiscountForm({
                  ...discountForm,
                  discountValue: e.target.value,
                })
              }
              required
            />
            <Input
              label="Expires At"
              type="date"
              value={discountForm.expiresAt}
              onChange={(e) =>
                setDiscountForm({ ...discountForm, expiresAt: e.target.value })
              }
              required
            />
            <Input
              label="Usage Limit"
              type="number"
              value={discountForm.usageLimit}
              onChange={(e) =>
                setDiscountForm({ ...discountForm, usageLimit: e.target.value })
              }
              min="1"
              required
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDiscountModal({ isOpen: false, user: null })}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Coupon
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Car"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
};

// Small component to display booking history
const BookingHistory = ({ userId }) => {
  const {
    data: bookings,
    isLoading,
    error,
  } = useGetUserBookingsQuery(userId, {
    skip: !userId,
  });

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Failed to load history</p>;
  if (!bookings || bookings.length === 0)
    return <p className="text-gray-500">No bookings found.</p>;

  return (
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
              Car
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
              Dates
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
              Total
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-t">
              <td className="px-4 py-2 text-sm">
                {b.car?.make} {b.car?.model}
              </td>
              <td className="px-4 py-2 text-sm">
                {formatDate(b.pickupDate)} → {formatDate(b.dropoffDate)}
              </td>
              <td className="px-4 py-2 text-sm">
                {formatCurrency(b.totalCost)}
              </td>
              <td className="px-4 py-2 text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    b.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : b.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCarManagement;
