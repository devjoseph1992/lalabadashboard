// src/firebase/authHelpers.ts

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Ensure db is exported from config.ts
import { UserRole } from "@/types/UserRole"; // Import UserRole type

export const fetchUserRole = async (uid: string): Promise<UserRole> => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const data = userDoc.data();
    if (data.role && (data.role === "admin" || data.role === "employee")) {
      return data.role as UserRole;
    } else {
      throw new Error("Role not defined or invalid for user");
    }
  } else {
    throw new Error("User does not exist");
  }
};
