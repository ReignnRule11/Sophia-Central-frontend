import { apiRequest } from '../lib/api/client';
import type { User } from '../types';

export interface AdminOverview {
  generatedAt: string;
  admin: { id: string; email: string; firstName?: string; lastName?: string; role: 'admin'; emailVerified: boolean; isSuspended: boolean; accountStatus: string };
  accounts: { registeredAccounts: number; activeVerifiedAccounts: number; students: number; lecturers: number; externalReviewerAccounts: number; administrators: number };
  platformAccounts: { total: number; pendingApproval: number; approved: number; unavailable: number };
  reviewerApplications: Record<string, number>;
  globalReviewer: null | {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: string;
    hasReviewerAccess: boolean;
    isGlobalReviewer: boolean;
    reviewerStatus: string;
    emailVerified: boolean;
    isSuspended: boolean;
    accountStatus: string;
    createdAt: string;
    lastLoginAt?: string | null;
    applicationHistoryCount: number;
    moderationReviewCount: number;
    assignmentEventCount: number;
    latestModerationReview: null | { id: string; status: string; createdAt: string; resourceId: string; resourceTitle?: string | null };
    latestApplication: null | { id: string; status: string; createdAt: string; updatedAt: string; decidedAt?: string | null; decisionNote?: string | null };
  };
}

export interface AdminAuditEvent {
  id: string;
  eventType: 'platform_role' | 'reviewer_application' | 'reviewer_assignment' | 'resource_review' | 'admin_bootstrap';
  action: string;
  role: string;
  actorId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  targetId?: string | null;
  targetName?: string | null;
  targetEmail?: string | null;
  createdAt: string;
  note?: string | null;
}

export interface PlatformAccount {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'support' | 'moderator';
  platformRoleVerifiedAt?: string | null;
  platformRoleStatus: 'pending' | 'approved' | 'suspended' | 'revoked';
  emailVerified: boolean;
  isSuspended: boolean;
  accountStatus: string;
  createdAt: string;
}

export const usersApi = {
  list: () => apiRequest<User[]>('/users'),
  platformAccounts: () => apiRequest<PlatformAccount[]>('/users/platform-accounts'),
  adminOverview: () => apiRequest<AdminOverview>('/users/admin/overview'),
  adminAuditEvents: (limit = 50) => apiRequest<AdminAuditEvent[]>(`/users/admin/audit-events?limit=${limit}`),
  updatePlatformRoleAccess: (id: string, action: 'suspend' | 'restore' | 'revoke', reason?: string) =>
    apiRequest<PlatformAccount>(`/users/${encodeURIComponent(id)}/platform-access`, {
      method: 'PATCH', body: JSON.stringify({ action, ...(reason ? { reason } : {}) }),
    }),
  assignPlatformRole: (id: string, role: 'support' | 'moderator') =>
    apiRequest<User>(`/users/${encodeURIComponent(id)}/platform-role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
};
