import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { EmptyState } from '../components/states/EmptyState';

export function LibraryPage() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourcesApi.list(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const filteredResources = useMemo(() => {
    if (!data) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data;
    return data.filter((resource) => [resource.title, resource.course, resource.topic, resource.institution, ...(resource.tags ?? [])].filter(Boolean).join(' ').toLowerCase().includes(normalized));
  }, [data, query]);

  if (isLoading) return <LoadingState label="Loading library..." />;
  if (isError) return <ErrorState title="Library unavailable" message={error instanceof Error ? error.message : 'Unable to load resources.'} onRetry={() => void refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Academic library</p><h2 className="text-3xl font-semibold text-white">Verified resources</h2></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources..." className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-400 md:max-w-sm" /></div>
      {filteredResources.length === 0 ? <EmptyState title="No resources found" description="Try a different search term." /> : <div className="grid gap-4 lg:grid-cols-2">{filteredResources.map((resource) => <article key={resource.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-white">{resource.title}</h3><p className="mt-2 text-sm text-slate-300">{resource.description}</p></div><span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase text-violet-200">{resource.type}</span></div><div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">{resource.course && <span>{resource.course}</span>}{resource.topic && <span>• {resource.topic}</span>}{resource.institution && <span>• {resource.institution}</span>}</div></article>)}</div>}
    </div>
  );
}
