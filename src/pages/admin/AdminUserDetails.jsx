import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery } from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { formatDate } from "../../utils/dateHelpers";

const AdminUserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserDetailsQuery(userId);

  if (isLoading) return <Spinner />;
  if (error)
    return <div className="text-red-500">Failed to load user details</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Details</h1>
        <Button variant="secondary" onClick={() => navigate("/admin/users")}>
          Back
        </Button>
      </div>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <div className="flex items-center gap-4">
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
            <span
              className={`px-2 py-1 rounded text-xs ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Driver License:</strong> {user.driverLicense || "—"}
            </p>
            <p>
              <strong>ID Number:</strong> {user.idNumber || "—"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "—"}
            </p>
            <p>
              <strong>Badge:</strong> {user.badge || "bronze"}
            </p>
            <p>
              <strong>Bookings:</strong> {user.bookingCount || 0}
            </p>
          </div>
          <div>
            <p>
              <strong>Email Verified:</strong>{" "}
              {user.isEmailVerified ? "✅" : "❌"}
            </p>
            <p>
              <strong>Phone Verified:</strong>{" "}
              {user.isPhoneVerified ? "✅" : "❌"}
            </p>
            <p>
              <strong>Verification Status:</strong>{" "}
              {user.verificationStatus || "not_submitted"}
            </p>
            {user.verificationMessage && (
              <p className="text-sm text-gray-500">
                Message: {user.verificationMessage}
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Uploaded Documents</h3>
          <div className="flex gap-4 flex-wrap">
            {user.driverLicenseImage && (
              <div>
                <p className="text-sm text-gray-500">License Image</p>
                <img
                  src={user.driverLicenseImage}
                  alt="License"
                  className="w-40 h-24 object-cover rounded border"
                />
              </div>
            )}
            {user.idImage && (
              <div>
                <p className="text-sm text-gray-500">ID Image</p>
                <img
                  src={user.idImage}
                  alt="ID"
                  className="w-40 h-24 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
