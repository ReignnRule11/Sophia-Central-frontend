import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  institution: z.string().min(2, 'Institution is required'),
  faculty: z.string().optional(),
  department: z.string().optional(),
  handle: z.string().min(2, 'Social handle must be at least 2 characters').optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
  }).default({ linkedin: '', instagram: '', twitter: '' }),
});

export type RegisterValues = z.infer<typeof registerSchema>;
