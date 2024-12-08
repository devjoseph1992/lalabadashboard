// src/components/layout/AdminLayout.tsx

import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { getAuth, signOut } from "firebase/auth";

const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    localStorage.clear(); // Clear session-related data
    window.location.href = "/"; // Redirect to login
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 bg-gray-100 h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
