import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Bookmark, BookOpen } from 'lucide-react';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { getSavedResourceIds } from '../lib/savedResources';
import { EmptyState } from '../components/states/EmptyState';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';

export function SavedResourcesPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourcesApi.list(),
    enabled: Boolean(user),
    staleTime: 60_000,
  });

  if (isLoading) return <LoadingState message="Loading saved resources..." />;
  if (isError) return <ErrorState message={error instanceof Error ? error.message : 'Unable to load saved resources.'} onRetry={() => void refetch()} />;

  const ids = new Set(user ? getSavedResourceIds(user.id) : []);
  const saved = (data ?? []).filter((resource) => ids.has(resource.id));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6">
        <div className="flex items-center gap-3"><Bookmark className="text-violet-300" /><div><p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Student library</p><h2 className="mt-1 text-2xl font-semibold text-white">Saved resources</h2></div></div>
        <p className="mt-3 text-sm text-slate-400">Keep important academic and research materials ready for your next study session.</p>
      </div>
      {saved.length === 0 ? <EmptyState title="No saved resources" description="Open a resource and select Save to build your personal study list." /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{saved.map((resource) => <Link key={resource.id} to={`/resource/${encodeURIComponent(resource.id)}`} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-violet-500/50"><div className="flex items-center justify-between"><span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">{resource.type.replace(/_/g, ' ')}</span><BookOpen size={17} className="text-violet-300" /></div><h3 className="mt-4 text-lg font-semibold text-white">{resource.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{resource.description || 'Open this resource to continue studying.'}</p><p className="mt-4 text-xs text-slate-500">{resource.course || 'Academic resource'}{resource.topic ? ` · ${resource.topic}` : ''}</p></Link>)}</div>}
    </div>
  );
}
