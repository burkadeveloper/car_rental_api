import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetCarsQuery,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useUpdateBookingStatusMutation,
} from "../../api/apiSlice";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import CarFormModal from "../../components/admin/CarFormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import CarLocationModal from "../../components/admin/CarLocationModal";
import CarBookingHistoryModal from "../../components/admin/CarBookingHistoryModal";
import { toast } from "react-toastify";
import { differenceInSeconds } from "date-fns";

const AdminCarManagement = () => {
  const { t } = useTranslation();
  const { data: cars, isLoading, refetch } = useGetCarsQuery({});
  const [updateCar] = useUpdateCarMutation();
  const [deleteCar] = useDeleteCarMutation();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [locationModal, setLocationModal] = useState({
    isOpen: false,
    car: null,
  });
  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    carId: null,
  });

  // Countdown timer component (inline)
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

  const statusOptions = ["available", "rented", "maintenance"];

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Cars</h1>
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
            // Find active booking (if any) for this car
            const activeBooking =
              car.bookings?.find(
                (b) => b.status === "active" || b.status === "confirmed",
              ) || null;
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
                      <span className="font-medium">Location:</span>{" "}
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
                    <p className="text-sm font-medium">Time left to return:</p>
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

                  {/* Reclaim button (only for rented cars with active booking) */}
                  {car.status === "rented" && activeBooking && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleReclaim(car._id, activeBooking._id)}
                    >
                      Reclaim
                    </Button>
                  )}

                  {/* Update Location button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setLocationModal({ isOpen: true, car })}
                  >
                    Location
                  </Button>

                  {/* Car History button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setHistoryModal({ isOpen: true, carId: car._id })
                    }
                  >
                    History
                  </Button>

                  <div className="ml-auto space-x-1">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
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
      <CarLocationModal
        isOpen={locationModal.isOpen}
        onClose={() => setLocationModal({ isOpen: false, car: null })}
        car={locationModal.car}
        refetch={refetch}
      />
      <CarBookingHistoryModal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal({ isOpen: false, carId: null })}
        carId={historyModal.carId}
      />
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

export default AdminCarManagement;
