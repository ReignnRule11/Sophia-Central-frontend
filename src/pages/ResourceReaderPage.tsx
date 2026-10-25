import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, ExternalLink } from 'lucide-react';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import type { Resource } from '../types';

type ResourceWithFile = Resource & { fileUrl?: string; file_url?: string; url?: string; contentUrl?: string; content_url?: string };

export function ResourceReaderPage() {
  const { id = '' } = useParams();
  const { isAuthenticated } = useAuth();
  const [resource, setResource] = useState<ResourceWithFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await resourcesApi.byId(id);
        if (active) setResource(result as ResourceWithFile);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to open this resource.');
      } finally {
        if (active) setLoading(false);
      }
    };
    if (isAuthenticated && id) void load();
    return () => { active = false; };
  }, [id, isAuthenticated]);

  if (loading) return <LoadingState message="Opening resource..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!resource) return <div className="rounded-2xl border border-slate-800 p-6 text-slate-300">Resource not found. <Link to="/library" className="text-violet-300 underline">Return to library</Link></div>;

  const fileUrl = resource.fileUrl || resource.file_url || resource.contentUrl || resource.content_url || resource.url;
  const status = resource.moderationStatus || (resource.isVerified ? 'approved' : 'pending');

  return <div className="mx-auto max-w-4xl space-y-5">
    <Link to="/library" className="inline-flex items-center gap-2 text-sm text-violet-200 hover:text-white"><ArrowLeft size={16} /> Back to academic & research materials</Link>
    <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
      <div className="border-b border-slate-800 bg-slate-950/60 p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-violet-500/15 px-3 py-1 uppercase tracking-wide text-violet-200">{resource.type.replaceAll('_', ' ')}</span>
          <span className={`rounded-full px-3 py-1 capitalize ${status === 'approved' ? 'bg-emerald-500/10 text-emerald-300' : status === 'rejected' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-200'}`}>{status}</span>
        </div>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{resource.title}</h2>
        <p className="mt-3 text-sm text-slate-400">{[resource.course, resource.topic, resource.level, resource.institution].filter(Boolean).join(' · ')}</p>
      </div>
      <div className="space-y-6 p-6 sm:p-8">
        <section><h3 className="mb-2 flex items-center gap-2 font-semibold text-white"><BookOpen size={17} /> Resource details</h3><p className="whitespace-pre-wrap leading-7 text-slate-300">{resource.description || 'No description was provided for this resource.'}</p></section>
        {resource.tags?.length ? <section><h3 className="mb-2 text-sm font-medium text-slate-300">Topics</h3><div className="flex flex-wrap gap-2">{resource.tags.map(tag => <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{tag}</span>)}</div></section> : null}
        {fileUrl ? <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-5"><a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500"><ExternalLink size={16} /> Open resource file</a><a href={fileUrl} download className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:border-violet-500"><Download size={16} /> Download</a></div> : <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">The resource details are available, but no downloadable file URL was returned by the API.</p>}
      </div>
    </article>
  </div>;
}
