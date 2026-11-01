import { useEffect, useState } from 'react';
import { BarChart3, BookOpen, Download, Eye, Search, Users } from 'lucide-react';
import { apiRequest } from '../lib/api/client';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { SectionTitle } from '../components/layout/AppShell';

type Metrics = { totalResources?: number; totalViews?: number; totalDownloads?: number; totalUsers?: number; byType?: Record<string, number>; byStatus?: Record<string, number>; totalReviews?: number; byRole?: Record<string, number>; totalStudents?: number; totalLecturers?: number; [key: string]: unknown };

function MetricCard({ label, value, icon: Icon, helper }: { label: string; value: string | number; icon: typeof BookOpen; helper?: string }) {
  return <div className="rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-medium text-[#5C6982]">{label}</span><Icon size={18} className="text-[#6121D0}" /></div><div className="mt-3 text-3xl font-bold text-[#091F5B]">{value}</div>{helper && <p className="mt-1 text-xs text-[#5C6982]">{helper}</p>}</div>;
}

export function AnalyticsWorkspacePage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'students' | 'lecturers'>('students');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true); setError('');
      try {
        let result: Metrics;
        if (user?.role === 'lecturer') {
          const resources = await resourcesApi.mine();
          const mine = resources.filter((item) => item.uploadedBy === user.id || (item as { uploaderId?: string }).uploaderId === user.id);
          result = { totalResources: mine.length, totalViews: mine.reduce((sum, item) => sum + Number((item as { views?: number }).views || 0), 0), totalDownloads: mine.reduce((sum, item) => sum + Number((item as { downloads?: number }).downloads || 0), 0), byStatus: mine.reduce<Record<string, number>>((acc, item) => { const status = String(item.moderationStatus || 'pending'); acc[status] = (acc[status] || 0) + 1; return acc; }, {}) };
        } else {
          const [resources, moderation, users] = await Promise.all([
            apiRequest<Metrics>('/analytics/resources'),
            apiRequest<Metrics>('/analytics/moderation'),
            apiRequest<Metrics>('/analytics/users').catch(() => ({} as Metrics)),
          ]);
          result = { ...resources, totalReviews: moderation.totalReviews, byRole: users.byRole, totalStudents: users.totalStudents, totalLecturers: users.totalLecturers, totalUsers: users.totalUsers };
        }
        if (active) setMetrics(result);
      } catch (cause) { if (active) setError(cause instanceof Error ? cause.message : 'Unable to load analytics.'); }
      finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [user?.id, user?.role]);

  const moderator = user?.role === 'moderator' || user?.role === 'admin';
  const cards = moderator
    ? view === 'students'
      ? [{ label: 'Students', value: metrics?.totalStudents ?? '—', icon: Users }, { label: 'Resource views', value: metrics?.totalViews ?? '—', icon: Eye }, { label: 'Downloads', value: metrics?.totalDownloads ?? '—', icon: Download }, { label: 'Resources', value: metrics?.totalResources ?? '—', icon: BookOpen }]
      : [{ label: 'Lecturers', value: metrics?.totalLecturers ?? '—', icon: Users }, { label: 'Resource views', value: metrics?.totalViews ?? '—', icon: Eye }, { label: 'Downloads', value: metrics?.totalDownloads ?? '—', icon: Download }, { label: 'Moderation decisions', value: metrics?.totalReviews ?? '—', icon: BarChart3 }]
    : [{ label: 'My resources', value: metrics?.totalResources ?? '—', icon: BookOpen }, { label: 'Resource views', value: metrics?.totalViews ?? '—', icon: Eye }, { label: 'Downloads', value: metrics?.totalDownloads ?? '—', icon: Download }, { label: 'Search analytics', value: 'Not tracked yet', icon: Search }];
  return <div className="space-y-6">
    <SectionTitle eyebrow={moderator ? 'Platform insights' : 'Private lecturer insights'} title={moderator ? 'Analytics' : 'My resource analytics'} />
    {moderator && <div className="flex flex-wrap gap-2" role="tablist" aria-label="Analytics account type"><button type="button" role="tab" aria-selected={view === 'students'} onClick={() => setView('students')} className={`rounded-xl border px-4 py-2 text-sm font-semibold ${view === 'students' ? 'border-[#6121D0] bg-[#6121D0] text-white' : 'border-[#DCE4EF] bg-white text-[#091F5B]'}`}>Student accounts</button><button type="button" role="tab" aria-selected={view === 'lecturers'} onClick={() => setView('lecturers')} className={`rounded-xl border px-4 py-2 text-sm font-semibold ${view === 'lecturers' ? 'border-[#6121D0] bg-[#6121D0] text-white' : 'border-[#DCE4EF] bg-white text-[#091F5B]'}`}>Lecturer accounts</button></div>}
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
    {loading ? <div className="rounded-2xl border border-[#DCE4EF] p-8 text-sm text-[#5C6982]">Loading analytics…</div> : <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <MetricCard key={card.label} label={card.label} value={card.value} icon={card.icon} />)}</div><div className="rounded-2xl border border-[#DCE4EF] bg-[#F8FAFD] p-5"><h3 className="font-semibold text-[#091F5B]">Analytics coverage</h3><p className="mt-2 text-sm leading-6 text-[#4B5563]">Resource view and download totals are based on recorded resource counters. Search terms, returning-user retention and unique contributor counts require dedicated event tracking; they are not presented as fabricated figures. {user?.role === 'lecturer' ? 'This page only requests your own resource submissions and displays metrics tied to those resources.' : 'Account-level drill-down should only be used by authorized moderators and administrators.'}</p></div></>}
  </div>;
}
