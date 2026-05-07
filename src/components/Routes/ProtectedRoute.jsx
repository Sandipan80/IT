import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = Cookies.get("token");
  
  // Parse user data to get the role
  const userData = JSON.parse(Cookies.get("user") || "{}");
  const userRole = userData.role;

  // 1. Check if user is logged in
  if (!token || !userData.id) {
    return <Navigate to="/Login" replace />;
  }

  // 2. Check RBAC permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // If unauthorized, send them to Dashboard (or an unauthorized page)
    return <Navigate to="/Dashboard" replace />;
  }

  // 3. Render logic: 
  // If used as a wrapper <ProtectedRoute>...</ProtectedRoute>, return children.
  // If used as a layout <Route element={<ProtectedRoute />} />, return <Outlet />.
  if (children) {
    return children;
  }

  return <Outlet />;
};

export default ProtectedRoute;







