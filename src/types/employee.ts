// src/types/employee.ts (new file)
import { z } from "zod";
import { addEmployeeSchema } from "@/schemas/employeeSchema";
export type EmployeeFormData = z.infer<typeof addEmployeeSchema>;
