import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    console.warn("No token found, redirecting to login.");
    return <Navigate to="/admin" replace />;
  }

  if (!role) {
    console.warn("No role found, access denied.");
    return <Navigate to="/admin" replace />;
  }

  const normalizedRole = role.trim().toLowerCase();
  const normalizedAllowed = allowedRoles.map(r => r.trim().toLowerCase());

  if (!normalizedAllowed.includes(normalizedRole)) {
    console.warn(`Access denied for role: ${role}`);
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
