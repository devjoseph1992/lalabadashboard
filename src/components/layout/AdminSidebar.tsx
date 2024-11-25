import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="space-y-4">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Manage Users
          </NavLink>
          <Button
            className="w-full mt-4"
            variant="destructive"
            onClick={() => alert("Logout functionality here!")}
          >
            Logout
          </Button>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
