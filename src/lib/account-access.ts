export type AcademicAccountRole = 'student' | 'lecturer' | 'reviewer' | 'moderator' | 'admin';

export type WorkspaceUser = {
  role?: string;
  reviewerBaseRole?: 'student' | 'lecturer' | null;
  hasReviewerAccess?: boolean;
  isProfileComplete?: boolean;
} | null | undefined;

/** Resolve legacy reviewer accounts to their original academic account type. */
export function getPrimaryRole(user: WorkspaceUser): AcademicAccountRole | undefined {
  if (!user?.role) return undefined;
  if (user.role === 'reviewer' && (user.reviewerBaseRole === 'student' || user.reviewerBaseRole === 'lecturer')) {
    return user.reviewerBaseRole;
  }
  return user.role as AcademicAccountRole;
}

/** Older reviewer-only sessions remain supported while the capability migration rolls out. */
export function hasReviewerAccess(user: WorkspaceUser): boolean {
  return user?.hasReviewerAccess === true ||
    (user?.hasReviewerAccess == null && user?.role === 'reviewer' && !user.reviewerBaseRole);
}

export function hasMultipleWorkspaces(user: WorkspaceUser): boolean {
  const role = getPrimaryRole(user);
  return hasReviewerAccess(user) && (role === 'student' || role === 'lecturer');
}

export function getDefaultWorkspacePath(user: WorkspaceUser): string {
  const role = getPrimaryRole(user);
  if (role === 'moderator') return '/moderator/dashboard';
  if (role === 'admin') return '/moderation';
  if ((role === 'student' || role === 'lecturer') && user?.isProfileComplete === false) return '/onboarding/profile';
  if (hasMultipleWorkspaces(user)) return '/workspace';
  if (role === 'reviewer') return hasReviewerAccess(user) ? '/moderation' : '/profile';
  if (role === 'lecturer') return '/lecturer/dashboard';
  return '/student/dashboard';
}
