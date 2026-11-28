import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound, Settings, RefreshCw, Eye, EyeOff, BrainCircuit, Flame, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { OverviewCard, UserBadge } from '../components/layout/AppShell';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import type { Resource } from '../types';
import { apiRequest } from '../lib/api/client';

export function DashboardPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const resourceCarouselRef = useRef<HTMLDivElement>(null);
  const [resourceTotal, setResourceTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [studyStreak, setStudyStreak] = useState<number | null>(null);
  const [wisdomBalance, setWisdomBalance] = useState<number | null>(null);
  const [showWisdomBalance, setShowWisdomBalance] = useState(false);
  const [institutionIdCopied, setInstitutionIdCopied] = useState(false);
  const firstName = user?.firstName?.trim() || user?.name?.trim().split(/\s+/)[0] || 'there';

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    const loadEngagement = async () => {
      const [streakResult, balanceResult] = await Promise.all([
        apiRequest<{ currentStreak?: number }>('/analytics/study-event', { method: 'POST', body: JSON.stringify({}) }).catch(() => null),
        apiRequest<number>('/points/my-wallet/balance').catch(() => null),
      ]);
      if (!active) return;
      if (streakResult) setStudyStreak(Number(streakResult.currentStreak ?? 0));
      if (balanceResult !== null) setWisdomBalance(typeof balanceResult === 'number' ? balanceResult : Number(balanceResult));
    };
    void loadEngagement();
    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    let active = true;
    const fetchResources = async (background = false) => {
      try {
        if (background) setRefreshing(true);
        else setLoading(true);
        setError('');
        const data = await resourcesApi.publicList({ page: 1, limit: 12 });
        if (active) { setResources(data.items); setResourceTotal(data.total); }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Unable to refresh approved resources.');
      } finally {
        if (active) { setLoading(false); setRefreshing(false); }
      }
    };
    void fetchResources(refreshVersion > 0);
    const interval = window.setInterval(() => { void fetchResources(true); }, 15_000);
    const onFocus = () => { void fetchResources(true); };
    window.addEventListener('focus', onFocus);
    return () => { active = false; window.clearInterval(interval); window.removeEventListener('focus', onFocus); };
  }, [refreshVersion]);


  return <div className="space-y-6">
    <section className="rounded-2xl bg-[#2C36D9] p-5 text-white shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Study dashboard</p><h2 data-hero-middle-heading className="mt-2 text-3xl font-bold !text-white">Your academic momentum is building.</h2><p className="mt-2 text-sm text-white/90">Welcome back, {firstName}.</p>{user?.uniqueId && <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/90"><span>Institution ID:</span><span className="font-semibold tracking-wide">{user.uniqueId}</span><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(user.uniqueId!); setInstitutionIdCopied(true); window.setTimeout(() => setInstitutionIdCopied(false), 1800); } catch { setError('Unable to copy Institution ID. Please copy it manually.'); } }} className="inline-flex items-center gap-1 rounded-lg border border-white/30 px-2 py-1 font-semibold text-white transition hover:bg-white/10 active:scale-95" aria-label="Copy Institution ID"><Copy size={12}/> Copy</button>{institutionIdCopied && <span role="status" aria-live="polite" className="inline-flex items-center gap-1 font-semibold text-white"><Check size={12}/> Copied</span>}</div>}{!user?.uniqueId && <p className="mt-2 text-xs text-white/80">Institution ID pending catalogue verification</p>}</div>
        <UserBadge />
      </div>
    </section>


    {error && <div role="status" className="rounded-2xl border border-[#E6B800]/30 bg-[#FFF8D9] px-4 py-3 text-sm text-[#6B5200]">{error}<button type="button" onClick={() => setRefreshVersion((value) => value + 1)} className="ml-2 font-semibold underline">Retry</button></div>}

    <section aria-label="Student account" className="grid gap-4 sm:grid-cols-2">
      <Link to="/profile" className="group flex items-start gap-4 rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm transition hover:border-[#6121D0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6121D0]">
        <span className="rounded-xl bg-[#6121D0]/10 p-3 text-[#6121D0]"><UserRound size={22} /></span>
        <span className="min-w-0"><span className="block font-semibold text-[#091F5B]">My profile</span><span className="mt-1 block text-sm text-[#5C6982]">View and update your institution, faculty, department, program, and study level.</span><span className="mt-3 inline-block text-sm font-semibold text-[#6121D0]">Edit profile →</span></span>
      </Link>
      <Link to="/settings" className="group flex items-start gap-4 rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm transition hover:border-[#2C36D9] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2C36D9]">
        <span className="rounded-xl bg-[#2C36D9]/10 p-3 text-[#2C36D9]"><Settings size={22} /></span>
        <span className="min-w-0"><span className="block font-semibold text-[#091F5B]">Account settings</span><span className="mt-1 block text-sm text-[#5C6982]">Manage the academic details and bio connected to your account.</span><span className="mt-3 inline-block text-sm font-semibold text-[#2C36D9]">Open settings →</span></span>
      </Link>
    </section>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Link to="/library" className="rounded-2xl border border-[#DCE4EF] bg-white p-4 shadow-sm transition hover:border-[#6121D0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6121D0]"><div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71809A]">Resources</div><div className="mt-4 text-3xl font-semibold tracking-tight text-[#091F5B]">{resourceTotal.toLocaleString()}</div><div className="mt-1 text-sm text-[#5C6982]">Approved for your department</div><span className="mt-3 inline-block text-sm font-semibold text-[#6121D0]">Search institution library →</span></Link>
      <div className="rounded-2xl border border-[#DCE4EF] bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71809A]"><Flame size={15} className="text-[#6121D0]"/> Study streak</div><div className="mt-4 text-3xl font-semibold tracking-tight text-[#091F5B]">{studyStreak === null ? '—' : studyStreak}</div><div className="mt-1 text-sm text-[#5C6982]">{studyStreak === 1 ? 'day in a row' : 'consecutive study days'}</div></div>
      <Link to="/ai" className="rounded-2xl border border-[#DCE4EF] bg-white p-4 shadow-sm transition hover:border-[#2C36D9] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2C36D9]"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71809A]"><BrainCircuit size={15} className="text-[#2C36D9]"/> AI tutor</div><div className="mt-4 text-3xl font-semibold tracking-tight text-[#091F5B]">Ready</div><div className="mt-1 text-sm text-[#5C6982]">Open your AI study assistant</div><span className="mt-3 inline-block text-sm font-semibold text-[#2C36D9]">Open AI Tutor →</span></Link>
      <div className="rounded-2xl border border-[#DCE4EF] bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-2"><div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71809A]">Wisdom points</div><button type="button" onClick={() => setShowWisdomBalance(value => !value)} aria-label={showWisdomBalance ? 'Hide Wisdom Points balance' : 'Show Wisdom Points balance'} title={showWisdomBalance ? 'Hide balance' : 'Show balance'} className="rounded-lg p-1.5 text-[#6121D0] hover:bg-[#F3F0FF]">{showWisdomBalance ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div><div className="mt-4 text-3xl font-semibold tracking-tight text-[#091F5B]">{showWisdomBalance ? (wisdomBalance === null ? '—' : wisdomBalance.toLocaleString()) : '••••••'}</div><div className="mt-1 text-sm text-[#5C6982]">Private account balance</div></div>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <OverviewCard title="Your learning path" action="Personalized"><div className="rounded-2xl border border-[#DCE4EF] bg-[#F8FAFD] p-4"><p className="font-semibold text-[#091F5B]">{user?.program || user?.department || 'Your program'}</p><p className="mt-1 text-sm text-[#5C6982]">{[user?.institution, user?.faculty, user?.department].filter(Boolean).join(' · ') || 'Complete your academic profile to personalize your learning path.'}</p></div></OverviewCard>

    </div>

    <section aria-label="Approved resources for my department" className="rounded-2xl border border-[#DCE4EF] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6121D0]">Your department library</p><h2 className="mt-1 text-xl font-bold text-[#091F5B]">Approved Resources for My Department</h2><p className="mt-1 text-sm text-[#5C6982]">{[user?.faculty, user?.department].filter(Boolean).join(' · ') || 'Your approved department resources'}</p></div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-xs font-semibold text-[#166534]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#16A34A]" /> Live · refreshes every 15 seconds</span>
          <button type="button" onClick={() => setRefreshVersion(value => value + 1)} disabled={refreshing} aria-label="Refresh approved department resources" title="Refresh resources" className="rounded-lg border border-[#DCE4EF] p-2 text-[#6121D0] hover:bg-[#F3F0FF] disabled:opacity-50"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''}/></button>
          <button type="button" onClick={() => resourceCarouselRef.current?.scrollBy({ left: -280, behavior: 'smooth' })} aria-label="Show previous department resources" className="rounded-lg border border-[#DCE4EF] p-2 text-[#6121D0] transition hover:border-[#6121D0] hover:bg-[#F3F0FF]"><ChevronLeft size={18}/></button>
          <button type="button" onClick={() => resourceCarouselRef.current?.scrollBy({ left: 280, behavior: 'smooth' })} aria-label="Show next department resources" className="rounded-lg border border-[#DCE4EF] p-2 text-[#6121D0] transition hover:border-[#6121D0] hover:bg-[#F3F0FF]"><ChevronRight size={18}/></button>
        </div>
      </div>
      {loading ? <p className="rounded-xl bg-[#F8FAFD] p-5 text-sm text-[#5C6982]">Loading approved resources for your department…</p>
        : !user?.institutionId || !user?.faculty?.trim() || !user?.department?.trim() ? <div className="rounded-xl border border-dashed border-[#DCE4EF] bg-[#F8FAFD] p-5 text-sm text-[#4B5563]">Complete your institution, faculty and department details to see approved resources for your department. <Link to="/profile" className="font-semibold text-[#6121D0] underline">Update academic profile</Link>.</div>
        : resources.length === 0 ? <div className="rounded-xl border border-dashed border-[#DCE4EF] bg-[#F8FAFD] p-5"><p className="font-semibold text-[#091F5B]">No approved resources for your department yet.</p><p className="mt-1 text-sm text-[#5C6982]">Newly approved department resources will appear here automatically.</p></div>
        : <><div ref={resourceCarouselRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:thin]">
          {resources.map((resource, index) => {
            const covers = [
              'from-[#24245B] via-[#3F3C91] to-[#7C5CE7]',
              'from-[#123C4A] via-[#176B70] to-[#51A6A0]',
              'from-[#63351D] via-[#A65B2D] to-[#D79B55]',
              'from-[#26334D] via-[#435C7E] to-[#8CA7C7]',
            ];
            return <Link key={resource.id} to={`/resource/${encodeURIComponent(resource.id)}`} aria-label={`Open ${resource.title}`} className="group w-[190px] shrink-0 snap-start sm:w-[220px]">
              <div className={`relative flex h-[250px] flex-col overflow-hidden rounded-r-xl rounded-l-md border border-black/10 bg-gradient-to-br ${covers[index % covers.length]} p-4 text-white shadow-[5px_7px_14px_rgba(15,23,42,0.18)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[8px_12px_20px_rgba(15,23,42,0.24)] sm:h-[285px] sm:p-5`}>
                <span className="absolute inset-y-0 left-0 w-2 bg-black/20 shadow-[2px_0_5px_rgba(0,0,0,0.18)]"/>
                <span className="absolute inset-3 rounded-r-lg rounded-l-sm border border-white/20"/>
                <div className="relative flex items-center justify-between gap-2 pl-2"><span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white/95">{String(resource.type).replace(/_/g, ' ')}</span><span className="text-[9px] font-semibold uppercase tracking-wider text-white/75">Approved</span></div>
                <div className="relative mt-auto pl-2">
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[.2em] text-white/70">Academic resource</p>
                  <h3 className="line-clamp-4 break-words text-lg font-bold leading-tight sm:text-xl">{resource.title}</h3>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/80">{[resource.course, resource.topic].filter(Boolean).join(' · ') || 'Department learning material'}</p>
                  <div className="mt-4 border-t border-white/20 pt-2 text-[8px] font-semibold uppercase tracking-[.18em] text-white/65">Sophis Central · Department Library</div>
                </div>
              </div>
            </Link>;
          })}
        </div><div className="flex items-center justify-between gap-3 text-xs text-[#71809A]"><span>Swipe or use the arrows to explore resources.</span><span>{resourceTotal.toLocaleString()} approved resources</span></div></>}
    </section>
  </div>;
}
