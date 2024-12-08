// src/schemas/employeeSchema.ts

import { z } from "zod";

// Base Schema for Common Fields
const userBaseSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  address: z.string().nonempty("Address is required"),
  phoneNumber: z
    .string()
    .regex(/^\d{10,11}$/, "Phone number must be 10-11 digits"),
});

// Employee Schema
export const addEmployeeSchema = userBaseSchema.extend({
  sssNumber: z.string().nonempty("SSS number is required"),
  tinNumber: z.string().nonempty("TIN number is required"),
  philhealthNumber: z.string().nonempty("PhilHealth number is required"),
});
