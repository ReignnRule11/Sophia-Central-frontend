export type UserRole = 'student' | 'lecturer' | 'moderator' | 'admin';
export type ResourceType =
  | 'lecture_notes'
  | 'past_question'
  | 'research_paper'
  | 'project'
  | 'slides'
  | 'other';

export type ModerationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'flagged';

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
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  course: string;
  topic: string;
  institution: string;
  level: string;
  author?: string;
  fileUrl?: string;
  tags: string[];
  views: number;
  downloads: number;
  moderationStatus: ModerationStatus;
  isVerified: boolean;
  uploadedBy?: string;
  createdAt?: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  institution: string;
  level: string;
  description?: string;
}

export interface Institution {
  id: string;
  name: string;
  country?: string;
  city?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}

export interface DashboardStat {
  label: string;
  value: string;
  helper: string;
  trend: 'up' | 'neutral' | 'down';
}

export interface ModerationItem {
  id: string;
  title: string;
  type: ResourceType;
  course: string;
  institution: string;
  uploadedBy: string;
  summary: string;
  status: ModerationStatus;
}
