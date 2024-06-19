// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  element: React.ReactElement;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can replace this with a spinner or loading indicator
    return <div>Loading...</div>;
  }
  console.log(user?.role);
  if (!user?.role || !roles.some((role) => user?.role.includes(role))) {
    return <Navigate to="/403" />;
  }

  return element;
};

export default ProtectedRoute;
