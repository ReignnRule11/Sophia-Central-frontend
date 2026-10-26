import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OverviewCard, SectionTitle, UserBadge } from '../components/layout/AppShell';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';

export function LecturerDashboardPage() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { data: resources = [] } = useQuery({ queryKey: ['resources'], queryFn: () => resourcesApi.list(), staleTime: 60_000 });
  const pendingResources = resources.filter((item) => item.uploadedBy === user?.id && String(item.moderationStatus || '').toLowerCase() === 'pending');

  const stats = [
    { label: 'Uploaded this month', value: String(resources.filter((item) => item.uploadedBy === user?.id).length), helper: 'resources in your library' },
    { label: 'Pending review', value: String(pendingResources.length), helper: 'awaiting moderator review' },
    { label: 'Courses taught', value: String(user?.coursesTaught?.length ?? 0), helper: 'courses on your profile' },
    { label: 'Academic identity', value: user?.isVerified ? 'Verified' : 'Pending', helper: 'institution verification status' },
  ];

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><SectionTitle eyebrow="Lecturer workspace" title="Instructor overview" /><div className="flex items-center gap-3"><Link to="/upload" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"><UploadCloud size={16} /> Upload resource</Link><UserBadge /></div></div>
    {showOnboarding && <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><div className="text-[10px] uppercase tracking-[0.22em] text-violet-200">Lecturer workflow</div><h3 className="mt-2 text-2xl font-semibold text-white">Upload → submit → moderation</h3><p className="mt-2 text-sm text-slate-300">Every resource you submit enters the pending-review queue before students can access it.</p></div><button type="button" onClick={() => setShowOnboarding(false)} className="rounded-full border border-violet-400/30 bg-slate-900 px-4 py-2 text-sm text-violet-100">Dismiss</button></div></div>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="glass-panel p-4"><div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</div><div className="mt-4 text-3xl font-semibold text-white">{stat.value}</div><div className="mt-1 text-sm text-slate-400">{stat.helper}</div></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <OverviewCard title="Pending review" action="Moderation queue"><div className="space-y-3">{pendingResources.length === 0 ? <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-400">No resources are waiting for review. <Link to="/upload" className="text-violet-200 underline">Submit a resource</Link>.</div> : pendingResources.slice(0, 6).map((item) => <Link key={item.id} to={`/resource/${encodeURIComponent(item.id)}`} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4"><div><div className="font-medium text-white">{item.title}</div><div className="text-sm text-slate-400">{item.course || 'No course'} · Pending review</div></div><ChevronRight size={16} className="text-violet-200" /></Link>)}</div></OverviewCard>
      <OverviewCard title="Academic profile" action="Current"><div className="space-y-3 text-sm">{[['Institution', user?.institution], ['Faculty', user?.faculty], ['Department', user?.department], ['Courses taught', user?.coursesTaught?.join(', ') || 'Not set']].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-slate-200">{value || 'Not set'}</div></div>)}</div></OverviewCard>
    </div>
  </div>;
}
