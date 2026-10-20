import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'lecturer', 'moderator', 'admin']).default('student'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'lecturer', 'moderator', 'admin']).default('student'),
});

export const resourceUploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  course: z.string().min(2, 'Course is required'),
  topic: z.string().min(2, 'Topic is required'),
  institution: z.string().min(2, 'Institution is required'),
  level: z.string().min(1, 'Level is required'),
  type: z.enum(['lecture_notes', 'past_question', 'research_paper', 'project', 'slides', 'other']),
  tags: z.string().default(''),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ResourceUploadValues = z.infer<typeof resourceUploadSchema>;
