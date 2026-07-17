import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import {
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useGetMyBookingsQuery,
} from "../../api/apiSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/dateHelpers";
import { formatCurrency } from "../../utils/currency";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [updateProfilePicture, { isLoading: picLoading }] =
    useUpdateProfilePictureMutation();
  const { data: bookings, isLoading: historyLoading } = useGetMyBookingsQuery();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    driverLicense: user?.driverLicense || "",
    idNumber: user?.idNumber || "",
    address: user?.address || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      setMessage("Profile updated successfully");
      toast.success("Profile updated");
    } catch (err) {
      setMessage("Update failed: " + err.data?.message);
      toast.error(err.data?.message || "Update failed");
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      await updateProfilePicture(formData).unwrap();
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err.data?.message || "Upload failed");
    }
  };

  if (historyLoading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>

      {/* Profile Picture */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative">
          <img
            src={user?.profilePicture || "https://via.placeholder.com/80"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
          />
          <label
            htmlFor="profile-pic"
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </label>
          <input
            id="profile-pic"
            type="file"
            accept="image/*"
            onChange={handlePictureUpload}
            className="hidden"
            disabled={picLoading}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">
            Click the camera icon to change profile picture
          </p>
          {picLoading && <p className="text-xs text-blue-500">Uploading...</p>}
        </div>
      </div>

      {/* Badge & Stats */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">Badge</span>
          <div className="text-2xl font-bold capitalize">
            {user?.badge || "Bronze"}
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Total Bookings</span>
          <div className="text-2xl font-bold">{user?.bookingCount || 0}</div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Completed</span>
          <div className="text-2xl font-bold">
            {bookings?.filter((b) => b.status === "completed").length || 0}
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-2 rounded mb-4 ${message.includes("failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          label="Driver License"
          name="driverLicense"
          value={formData.driverLicense}
          onChange={handleChange}
        />
        <Input
          label="ID/Passport"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
        />
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <Button type="submit" variant="primary" disabled={updating}>
          {updating ? "Saving..." : "Update Profile"}
        </Button>
      </form>

      {/* Booking History */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Booking History</h3>
        {bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Car
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Pickup
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Dropoff
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
                      {formatDate(b.pickupDate)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {formatDate(b.dropoffDate)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {formatCurrency(b.totalCost)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          b.status === "completed"
                            ? "bg-green-100"
                            : b.status === "cancelled"
                              ? "bg-red-100"
                              : "bg-yellow-100"
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
        ) : (
          <p className="text-gray-500">No booking history yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
