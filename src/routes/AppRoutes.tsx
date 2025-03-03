import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserRole } from "@/constants/UserRole"; // ✅ Import fixed!
import LoginPage from "@/pages/auth/LoginPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UnauthorizedPage from "@/pages/error/UnauthorizedPage";

// Admin Imports
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/Admindashboard";
import AddEmployeePage from "@/pages/admin/AddEmployeePage";
import EmployeeListPage from "@/pages/admin/EmployeeListPage";
import AddRiderPage from "@/pages/admin/AddRiderPage";
import RiderListPage from "@/pages/admin/RiderListPage";
import AddMerchantPage from "@/pages/admin/AddMerchantPage";
import MerchantListPage from "@/pages/admin/MerchantListPage";

// Employee Imports
import EmployeeLayout from "@/components/layout/EmployeeLayout";
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import EmployeeAddRiderPage from "@/pages/employee/EmployeeAddRiderPage";
import EmployeeRiderListPage from "@/pages/employee/EmployeeRiderListPage";
import EmployeeAddMerchantPage from "@/pages/employee/EmployeeAddMerchantPage";
import EmployeeMerchantListPage from "@/pages/employee/EmployeeMerchantListPage";

const AppRoutes: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // ✅ Fetch user role from localStorage on component mount
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;

    if (storedRole === UserRole.Admin || storedRole === UserRole.Employee) {
      console.log("✅ Retrieved userRole from storage:", storedRole);
      setUserRole(storedRole);
    } else {
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  // ✅ Redirect after login based on user role
  useEffect(() => {
    if (!loading && userRole) {
      console.log(
        "🔍 Redirecting to:",
        userRole === UserRole.Admin ? "/admin" : "/employee"
      );
      navigate(userRole === UserRole.Admin ? "/admin" : "/employee", {
        replace: true,
      });
    }
  }, [userRole, loading]);

  // ✅ Ensure loading state before rendering
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      {!userRole ? (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* ✅ ADMIN DASHBOARD ROUTES */}
          {userRole === UserRole.Admin && (
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute roles={[UserRole.Admin]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="addemployee" element={<AddEmployeePage />} />
              <Route path="employees" element={<EmployeeListPage />} />
              <Route path="addrider" element={<AddRiderPage />} />
              <Route path="riders" element={<RiderListPage />} />
              <Route path="addmerchant" element={<AddMerchantPage />} />
              <Route path="merchants" element={<MerchantListPage />} />
            </Route>
          )}

          {/* ✅ EMPLOYEE DASHBOARD ROUTES */}
          {userRole === UserRole.Employee && (
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute roles={[UserRole.Employee]}>
                  <EmployeeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<EmployeeDashboard />} />
              <Route path="addrider" element={<EmployeeAddRiderPage />} />
              <Route path="riders" element={<EmployeeRiderListPage />} />
              <Route path="addmerchant" element={<EmployeeAddMerchantPage />} />
              <Route path="merchants" element={<EmployeeMerchantListPage />} />
            </Route>
          )}
        </>
      )}

      {/* Unauthorized Route */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Catch-All Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
