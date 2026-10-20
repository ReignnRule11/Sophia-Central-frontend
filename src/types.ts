export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  faculty?: string;
  department?: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  handle?: string;
  authProvider?: 'email' | 'google' | 'apple' | 'github' | 'linkedin' | 'instagram' | 'twitter';
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
}
