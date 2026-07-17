import React, { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { useUpdateCarMutation } from "../../api/apiSlice";
import { toast } from "react-toastify";

const CarLocationModal = ({ isOpen, onClose, car, refetch }) => {
  const [location, setLocation] = useState(car?.currentLocation || "");
  const [updateCar, { isLoading }] = useUpdateCarMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCar({
        id: car._id,
        data: { currentLocation: location },
      }).unwrap();
      toast.success("Location updated");
      refetch();
      onClose();
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    }
  };

  if (!car) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Car Location">
      <form onSubmit={handleSubmit}>
        <Input
          label="Current Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Addis Ababa, Bole"
          required
        />
        <div className="flex justify-end space-x-3 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CarLocationModal;
