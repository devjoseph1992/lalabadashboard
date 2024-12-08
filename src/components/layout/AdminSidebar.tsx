import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig";

interface SidebarProps {
  onLogout: () => void; // Function to handle logout
}

const AdminSidebar: React.FC<SidebarProps> = ({}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      localStorage.removeItem("idToken"); // Clear token from storage
      console.log("User logged out successfully");
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <div className="h-full w-64 bg-gray-800 text-white flex flex-col">
      <div className="flex-1">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin/riders"
              className={`block px-4 py-2 ${
                isActiveLink("/admin/riders")
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              Riders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/shop-owners"
              className={`block px-4 py-2 ${
                isActiveLink("/admin/shop-owners")
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              Shop Owners
            </Link>
          </li>
          <li>
            <Link
              to="/admin/addemployee"
              className={`block px-4 py-2 ${
                isActiveLink("/admin/addemployee")
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              Add Employee
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
