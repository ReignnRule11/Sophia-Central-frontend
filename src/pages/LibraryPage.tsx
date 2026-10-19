import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Filter, Search, Sparkles } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { sophiaApi } from '../api/sophiaApi';
import { mockResources, resourceTypes } from '../lib/mock-data';
import type { Resource } from '../types';

export function LibraryPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>(mockResources);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const result = await sophiaApi.resources.list();
        if (result && result.length) {
          setResources(result);
        }
      } catch {
        setResources(mockResources);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesType = selectedType === 'all' || resource.type === selectedType;
      const matchesQuery =
        !query ||
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.topic.toLowerCase().includes(query.toLowerCase()) ||
        resource.course.toLowerCase().includes(query.toLowerCase());

      return matchesType && matchesQuery;
    });
  }, [query, resources, selectedType]);

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Library" title="Academic resource hub" />

      <div className="glass-panel p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-300">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, topics, or resource titles"
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
                selectedType === type
                  ? 'bg-violet-500/20 text-violet-100 ring-1 ring-violet-500/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="glass-panel p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-violet-200">
                {resource.type.replace('_', ' ')}
              </span>
              {resource.isVerified ? (
                <span className="text-emerald-300">Verified</span>
              ) : (
                <span className="text-amber-300">Pending</span>
              )}
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
    </div>
  );
}
