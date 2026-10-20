import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { EmptyState } from '../components/states/EmptyState';

export function LibraryPage() {
  const { token } = useAuth();
  const [query, setQuery] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['resources', token],
    queryFn: () => resourcesApi.list(token),
    enabled: !!token,
    staleTime: 60_000,
  });

  const filteredResources = useMemo(() => {
    if (!data) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data;

    return data.filter((resource) =>
      [
        resource.title,
        resource.course,
        resource.topic,
        resource.institution,
        resource.author ?? '',
        resource.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [data, query]);

  if (isLoading) {
    return <LoadingState message="Loading academic library..." />;
  }

  if (isError) {
    return <ErrorState message={error instanceof Error ? error.message : 'Failed to load resources.'} onRetry={() => refetch()} />;
  }

  if (!filteredResources.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resources"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
        </div>

        <EmptyState
          title="No resources found"
          description="There are no matching resources yet. Upload one or adjust your filters."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search resources"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.map((resource) => (
          <article key={resource.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-200">
                {resource.type}
              </span>
              <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${resource.isVerified ? 'bg-emerald-500/10 text-emerald-200' : 'bg-amber-500/10 text-amber-200'}`}>
                {resource.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">{resource.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{resource.description}</p>

            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Course</span>
                <span>{resource.course}</span>
              </div>
              <div className="flex justify-between">
                <span>Topic</span>
                <span>{resource.topic}</span>
              </div>
              <div className="flex justify-between">
                <span>Institution</span>
                <span>{resource.institution}</span>
              </div>
              <div className="flex justify-between">
                <span>Downloads</span>
                <span>{resource.downloads}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
