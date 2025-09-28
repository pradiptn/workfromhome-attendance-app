import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const attendanceSchema = z.object({
  notes: z.string().optional(),
  photo: z.instanceof(File, { message: 'Photo is required' }),
});

export const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.union([z.literal('employee'), z.literal('admin')]),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type AttendanceForm = z.infer<typeof attendanceSchema>;
export type EmployeeForm = z.infer<typeof employeeSchema>;
