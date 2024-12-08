// src/services/userService.ts

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Adjust the import path as needed
import { UserRole } from "@/types/UserRole"; // Import the UserRole type

interface AddEmployeeData {
  name: string;
  email: string;
  password: string;
  // Add other employee-specific fields if necessary
}

export const addEmployee = async (data: AddEmployeeData) => {
  const auth = getAuth();
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = userCredential.user;

    // Add user details to Firestore
    const employeesCollection = collection(db, "employees");
    await addDoc(employeesCollection, {
      uid: user.uid,
      name: data.name,
      email: data.email,
      type: UserRole.Employee,
      createdAt: new Date(),
    });

    // Add a user document with role
    const usersCollection = collection(db, "users");
    await addDoc(usersCollection, {
      uid: user.uid,
      email: data.email,
      role: UserRole.Employee,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// Similarly, implement addRider and addShopOwner functions using Firebase Auth
