import { z } from "zod";
import { UserRole } from "../models/User";

export const createEmployeeSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),

  department: z.string().min(2),
  designation: z.string().min(2),

  // multipart/form-data sends numbers as strings
  salary: z.coerce.number().nonnegative(),

  joiningDate: z.coerce.date(),

  role: z.nativeEnum(UserRole),

  reportingManager: z.string().nullable().optional(),

  // Cloudinary image URL
  photo: z.string().optional(),
});

export const updateEmployeeSchema =
  createEmployeeSchema.partial();

// Fields an EMPLOYEE is allowed to change on their own profile —
// deliberately excludes salary, role, department, status, reportingManager, email.
export const updateOwnProfileSchema = z.object({
  phone: z.string().min(10).max(15).optional(),
  photo: z.string().optional(),
});