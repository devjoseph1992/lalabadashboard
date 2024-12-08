// src/components/auth/ProtectedRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/UserRole";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, userRole, roleLoading } = useAuth();

  if (roleLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(userRole as UserRole)) {
    return <Navigate to="/error/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
