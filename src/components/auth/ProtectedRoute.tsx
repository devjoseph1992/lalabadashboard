import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { fetchUserRole } from "../../firebase/authHelpers"; // Adjust the path if necessary

const auth = getAuth();

interface ProtectedRouteProps {
  role: string; // Required role for the route
  children: React.ReactNode; // Content to render if access is allowed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const [user, loading] = useAuthState(auth); // Removed unused error
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRole(user.uid)
        .then((role) => setUserRole(role))
        .catch((err) => console.error("Error fetching user role:", err));
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (userRole && userRole !== role)
    return <Navigate to="/error/unauthorized" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
