
import { z } from 'zod';

const optionalProfileUrl = z
  .string()
  .trim()
  .max(500, 'Profile URL is too long')
  .refine(
    (value) => value === '' || /^https?:\/\/\S+$/i.test(value),
    'Enter a valid URL beginning with https://',
  );

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, 'First name is required'),
  lastName: z.string().trim().min(2, 'Last name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),

  institution: z
    .string()
    .trim()
    .max(160, 'Institution name is too long')
    .optional(),

  faculty: z
    .string()
    .trim()
    .max(160, 'Faculty name is too long')
    .optional(),

  department: z
    .string()
    .trim()
    .max(160, 'Department name is too long')
    .optional(),

  handle: z
    .string()
    .trim()
    .max(80, 'Academic handle must be 80 characters or fewer')
    .optional()
    .or(z.literal('')),

  socialLinks: z
    .object({
      linkedin: optionalProfileUrl,
      instagram: optionalProfileUrl,
      twitter: optionalProfileUrl,
    })
    .default({
      linkedin: '',
      instagram: '',
      twitter: '',
    }),
});

export type RegisterValues = z.infer<typeof registerSchema>;
