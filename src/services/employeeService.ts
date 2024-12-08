// src/services/employeeService.ts

import { db, functions } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import type { EmployeeFormData } from "@/types/employee";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  sssNumber?: string;
  tinNumber?: string;
  philhealthNumber?: string;
  role: string;
}

export async function getEmployees(): Promise<Employee[]> {
  const q = query(collection(db, "users"), where("role", "==", "employee"));
  const querySnapshot = await getDocs(q);
  const employees: Employee[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Employee, "id">),
  }));
  return employees;
}

export async function addEmployee(data: EmployeeFormData): Promise<string> {
  try {
    const addEmployeeFn = httpsCallable(functions, "addEmployeeCallableFn");
    const result = await addEmployeeFn(data);
    const { userId } = result.data as { userId: string };
    return userId;
  } catch (error: any) {
    throw new Error(error.message || "Failed to add employee.");
  }
}
