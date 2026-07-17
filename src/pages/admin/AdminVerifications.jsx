import React from "react";
import { useTranslation } from "react-i18next";
import {
  useGetPendingVerificationsQuery,
  useApproveVerificationMutation,
  useRejectVerificationMutation,
} from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";

const AdminVerifications = () => {
  const { t } = useTranslation();
  const { data: users, isLoading, refetch } = useGetPendingVerificationsQuery();
  const [approve] = useApproveVerificationMutation();
  const [reject] = useRejectVerificationMutation();

  const handleApprove = async (userId) => {
    try {
      await approve(userId).unwrap();
      toast.success("User verified");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed");
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt("Reason for rejection:");
    if (reason === null) return;
    try {
      await reject({ userId, reason }).unwrap();
      toast.success("Rejected");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed");
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Verifications</h1>
      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded p-4 shadow-sm bg-white"
            >
              <div className="flex items-center gap-3">
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p>
                  <strong>License:</strong> {user.driverLicense}
                </p>
                {user.driverLicenseImage && (
                  <img
                    src={user.driverLicenseImage}
                    alt="License"
                    className="w-24 h-16 object-cover rounded"
                  />
                )}
                <p>
                  <strong>ID:</strong> {user.idNumber}
                </p>
                {user.idImage && (
                  <img
                    src={user.idImage}
                    alt="ID"
                    className="w-24 h-16 object-cover rounded"
                  />
                )}
                <p>
                  <strong>Address:</strong> {user.address}
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(user._id)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(user._id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending verifications.</p>
      )}
    </div>
  );
};

export default AdminVerifications;
