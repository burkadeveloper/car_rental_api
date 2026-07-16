// frontend/src/components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ roles = [] }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user.role))
    return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
