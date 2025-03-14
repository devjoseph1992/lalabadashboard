import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { getAuth, signOut } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig"; // Firestore import
import { doc, getDoc } from "firebase/firestore";

// Loading Component
const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
);

// Error Component
const ErrorScreen: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <p>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retry
      </button>
    )}
  </div>
);

const AdminLayout: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        // If no user is authenticated, redirect to login
        if (!user) {
          console.warn("No authenticated user found. Redirecting to login...");
          navigate("/");
          return;
        }

        // 🔹 Fetch user role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.warn("User role not found in Firestore. Redirecting...");
          navigate("/");
          return;
        }

        const userData = userDocSnap.data();
        const role = userData.role || "user"; // Default role

        // Redirect employees to their dashboard
        if (role === "employee") {
          navigate("/employee");
          return;
        }

        if (role !== "admin") {
          console.warn("Unauthorized role. Redirecting...");
          navigate("/");
          return;
        }

        // Set user role and cache it in localStorage
        setUserRole(role);
        localStorage.setItem("userRole", role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserRole();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.clear(); // Clear session-related data
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Render loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Render error state if userRole is invalid
  if (!userRole) {
    return (
      <ErrorScreen
        message="User role not found. Please log in again."
        onRetry={handleLogout}
      />
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar userRole={userRole} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
