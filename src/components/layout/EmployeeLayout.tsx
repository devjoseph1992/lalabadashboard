import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import EmployeeSidebar from "./EmployeeSidebar";
import { getAuth, signOut } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
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

const EmployeeLayout: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

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
        const role = userData.role || "user";

        // Redirect admins to their dashboard
        if (role === "admin") {
          navigate("/admin");
          return;
        }

        if (role !== "employee") {
          console.warn("Unauthorized role. Redirecting...");
          navigate("/");
          return;
        }

        setUserRole(role);
        localStorage.setItem("userRole", role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
      <EmployeeSidebar userRole={userRole} onLogout={handleLogout} />

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
