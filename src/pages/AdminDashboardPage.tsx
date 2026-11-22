import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, Users, UserCog, ClipboardList, LifeBuoy, AlertTriangle } from 'lucide-react';
import { usersApi, type PlatformAccount } from '../api/users';
import { apiRequest } from '../lib/api/client';
import type { User } from '../types';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';

type ReviewerApplication = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  decidedAt?: string | null;
  decisionNote?: string | null;
  user?: { id?: string; email?: string; firstName?: string; lastName?: string };
};

const GLOBAL_REVIEWER_EMAIL = 'sophiscentral@gmail.com';

function Metric({ label, value, detail, icon: Icon }: { label: string; value: number | string; detail: string; icon: typeof Users }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-500">{label}</p><span className="rounded-xl bg-violet-50 p-2 text-violet-700"><Icon size={18}/></span></div>
    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
    <p className="mt-1 text-xs text-slate-500">{detail}</p>
  </article>;
}

function AdminLink({ to, title, description }: { to: string; title: string; description: string }) {
  return <Link to={to} className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-300 hover:bg-violet-50/40">
    <span><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span></span>
    <ArrowRight size={17} className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700"/>
  </Link>;
}

export function AdminDashboardPage() {
  const usersQuery = useQuery({ queryKey: ['admin-dashboard-users'], queryFn: usersApi.list, staleTime: 30_000 });
  const platformQuery = useQuery({ queryKey: ['platform-accounts'], queryFn: usersApi.platformAccounts, staleTime: 30_000 });
  const applicationsQuery = useQuery({
    queryKey: ['admin-reviewer-applications'],
    queryFn: () => apiRequest<ReviewerApplication[]>('/reviewer-applications'),
    staleTime: 30_000,
  });

  const users: User[] = usersQuery.data ?? [];
  const accounts: PlatformAccount[] = platformQuery.data ?? [];
  const applications = applicationsQuery.data ?? [];
  const globalReviewer = users.find(user => user.email?.trim().toLowerCase() === GLOBAL_REVIEWER_EMAIL);
  const globalReviewerApplications = useMemo(
    () => applications.filter(application => application.user?.email?.trim().toLowerCase() === GLOBAL_REVIEWER_EMAIL)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [applications],
  );
  const pendingApplications = applications.filter(application => ['submitted', 'under_review', 'more_information_required'].includes(application.status)).length;
  const pendingPlatformApprovals = accounts.filter(account => !account.platformRoleVerifiedAt).length;
  const loading = usersQuery.isLoading || platformQuery.isLoading || applicationsQuery.isLoading;
  const failed = usersQuery.isError || platformQuery.isError || applicationsQuery.isError;

  if (loading) return <LoadingState message="Loading administration overview..." />;
  if (failed) return <ErrorState message="Unable to load the complete administration overview. Check the connection and retry." onRetry={() => { void usersQuery.refetch(); void platformQuery.refetch(); void applicationsQuery.refetch(); }} />;

  const latestGlobalApplication = globalReviewerApplications[0];
  const globalReviewerStatus = globalReviewer?.isGlobalReviewer === true && globalReviewer.hasReviewerAccess === true
    ? 'Global Academic Reviewer authority active'
    : globalReviewer?.reviewerStatus
      ? `Reviewer status: ${globalReviewer.reviewerStatus.replace(/_/g, ' ')}`
      : 'Existing account found; reviewer capability needs review';

  return <div className="space-y-7">
    <header className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-6 text-white sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Sophis Central · Administration</p>
      <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Platform overview</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Manage platform access, reviewer governance and operational oversight. Privileged permissions are enforced by the backend and recorded in audit history.</p>
    </header>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Platform summary">
      <Metric label="Registered accounts" value={users.length} detail="Accounts returned by the admin user service" icon={Users}/>
      <Metric label="Platform identities" value={accounts.length} detail="Dedicated Support and Moderator accounts" icon={UserCog}/>
      <Metric label="Pending platform approvals" value={pendingPlatformApprovals} detail="Support / Moderator approval timestamps missing" icon={ShieldCheck}/>
      <Metric label="Reviewer applications" value={pendingApplications} detail="Submitted, under review or awaiting information" icon={ClipboardList}/>
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Existing designated identity</p><h3 className="mt-2 text-xl font-bold text-slate-950">Global Academic Reviewer</h3></div>
          <span className="rounded-xl bg-violet-50 p-3 text-violet-700"><ShieldCheck size={21}/></span>
        </div>
        {globalReviewer ? <>
          <p className="mt-4 break-all text-sm font-semibold text-slate-900">{globalReviewer.email}</p>
          <p className="mt-1 text-sm text-slate-600">{globalReviewerStatus}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Application records</p><p className="mt-1 text-xl font-bold text-slate-900">{globalReviewerApplications.length}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Latest application</p><p className="mt-1 text-sm font-semibold capitalize text-slate-900">{latestGlobalApplication?.status?.replace(/_/g, ' ') ?? 'No application record returned'}</p></div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">This is the existing account. Its identity and records must be preserved. Global Reviewer authority is limited to academic review governance and does not grant Admin, Moderator or Support permissions.</p>
        </> : <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-2"><AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-700"/><p className="text-sm leading-6 text-amber-900">The existing Global Reviewer account was not found in the admin user response. Do not create a replacement. Verify the existing account and its email mapping before changing reviewer access.</p></div>
        </div>}
        <Link to="/admin/reviewers?tab=applications" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900">Open reviewer governance <ArrowRight size={15}/></Link>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Administration workspace</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Quick access</h3>
        <div className="mt-4 space-y-3">
          <AdminLink to="/admin/accounts" title="Platform accounts" description="Review the existing Moderator identity and dedicated Support account approval."/>
          <AdminLink to="/admin/reviewers?tab=applications" title="Reviewer governance" description="Review applications, decisions, suspensions, revocations and reviewer history."/>
          <AdminLink to="/analytics" title="Platform analytics" description="Open platform-level analytics and operational reporting."/>
        </div>
      </article>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3"><LifeBuoy size={19} className="text-violet-700"/><div><h3 className="font-semibold text-slate-900">Privileged account provisioning</h3><p className="mt-1 text-sm leading-6 text-slate-600">Admin is provisioned through a controlled bootstrap. Support and Moderator remain unavailable to their workspaces until their identity setup, verification requirements and explicit Admin approval are complete.</p></div></div>
    </section>
  </div>;
}
