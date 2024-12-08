// src/routes/AppRoutes.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/Admindashboard";
import AddEmployeePage from "@/pages/admin/AddEmployeePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import UnauthorizedPage from "@/pages/error/UnauthorizedPage";
import { UserRole } from "@/types/UserRole";

const AppRoutes: React.FC = () => {
  const adminRoles: UserRole[] = [UserRole.Admin];

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={adminRoles}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="addemployee" element={<AddEmployeePage />} />
      </Route>
      <Route path="/error/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
