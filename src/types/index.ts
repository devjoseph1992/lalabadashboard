import { Timestamp } from "firebase/firestore"; // Import Timestamp from the Firestore SDK

export type UserRole = "employee" | "rider" | "shop_owner" | "admin";

// Base User Document Interface
export interface UserDocument {
  id: string; // Firestore document ID
  name: string; // User's full name
  email: string; // User's email address
  role: UserRole; // Role assigned to the user
  createdAt: Timestamp; // Firestore Timestamp for creation date
}

export interface Employee {
  id: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
  sssNumber?: string;
  tinNumber?: string;
  philhealthNumber?: string;
}
