import { useEffect, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { AppShell, OverviewCard, SectionTitle, UserBadge } from '../components/layout/AppShell';
import { mockResources, resourceTypes } from '../lib/mock-data';
import { sophiaApi } from '../api/sophiaApi';
import type { Resource } from '../types';

export function DashboardPage() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await sophiaApi.resources.list();
        setResources(Array.isArray(data) ? data : mockResources);
      } catch {
        setError('Could not reach the backend. Showing fallback data instead.');
        setResources(mockResources);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">Study dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Your academic momentum is building.</h2>
          </div>
          <UserBadge />
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Resources', value: '12.4k', helper: 'verified items' },
          { label: 'Study streak', value: '14 days', helper: 'best in your cohort' },
          { label: 'AI tutor', value: '4.8k', helper: 'questions answered' },
          { label: 'Wisdom points', value: '1,420', helper: 'ready to redeem' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
            <div className="mt-4 text-3xl font-semibold text-white">{stat.value}</div>
            <div className="mt-1 text-sm text-slate-400">{stat.helper}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OverviewCard title="Your learning path" action="Week 2">
          <div className="space-y-4">
            {['Computer Engineering', 'Software Engineering', 'Artificial Intelligence', 'Research Methodology'].map((course, idx) => (
              <div key={course} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{course}</div>
                    <div className="text-sm text-slate-400">CPE {idx + 2}1 • {idx + 2}00L</div>
                  </div>
                  <div className="text-violet-200">{72 + idx * 6}%</div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-emerald-300" style={{ width: `${72 + idx * 6}%` }} />
                </div>
              </div>
            ))}
          </div>
        </OverviewCard>

        <OverviewCard title="Quick access" action="Popular">
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-slate-200"><Search size={16} className="text-violet-300" /> Search notes by topic</div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-slate-200"><ShieldCheck size={16} className="text-emerald-300" /> Verified resources only</div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-slate-200"><Search size={16} className="text-sky-300" /> AI tutor for flash reviews</div>
          </div>
        </OverviewCard>
      </div>

      <OverviewCard title="Latest resources" action={loading ? 'Syncing...' : 'Live'}>
        {loading ? <div className="text-slate-300">Loading your feed…</div> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resources.slice(0, 6).map((resource) => (
              <div key={resource.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-violet-200">{resource.type.replace('_', ' ')}</span>
                  {resource.isVerified ? <span className="text-emerald-300">Verified</span> : <span className="text-amber-300">Pending</span>}
                </div>
                <div className="text-lg font-medium text-white">{resource.title}</div>
                <div className="mt-2 text-sm text-slate-400">{resource.course} • {resource.topic}</div>
              </div>
            ))}
          </div>
        )}
      </OverviewCard>
    </div>
  );
}
