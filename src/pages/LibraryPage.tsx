import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, FlaskConical, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { EmptyState } from '../components/states/EmptyState';

type MaterialFilter = 'all' | 'academic' | 'research';

export function LibraryPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [materialFilter, setMaterialFilter] = useState<MaterialFilter>('all');
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourcesApi.list(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const filteredResources = useMemo(() => {
    if (!data) return [];
    const normalized = query.trim().toLowerCase();
    return data.filter((resource) => {
      const isResearch = /research|paper|journal|thesis|dissertation/i.test([resource.type, resource.title, resource.course, resource.topic].filter(Boolean).join(' '));
      const matchesType = materialFilter === 'all' || (materialFilter === 'research' ? isResearch : !isResearch);
      const matchesSearch = !normalized || [resource.title, resource.description, resource.course, resource.topic, resource.institution, ...(resource.tags ?? [])].filter(Boolean).join(' ').toLowerCase().includes(normalized);
      const status = String(resource.moderationStatus || (resource.isVerified ? 'approved' : 'pending')).toLowerCase();
      const canSeePending = user?.role === 'lecturer' || user?.role === 'admin' || user?.role === 'moderator';
      return matchesType && matchesSearch && (canSeePending || status === 'approved' || resource.isVerified === true);
    });
  }, [data, query, materialFilter, user?.role]);

  if (isLoading) return <LoadingState message="Loading academic and research materials..." />;
  if (isError) return <ErrorState message={error instanceof Error ? error.message : 'Unable to load resources.'} onRetry={() => void refetch()} />;

  return <div className="space-y-6">
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-950/50 to-slate-900 p-5 sm:p-7">
      <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Sophia Central · {user?.institution || 'Your institution'}</p>
      <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Academic & research materials</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Search course notes, past questions, lecture slides and research materials. Select a resource to open its reader.</p>
      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 focus-within:border-violet-400">
        <Search size={18} className="shrink-0 text-violet-300" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, course, topic or keyword..." aria-label="Search academic resources" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
      </label>
    </div>
    <div className="flex flex-wrap items-center gap-2" aria-label="Material category filters">
      {([{value:'all',label:'All materials'},{value:'academic',label:'Academic materials'},{value:'research',label:'Research materials'}] as const).map((filter) => (
        <button key={filter.value} type="button" onClick={() => setMaterialFilter(filter.value)} aria-pressed={materialFilter === filter.value}
          className={`rounded-full border px-4 py-2 text-sm transition ${materialFilter === filter.value ? 'border-violet-400 bg-violet-500/15 text-violet-100' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}>{filter.label}</button>
      ))}
      <span className="ml-auto text-xs text-slate-500">{filteredResources.length} resource{filteredResources.length === 1 ? '' : 's'}</span>
    </div>
    {filteredResources.length === 0 ? <EmptyState title="No resources found" description={query ? 'Try a different keyword or category.' : 'Approved resources will appear here once they are available.'} /> :
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.map((resource) => {
          const research = /research|paper|journal|thesis|dissertation/i.test([resource.type, resource.title].join(' '));
          return <button type="button" key={resource.id} onClick={() => navigate(`/resource/${encodeURIComponent(resource.id)}`)} className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-500/60 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400">
            <div className="mb-4 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">{research ? <FlaskConical size={14} /> : <FileText size={14} />}{research ? 'Research' : 'Academic'}</span><BookOpen size={17} className="text-slate-500 group-hover:text-violet-200" /></div>
            <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{resource.description || 'Open this resource to view its details.'}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">{resource.course && <span>{resource.course}</span>}{resource.topic && <span>· {resource.topic}</span>}{resource.institution && <span>· {resource.institution}</span>}</div>
            <div className="mt-5 flex items-center gap-2 border-t border-slate-800 pt-3 text-sm font-medium text-violet-200"><BookOpen size={15} /> Open resource <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span></div>
          </button>;
        })}
      </div>}
  </div>;
}
