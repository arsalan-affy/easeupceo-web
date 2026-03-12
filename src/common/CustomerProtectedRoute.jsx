import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function CustomerProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/customer/login" replace />;
  }

  return <Outlet />;
}
