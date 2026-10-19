import { useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Filter, Search, Sparkles } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { sophiaApi } from '../api/sophiaApi';
import { mockResources, resourceTypes } from '../lib/mock-data';
import type { Resource } from '../types';

export function LibraryPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'downloads' | 'recent'>('relevance');
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await sophiaApi.resources.list();
        setResources(Array.isArray(result) ? result : mockResources);
      } catch {
        setResources(mockResources);
        setError('The live API is currently unavailable. Showing the curated fallback library instead.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    const current = resources.filter((resource) => {
      const matchesType = selectedType === 'all' || resource.type === selectedType;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'verified' && resource.isVerified) ||
        (statusFilter === 'pending' && !resource.isVerified);
      const matchesQuery =
        !query ||
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.topic.toLowerCase().includes(query.toLowerCase()) ||
        resource.course.toLowerCase().includes(query.toLowerCase()) ||
        resource.institution.toLowerCase().includes(query.toLowerCase());

      return matchesType && matchesStatus && matchesQuery;
    });

    return [...current].sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'recent') return Number(b.createdAt?.slice(-2) || 0) - Number(a.createdAt?.slice(-2) || 0);
      return b.views - a.views;
    });
  }, [query, resources, selectedType, sortBy, statusFilter]);

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Library" title="Academic resource hub" />

      {error ? <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">{error}</div> : null}

      <div className="glass-panel p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-300">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, topics, institutions, titles"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-2 text-slate-400">
            <Filter size={16} />
            <span className="text-xs uppercase tracking-[0.2em]">Filter</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {resourceTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition ${
                selectedType === type ? 'bg-violet-500/20 text-violet-100 ring-1 ring-violet-500/30' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | 'verified' | 'pending')} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
            <option value="all">All statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'relevance' | 'downloads' | 'recent')} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
            <option value="relevance">Most relevant</option>
            <option value="downloads">Most downloaded</option>
            <option value="recent">Most recent</option>
          </select>
          <button className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-100">
            Save search
          </button>
        </div>
      </div>

      {loading ? (
        <OverviewCard title="Loading library" action="Syncing">
          <div className="text-slate-300">Fetching the latest verified resources…</div>
        </OverviewCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="glass-panel p-4 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-violet-200">
                  {resource.type.replace('_', ' ')}
                </span>
                {resource.isVerified ? <span className="text-emerald-300">Verified</span> : <span className="text-amber-300">Pending</span>}
              </div>

              <div className="mb-2 text-lg font-semibold text-white">{resource.title}</div>
              <p className="mb-4 text-sm text-slate-400">{resource.description}</p>

              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>{resource.course}</span>
                  <span>{resource.level}L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{resource.institution}</span>
                  <span>{resource.topic}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {resource.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>{resource.downloads} downloads</span>
                <a href="#" className="inline-flex items-center gap-1 text-violet-200">
                  Open <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
