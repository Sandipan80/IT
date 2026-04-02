import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  
  // Parse user data to get the role
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
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







// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");


//   if (!token) {
//     return <Navigate to="/Login" replace />;
//   }

  
//   return children;
// };

// export default ProtectedRoute;