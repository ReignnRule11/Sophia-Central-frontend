const keyForUser = (userId: string) => `sophia:saved-resources:${userId}`;

export function getSavedResourceIds(userId: string): string[] {
  try {
    const raw = localStorage.getItem(keyForUser(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export function isResourceSaved(userId: string, resourceId: string): boolean {
  return getSavedResourceIds(userId).includes(resourceId);
}

export function setResourceSaved(userId: string, resourceId: string, saved: boolean): string[] {
  const current = new Set(getSavedResourceIds(userId));
  if (saved) current.add(resourceId); else current.delete(resourceId);
  const next = [...current];
  localStorage.setItem(keyForUser(userId), JSON.stringify(next));
  return next;
}
