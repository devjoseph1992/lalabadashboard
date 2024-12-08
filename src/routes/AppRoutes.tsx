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
import EmployeeListPage from "@/pages/admin/EmployeeListPage";
import AddRiderPage from "@/pages/admin/AddRiderPage";
import RiderList from "@/pages/admin/RiderListPage";
import AddShopOwnerPage from "@/pages/admin/AddShopOwnerPage";
import ShopOwnerListPage from "@/pages/admin/ShopOwnerListPage";

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
        <Route path="employees" element={<EmployeeListPage />} />
        <Route path="addrider" element={<AddRiderPage />} />
        <Route path="riders" element={<RiderList />} />
        <Route path="addshopowner" element={<AddShopOwnerPage />} />
        <Route path="shopowners" element={<ShopOwnerListPage />} />
      </Route>
      <Route path="/error/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
