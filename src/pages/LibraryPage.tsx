import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Bookmark, FileText, FlaskConical, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { getSavedResourceIds } from '../lib/savedResources';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { EmptyState } from '../components/states/EmptyState';

type MaterialFilter = 'academic' | 'research';

export function LibraryPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [materialFilter, setMaterialFilter] = useState<MaterialFilter>('academic');
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('');
  const [topic, setTopic] = useState('');
  const [researchType, setResearchType] = useState('');
  const [researchDate, setResearchDate] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey: ['resources'], queryFn: () => resourcesApi.list(), enabled: isAuthenticated, staleTime: 60_000 });
  const filteredResources = useMemo(() => {
    if (!data) return [];
    const normalized = query.trim().toLowerCase();
    const canSeePending = user?.role === 'lecturer' || user?.role === 'admin' || user?.role === 'moderator';
    return data.filter((resource) => {
      const isResearch = /research|paper|journal|thesis|dissertation/i.test([resource.type, resource.title, resource.course, resource.topic].filter(Boolean).join(' '));
      if (materialFilter === 'research' && !isResearch) return false;
      if (materialFilter === 'academic' && isResearch) return false;
      const status = String(resource.moderationStatus || (resource.isVerified ? 'approved' : 'pending')).toLowerCase();
      if (!canSeePending && status !== 'approved' && resource.isVerified !== true) return false;
      if (normalized && ![resource.title, resource.description, resource.course, resource.topic, resource.institution, ...(resource.tags ?? [])].filter(Boolean).join(' ').toLowerCase().includes(normalized)) return false;
      if (materialFilter === 'academic') {
        if (course && !String(resource.course ?? '').toLowerCase().includes(course.trim().toLowerCase())) return false;
        if (topic && !String(resource.topic ?? '').toLowerCase().includes(topic.trim().toLowerCase())) return false;
      } else {
        if (topic && !String(resource.topic ?? '').toLowerCase().includes(topic.trim().toLowerCase())) return false;
        if (researchType && !String(resource.type ?? '').toLowerCase().includes(researchType.trim().toLowerCase())) return false;
        if (researchDate && resource.createdAt && new Date(resource.createdAt).toISOString().slice(0, 10) !== researchDate) return false;
      }
      return true;
    });
  }, [data, materialFilter, query, course, topic, researchType, researchDate, user]);

  if (isLoading) return <LoadingState message="Loading academic and research materials..." />;
  if (isError) return <ErrorState message={error instanceof Error ? error.message : 'Unable to load resources.'} onRetry={() => void refetch()} />;

  const savedCount = user ? getSavedResourceIds(user.id).length : 0;
  return <div className="space-y-6">
    <section className="rounded-3xl border border-[#DCE4EF] bg-[#2C36D9] p-5 text-white shadow-[0_18px_45px_rgba(44,54,217,0.18)] sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-white/80">Sophia Central · {user?.institution || 'Your institution'}</p><h2 className="mt-2 text-2xl font-semibold">{materialFilter === 'academic' ? 'Academic library' : 'Research library'}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">Search verified study materials and research resources by course, topic, keyword, type, or date.</p></div>{user?.role === 'student' && <Link to="/saved" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6121D0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-[#6121D0]"><Bookmark size={16} /> Saved resources ({savedCount})</Link>}</div>
      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/30 bg-white px-4 py-3 text-[#091F5B] focus-within:border-white"><Search size={18} className="shrink-0 text-[#2C36D9]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, course, topic or keyword..." aria-label="Search resources" className="w-full bg-transparent text-sm outline-none placeholder:text-[#71809A]" /></label>
    </section>

    <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setMaterialFilter('academic')} aria-pressed={materialFilter === 'academic'} className={`rounded-full border px-4 py-2 text-sm font-semibold ${materialFilter === 'academic' ? 'border-[#6121D0] bg-[#6121D0] text-white' : 'border-[#D7DEEA] bg-white text-[#091F5B]'}`}>Academic materials</button><button type="button" onClick={() => setMaterialFilter('research')} aria-pressed={materialFilter === 'research'} className={`rounded-full border px-4 py-2 text-sm font-semibold ${materialFilter === 'research' ? 'border-[#6121D0] bg-[#6121D0] text-white' : 'border-[#D7DEEA] bg-white text-[#091F5B]'}`}>Research materials</button><span className="ml-auto text-xs text-[#71809A]">{filteredResources.length} result{filteredResources.length === 1 ? '' : 's'}</span></div>

    <div className="grid gap-3 rounded-2xl border border-[#DCE4EF] bg-white p-4 shadow-sm md:grid-cols-3">{materialFilter === 'academic' ? <><input value={course} onChange={(event) => setCourse(event.target.value)} placeholder="Filter course" className="brand-input" /><input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Filter topic" className="brand-input" /><div className="flex items-center text-xs text-[#71809A]">Filters update results instantly.</div></> : <><input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Filter research topic" className="brand-input" /><select value={researchType} onChange={(event) => setResearchType(event.target.value)} className="brand-input"><option value="">All research types</option><option value="research_paper">Research paper</option><option value="thesis">Thesis</option><option value="dissertation">Dissertation</option><option value="journal">Journal</option></select><input type="date" value={researchDate} onChange={(event) => setResearchDate(event.target.value)} aria-label="Filter research by date" className="brand-input" /></>}</div>

    {filteredResources.length === 0 ? <EmptyState title="No resources found" description="Try a different keyword, filter, or category." /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredResources.map((resource) => { const research = /research|paper|journal|thesis|dissertation/i.test([resource.type, resource.title].join(' ')); return <button type="button" key={resource.id} onClick={() => navigate(`/resource/${encodeURIComponent(resource.id)}`)} className="group rounded-2xl border border-[#DCE4EF] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#6121D0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6121D0]"><div className="mb-4 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-[#F3F6FC] px-3 py-1 text-xs font-semibold text-[#2C36D9]">{research ? <FlaskConical size={14} /> : <FileText size={14} />}{research ? 'Research' : 'Academic'}</span><BookOpen size={17} className="text-[#71809A] group-hover:text-[#6121D0]" /></div><h3 className="text-lg font-semibold text-[#091F5B]">{resource.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5C6982]">{resource.description || 'Open this resource to view its details.'}</p><div className="mt-4 flex flex-wrap gap-2 text-xs text-[#71809A]">{resource.course && <span>{resource.course}</span>}{resource.topic && <span>· {resource.topic}</span>}{resource.institution && <span>· {resource.institution}</span>}</div><div className="mt-5 flex items-center gap-2 border-t border-[#E8ECF3] pt-3 text-sm font-semibold text-[#6121D0]"><BookOpen size={15} /> Open resource <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span></div></button>; })}</div>}
  </div>;
}
