// import React from "react";
// import { Route, Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// interface ProtectedRouteProps {
//   roles: string[];
//   element: React.ReactElement;
//   path: string;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   roles,
//   element,
//   path,
// }) => {
//   const { user } = useAuth();

//   if (!user) {
//     // Redirect to login if not authenticated
//     return <Navigate to="/login" />;
//   }

//   if (!roles.includes(user.role)) {
//     // Show 403 Forbidden page if role is not authorized
//     return <Navigate to="/403" />;
//   }

//   return <Route path={path} element={element} />;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  element: React.ReactElement;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roles }) => {
  const { user } = useAuth();

  console.log("user", user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // if (!roles.some((role) => user.role.includes(role))) {
  //   return <Navigate to="/403" />;
  // }
  if (!user.role || !roles.some((role) => user.role.includes(role))) {
    return <Navigate to="/403" />;
  }

  return element;
};

export default ProtectedRoute;
