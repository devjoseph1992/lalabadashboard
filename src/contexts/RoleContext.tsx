// src/contexts/RoleContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { fetchUserRole } from "../firebase/authHelpers";

interface RoleContextProps {
  userRole: string | null;
  roleLoading: boolean;
  user: User | null;
}

const RoleContext = createContext<RoleContextProps>({
  userRole: null,
  roleLoading: true,
  user: null,
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = getAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch the user role
        fetchUserRole(currentUser.uid)
          .then((role) => {
            setUserRole(role);
            setRoleLoading(false);
          })
          .catch((error) => {
            console.error("Failed to fetch user role:", error);
            setRoleLoading(false);
          });
      } else {
        setUser(null);
        setUserRole(null);
        setRoleLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <RoleContext.Provider value={{ userRole, roleLoading, user }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
