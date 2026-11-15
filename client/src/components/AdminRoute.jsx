import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">
        Verifying administrator access...
      </div>
    );
  }

  return user && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
