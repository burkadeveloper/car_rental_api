import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../common/Button";

const UserTable = ({ users, onRoleChange, onToggleActive, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) return <div>Loading...</div>;
  if (!users || users.length === 0)
    return <p className="text-gray-500">No users found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.phone}</td>
              <td className="px-4 py-2">
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user._id, e.target.value)}
                  className="input py-1 text-sm"
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
                  onClick={() => onToggleActive(user._id)}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
