import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi, type PlatformAccount } from '../api/users';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { EmptyState } from '../components/states/EmptyState';

type PlatformRole = 'support' | 'moderator';

export function AdminUsersPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
    staleTime: 30_000,
  });
  const platformQuery = useQuery({
    queryKey: ['platform-accounts'],
    queryFn: usersApi.platformAccounts,
    staleTime: 30_000,
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [assignment, setAssignment] = useState<{ id: string; name: string; role: PlatformRole } | null>(null);

  if (isLoading) return <LoadingState message="Loading users..." />;
  if (isError) return <ErrorState message={error instanceof Error ? error.message : 'Unable to load users.'} onRetry={() => void refetch()} />;

  const users = data ?? [];
  const platformAccounts: PlatformAccount[] = platformQuery.data ?? [];
  const linked = (role: PlatformRole) => platformAccounts.find(account => account.role === role);
  const confirmAssignment = async () => {
    if (!assignment || updatingId) return;
    const { id, name, role } = assignment;
    setUpdatingId(id);
    setActionError('');
    setActionNotice('');
    try {
      await usersApi.assignPlatformRole(id, role);
      setActionNotice(`${name} is now the designated ${role === 'support' ? 'Support' : 'Moderator'} account.`);
      setAssignment(null);
      await Promise.all([refetch(), platformQuery.refetch()]);
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Unable to link this platform account.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Admin dashboard · Users</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">User management</h2>
        <p className="mt-2 text-sm text-slate-400">Review academic identities and link the single verified platform account for each operational role.</p>
      </div>

      {actionError && <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">{actionError}</p>}
      {actionNotice && <p role="status" className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">{actionNotice}</p>}

      <section className="grid gap-4 md:grid-cols-2" aria-label="Platform accounts">
        {(['support', 'moderator'] as PlatformRole[]).map(role => {
          const account = linked(role);
          const title = role === 'support' ? 'Platform Support account' : 'Platform Moderator account';
          return (
            <article key={role} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">{title}</p>
              {platformQuery.isLoading ? <p className="mt-3 text-sm text-slate-400">Loading linked account…</p>
                : account ? (
                  <div className="mt-3">
                    <p className="font-semibold text-white">{[account.firstName, account.lastName].filter(Boolean).join(' ') || 'Platform account'}</p>
                    <p className="mt-1 break-all text-sm text-slate-400">{account.email}</p>
                    <p className="mt-3 text-xs text-emerald-300">{account.emailVerified ? 'Email verified' : 'Email not verified'} · {account.accountStatus} · {account.isSuspended ? 'Suspended' : 'Active'}</p>
                  </div>
                ) : <p className="mt-3 text-sm text-amber-300">No account linked yet. Select an eligible verified account below.</p>}
            </article>
          );
        })}
      </section>
      {platformQuery.isError && <p role="alert" className="text-sm text-rose-300">Unable to load current platform accounts. Refresh this section before assigning roles.</p>}

      {users.length === 0 ? <EmptyState title="No users found" description="There are no users available to review." /> : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Institution</th><th className="px-4 py-3">Profile</th><th className="px-4 py-3">Email verification</th><th className="px-4 py-3">Platform account linking</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(item => {
                  const eligible = ['student', 'lecturer'].includes(item.role) && item.emailVerified === true && item.accountStatus === 'active' && item.isSuspended !== true && !('hasReviewerAccess' in item && item.hasReviewerAccess === true);
                  return (
                    <tr key={item.id} className="text-slate-300">
                      <td className="px-4 py-4"><div className="font-medium text-white">{item.firstName || item.name || 'Unnamed user'} {item.lastName || ''}</div><div className="text-xs text-slate-500">{item.email}</div></td>
                      <td className="px-4 py-4 capitalize">{item.role}</td>
                      <td className="px-4 py-4">{item.institution || 'Not set'}</td>
                      <td className="px-4 py-4">{item.isProfileComplete ? <span className="text-emerald-300">Complete</span> : <span className="text-amber-300">Incomplete</span>}</td>
                      <td className="px-4 py-4">{item.emailVerified ? <span className="text-emerald-300">Verified</span> : <span className="text-amber-300">Unverified</span>}</td>
                      <td className="px-4 py-4">
                        <div className="flex min-w-52 flex-wrap gap-2">
                          {(['support', 'moderator'] as PlatformRole[]).map(role => {
                            const alreadyLinked = Boolean(linked(role));
                            return alreadyLinked
                              ? <span key={role} className="rounded-lg border border-slate-700 px-2.5 py-2 text-xs text-slate-500">{role === 'support' ? 'Support linked' : 'Moderator linked'}</span>
                              : <button key={role} type="button" disabled={!eligible || Boolean(updatingId) || platformQuery.isError} onClick={() => setAssignment({ id: item.id, name: `${item.firstName || item.name || 'This user'} ${item.lastName || ''}`.trim(), role })} className="rounded-lg border border-violet-400/40 px-3 py-2 text-xs font-semibold text-violet-200 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-40">{updatingId === item.id ? 'Linking…' : `Link ${role === 'support' ? 'Support' : 'Moderator'}`}</button>;
                          })}
                        </div>
                        {!eligible && ['student', 'lecturer', 'reviewer'].includes(item.role) && <p className="mt-2 text-xs text-slate-500">Requires a verified email and an active, unsuspended account without separate Reviewer access.</p>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {assignment && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
        <section role="dialog" aria-modal="true" aria-labelledby="platform-role-confirm-title" className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
          <h3 id="platform-role-confirm-title" className="text-lg font-bold text-white">Link platform account?</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">Link <strong className="text-white">{assignment.name}</strong> as the single platform {assignment.role === 'support' ? 'Support' : 'Moderator'} account? This replaces the account’s current primary role and workspace. Only one account can hold this platform role.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => void confirmAssignment()} disabled={Boolean(updatingId)} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{updatingId ? 'Linking…' : 'Confirm link'}</button>
            <button type="button" onClick={() => setAssignment(null)} disabled={Boolean(updatingId)} className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-200 disabled:opacity-50">Cancel</button>
          </div>
        </section>
      </div>}
    </div>
  );
}
