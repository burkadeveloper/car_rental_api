import React from "react";
import { useTranslation } from "react-i18next";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
} from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const { t } = useTranslation();
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [updateRole, { isLoading: roleUpdating }] = useUpdateUserRoleMutation();
  const [toggleActive, { isLoading: toggling }] = useToggleUserActiveMutation();

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole({ id: userId, role: newRole }).unwrap();
      toast.success(`Role updated to ${newRole}`);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to update role");
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await toggleActive(userId).unwrap();
      toast.success("User status toggled");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to toggle status");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Failed to load users</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("users")}</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Photo
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                License
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Address
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Verified
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Role
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-sm">{user.name}</td>
                <td className="px-4 py-2 text-sm">{user.email}</td>
                <td className="px-4 py-2 text-sm">{user.phone || "—"}</td>
                <td className="px-4 py-2 text-sm">
                  {user.driverLicense || "—"}
                </td>
                <td className="px-4 py-2 text-sm">{user.idNumber || "—"}</td>
                <td className="px-4 py-2 text-sm">{user.address || "—"}</td>
                <td className="px-4 py-2 text-sm">
                  <span className="text-xs">
                    {user.isEmailVerified ? "✅ Email" : "❌ Email"}
                    <br />
                    {user.isPhoneVerified ? "✅ Phone" : "❌ Phone"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="input py-1 text-sm w-28"
                    disabled={roleUpdating}
                  >
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant={user.isActive ? "danger" : "primary"}
                    size="sm"
                    onClick={() => handleToggleActive(user._id)}
                    disabled={toggling}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
