import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BookOpen, Search, UserRound, Sparkles } from 'lucide-react';
import { OverviewCard, UserBadge } from '../components/layout/AppShell';
import { mockResources } from '../lib/mock-data';
import { sophiaApi } from '../api/sophiaApi';
import { useAuth } from '../context/AuthContext';
import { getSavedResourceIds } from '../lib/savedResources';
import type { Resource } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const firstName = user?.firstName?.trim() || user?.name?.trim().split(/\s+/)[0] || 'there';

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true); setError('');
        const data = await sophiaApi.resources.list();
        setResources(Array.isArray(data) ? data : []);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Could not load your resource feed.');
        setResources([]);
      } finally { setLoading(false); }
    };
    void fetchResources();
  }, []);

  const savedCount = user ? getSavedResourceIds(user.id).length : 0;
  const profileComplete = user?.isProfileComplete !== false;
  const verifiedCount = resources.filter((resource) => resource.isVerified || resource.moderationStatus === 'approved').length;

  return <div className="space-y-6">
    <section className="rounded-3xl bg-[#2C36D9] p-5 text-white shadow-[0_18px_45px_rgba(44,54,217,0.18)] sm:p-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-[10px] uppercase tracking-[0.22em] text-white/75">Study dashboard</p><h2 className="mt-2 text-3xl font-semibold">Your academic momentum is building.</h2><p className="mt-2 text-sm text-white/85">Welcome back, {firstName}.</p></div><UserBadge /></div></section>

    {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

    {!profileComplete && <section className="rounded-2xl border border-[#E1D3F5] bg-[#FCF9FF] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6121D0]">Finish your profile</p><h3 className="mt-1 text-lg font-semibold text-[#091F5B]">Complete your academic profile</h3><p className="mt-1 text-sm text-[#5C6982]">Add your institution, faculty, department and study details to personalise your library.</p></div><Link to="/onboarding/profile" className="inline-flex items-center justify-center rounded-xl bg-[#6121D0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2C36D9]">Complete profile</Link></div></section>}

    <section aria-label="Account shortcuts" className="grid gap-4 sm:grid-cols-2"><Link to="/profile" className="group flex items-start gap-4 rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm transition hover:border-[#6121D0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6121D0]"><span className="rounded-xl bg-[#F7F1FF] p-3 text-[#6121D0]"><UserRound size={22} /></span><span className="min-w-0"><span className="block font-semibold text-[#091F5B]">My profile</span><span className="mt-1 block text-sm text-[#5C6982]">View and update your academic identity and bio.</span><span className="mt-3 inline-block text-sm font-semibold text-[#6121D0]">Edit profile →</span></span></Link><Link to="/notifications" className="group flex items-start gap-4 rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm transition hover:border-[#6121D0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6121D0]"><span className="rounded-xl bg-[#F3F6FC] p-3 text-[#2C36D9]"><Bell size={22} /></span><span className="min-w-0"><span className="block font-semibold text-[#091F5B]">Notifications</span><span className="mt-1 block text-sm text-[#5C6982]">Review account and learning activity updates.</span><span className="mt-3 inline-block text-sm font-semibold text-[#6121D0]">Open notifications →</span></span></Link></section>

    <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm"><div className="text-[10px] uppercase tracking-[0.2em] text-[#71809A]">Library results</div><div className="mt-3 text-3xl font-semibold text-[#091F5B]">{loading ? '—' : resources.length}</div><div className="mt-1 text-sm text-[#5C6982]">available resources</div></div><div className="rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm"><div className="text-[10px] uppercase tracking-[0.2em] text-[#71809A]">Saved resources</div><div className="mt-3 text-3xl font-semibold text-[#091F5B]">{savedCount}</div><div className="mt-1 text-sm text-[#5C6982]">saved on this device</div></div><div className="rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm"><div className="text-[10px] uppercase tracking-[0.2em] text-[#71809A]">Verified resources</div><div className="mt-3 text-3xl font-semibold text-[#091F5B]">{loading ? '—' : verifiedCount}</div><div className="mt-1 text-sm text-[#5C6982]">approved in the current feed</div></div></div>

    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><OverviewCard title="Latest resources" action={loading ? 'Syncing…' : 'Live'}>{loading ? <div className="text-sm text-[#5C6982]">Loading your resource feed…</div> : resources.length === 0 ? <div className="rounded-2xl border border-[#DCE4EF] bg-[#F8FAFD] p-5 text-sm text-[#5C6982]">No resources are available yet. Explore the library when new materials are published.</div> : <div className="grid gap-4 md:grid-cols-2">{resources.slice(0, 6).map((resource) => <Link key={resource.id} to={`/resource/${encodeURIComponent(resource.id)}`} className="rounded-2xl border border-[#DCE4EF] bg-white p-4 transition hover:border-[#6121D0] hover:shadow-sm"><div className="mb-2 flex items-center justify-between gap-3"><span className="rounded-full bg-[#F3F6FC] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#2C36D9]">{resource.type.replace('_', ' ')}</span>{resource.isVerified ? <span className="text-xs font-semibold text-emerald-700">Verified</span> : null}</div><div className="text-lg font-medium text-[#091F5B]">{resource.title}</div><div className="mt-2 text-sm text-[#5C6982]">{resource.course || 'Academic resource'}{resource.topic ? ` · ${resource.topic}` : ''}</div></Link>)}</div>}</OverviewCard><OverviewCard title="Quick access" action="Explore"><div className="space-y-3"><Link to="/library" className="flex items-center gap-3 rounded-xl border border-[#DCE4EF] bg-white px-3 py-3 text-sm font-medium text-[#091F5B] hover:border-[#6121D0]"><Search size={16} className="text-[#6121D0]" /> Search academic resources</Link><Link to="/ai" className="flex items-center gap-3 rounded-xl border border-[#DCE4EF] bg-white px-3 py-3 text-sm font-medium text-[#091F5B] hover:border-[#6121D0]"><Sparkles size={16} className="text-[#6121D0]" /> Ask Sophia AI</Link><Link to="/saved" className="flex items-center gap-3 rounded-xl border border-[#DCE4EF] bg-white px-3 py-3 text-sm font-medium text-[#091F5B] hover:border-[#6121D0]"><BookOpen size={16} className="text-[#2C36D9]" /> View saved resources</Link></div></OverviewCard></div>
  </div>;
}
