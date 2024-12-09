import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/Admindashboard";
import AddEmployeePage from "@/pages/admin/AddEmployeePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import UnauthorizedPage from "@/pages/error/UnauthorizedPage";
import EmployeeListPage from "@/pages/admin/EmployeeListPage";
import AddRiderPage from "@/pages/admin/AddRiderPage";
import RiderListPage from "@/pages/admin/RiderListPage";
import AddShopOwnerPage from "@/pages/admin/AddShopOwnerPage";
import ShopOwnerListPage from "@/pages/admin/ShopOwnerListPage";

// Define UserRole to match the expected type
export enum UserRole {
  Admin = "admin",
  Employee = "employee",
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Login Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Admin Layout with Role-Based Restrictions */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={[UserRole.Admin, UserRole.Employee]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Shared Routes (Admin and Employee) */}
        <Route index element={<AdminDashboard />} />
        <Route
          path="addrider"
          element={
            <ProtectedRoute roles={[UserRole.Admin, UserRole.Employee]}>
              <AddRiderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="riders"
          element={
            <ProtectedRoute roles={[UserRole.Admin, UserRole.Employee]}>
              <RiderListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="addshopowner"
          element={
            <ProtectedRoute roles={[UserRole.Admin, UserRole.Employee]}>
              <AddShopOwnerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="shopowners"
          element={
            <ProtectedRoute roles={[UserRole.Admin, UserRole.Employee]}>
              <ShopOwnerListPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-Only Routes */}
        <Route
          path="addemployee"
          element={
            <ProtectedRoute roles={[UserRole.Admin]}>
              <AddEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees"
          element={
            <ProtectedRoute roles={[UserRole.Admin]}>
              <EmployeeListPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Unauthorized Route */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Catch-All Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
