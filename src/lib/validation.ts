export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'lecturer', 'moderator', 'admin']).default('student'),
  handle: z.string().min(2, 'Social handle must be at least 2 characters').optional(),
});

export type RegisterValues = z.infer<typeof registerSchema>;
