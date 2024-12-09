import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig";

interface SidebarProps {
  onLogout?: () => void; // Optional function to handle logout
  userRole: string; // User role (e.g., "admin" or "employee")
}

const AdminSidebar: React.FC<SidebarProps> = ({ userRole, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      localStorage.clear(); // Clear all stored session data
      console.log("User logged out successfully");
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isActiveLink = (path: string) => location.pathname === path;

  // Define links dynamically based on user role
  const links = [
    ...(userRole === "admin"
      ? [
          { path: "/admin/addemployee", label: "Add Employee" },
          { path: "/admin/employees", label: "Employee List" },
        ]
      : []), // Admin-only links
    { path: "/admin/addrider", label: "Add Rider" },
    { path: "/admin/riders", label: "Rider List" },
    { path: "/admin/addshopowner", label: "Add Merchant" },
    { path: "/admin/shopowners", label: "Merchant List" },
  ];

  return (
    <aside className="h-full w-64 bg-gray-800 text-white flex flex-col">
      {/* Header Section */}
      <div className="p-4">
        <h2 className="text-2xl font-bold">
          {userRole === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`block px-4 py-2 ${
                  isActiveLink(link.path)
                    ? "bg-gray-700 font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <footer className="p-4">
        <button
          onClick={onLogout || handleLogout}
          className="w-full bg-red-600 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </footer>
    </aside>
  );
};

export default AdminSidebar;
