// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { fetchUserRole } from "../firebase/authHelpers"; // Ensure this function fetches the user's role
import { UserRole } from "../types/UserRole"; // Import the UserRole type

// Define the shape of the context
interface AuthContextProps {
  user: User | null;
  userRole: UserRole | null;
  roleLoading: boolean;
  login: () => void;
  logout: () => void;
}

// Create and export the context with default values
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userRole: null,
  roleLoading: true,
  login: () => {},
  logout: () => {},
});

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const role = await fetchUserRole(currentUser.uid);
          // Type assertion to ensure the role is of type UserRole
          if (role === "admin" || role === "employee") {
            setUserRole(role);
          } else {
            throw new Error("Invalid user role received");
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setUserRole(null);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setRoleLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const login = () => {
    // Since Firebase handles tokens, this might remain empty
    // Implement additional login logic here if necessary
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userRole, roleLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
