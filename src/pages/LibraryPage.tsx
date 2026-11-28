import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, Search, X, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourcesApi } from '../api/resources';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { ReportContentButton } from '../components/ReportContentButton';

export function LibraryPage() {
  const { user } = useAuth();
  const hasInstitution = Boolean(user?.institutionId);
  const [searchInput, setSearchInput] = useState('');
  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [settledQuery, setSettledQuery] = useState('');
  const [page, setPage] = useState(1);
  const normalizedInput = searchInput.trim();

  useEffect(() => {
    if (!normalizedInput) {
      setSuggestionQuery('');
      setSettledQuery('');
      setPage(1);
      return;
    }
    const suggestionsTimer = window.setTimeout(() => setSuggestionQuery(normalizedInput), 180);
    const resultsTimer = window.setTimeout(() => {
      setSettledQuery(normalizedInput);
      setPage(1);
    }, 550);
    return () => {
      window.clearTimeout(suggestionsTimer);
      window.clearTimeout(resultsTimer);
    };
  }, [normalizedInput]);

  const suggestionsQuery = useQuery({
    queryKey: ['academic-library-institution-suggestions', user?.id, user?.institutionId, suggestionQuery],
    queryFn: () => resourcesApi.institutionSearchList({ q: suggestionQuery, page: 1, limit: 6 }),
    enabled: Boolean(user && hasInstitution && suggestionQuery.length >= 2),
    staleTime: 15_000,
  });
  const resultsQuery = useQuery({
    queryKey: ['academic-library-institution-results', user?.id, user?.institutionId, settledQuery, page],
    queryFn: () => resourcesApi.institutionSearchList({ q: settledQuery, page, limit: 18 }),
    enabled: Boolean(user && hasInstitution && settledQuery.length >= 2 && settledQuery === normalizedInput),
    staleTime: 15_000,
  });

  const suggestions = suggestionsQuery.data?.items ?? [];
  const results = resultsQuery.data?.items ?? [];
  const total = resultsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 18));
  const showResults = settledQuery.length >= 2 && settledQuery === normalizedInput;
  const input = 'w-full min-w-0 rounded-xl border border-[#DCE4EF] bg-white px-4 py-3.5 pr-11 text-sm text-[#091F5B] shadow-sm outline-none transition placeholder:text-[#8995A8] hover:border-[#B8C4D6] focus:border-[#6121D0] focus:ring-2 focus:ring-[#6121D0]/15';

  const selectSuggestion = (title: string) => {
    setSearchInput(title);
    setSuggestionQuery('');
    setSettledQuery(title);
    setPage(1);
  };

  return <main className="library-page mx-auto w-full min-w-0 max-w-7xl space-y-4 px-3 sm:space-y-5 sm:px-4 lg:px-6 2xl:px-8">
    <section className="min-w-0 rounded-2xl bg-[#2C36D9] p-4 text-white shadow-sm sm:p-6 lg:p-8">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/80">Sophis Central · Academic Library</p>
      <h1 className="mt-3 break-words text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">Academic Library</h1>
      <p className="mt-3 max-w-3xl break-words text-sm leading-6 text-[#E5E7EB] sm:text-base">Discover academic materials contributed by students and lecturers across your institution, from every faculty and department.</p>
      <p className="mt-2 max-w-3xl text-xs leading-5 text-white/75 sm:text-sm">Contributions are reviewed by academic reviewers and appear here once approved.</p>
      <Link to="/open-source-library" className="mt-4 inline-flex max-w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#2C36D9]">Explore Open Source Library</Link>
    </section>

    {!hasInstitution ? <div className="rounded-2xl border border-dashed border-[#DCE4EF] p-8 text-center">
      <h2 className="font-semibold text-[#091F5B]">Complete your academic profile</h2>
      <p className="mt-1 text-sm text-[#5C6982]">Add your institution to your profile to search approved resources shared across your institution.</p>
      <Link to="/profile" className="mt-3 inline-flex text-sm font-semibold text-[#6121D0] underline">Update academic profile</Link>
    </div> : <section className="min-w-0 space-y-4 rounded-2xl border border-[#DCE4EF] bg-white p-3 shadow-sm sm:p-5" aria-label="Institution-wide academic resource search">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#6121D0]">Institution-wide discovery</p>
        <h2 className="mt-1 text-lg font-bold text-[#091F5B]">Search approved academic resources</h2>
        <p className="mt-1 text-sm text-[#5C6982]">Start typing to see related resources. Full results appear automatically when you pause.</p>
      </div>
      <div className="relative">
        <label htmlFor="academic-library-search" className="sr-only">Search academic resources across your institution</label>
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#71809A]" />
        <input id="academic-library-search" className={input + ' pl-11'} value={searchInput} onChange={event => setSearchInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && normalizedInput.length >= 2) { event.preventDefault(); setSuggestionQuery(normalizedInput); setSettledQuery(normalizedInput); setPage(1); } }} placeholder="Search titles, topics, courses or contributors…" autoComplete="off" />
        {searchInput && <button type="button" onClick={() => { setSearchInput(''); setSuggestionQuery(''); setSettledQuery(''); setPage(1); }} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#71809A] hover:bg-[#F3F0FF] hover:text-[#6121D0]"><X size={17}/></button>}
        {normalizedInput.length >= 2 && suggestionQuery === normalizedInput && suggestions.length > 0 && !showResults && <div className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-[#DCE4EF] bg-white p-2 shadow-xl">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#71809A]">Related resources</p>
          {suggestions.map(item => <button key={item.id} type="button" onClick={() => selectSuggestion(item.title)} className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#F6F3FF]">
            <BookOpen size={16} className="mt-0.5 shrink-0 text-[#6121D0]"/>
            <span className="min-w-0"><span className="block break-words text-sm font-semibold text-[#091F5B]">{item.title}</span><span className="mt-0.5 block text-xs text-[#71809A]">{[item.course, item.topic, item.department].filter(Boolean).join(' · ') || String(item.type).replace(/_/g, ' ')}</span></span>
          </button>)}
        </div>}
      </div>
      {!normalizedInput ? <p className="rounded-xl bg-[#F8FAFD] p-4 text-sm text-[#5C6982]">Search to discover approved resources from every faculty and department in your institution. Nothing is listed until you search.</p>
        : normalizedInput.length < 2 ? <p className="text-xs text-[#71809A]">Type at least 2 characters to see related resources.</p>
        : !showResults ? <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFD] p-4 text-sm text-[#5C6982]"><LoaderCircle size={16} className="animate-spin text-[#6121D0]"/> Finding related resources…</div>
        : resultsQuery.isLoading ? <LoadingState message="Finding approved institution resources…"/>
        : resultsQuery.isError ? <ErrorState message={resultsQuery.error instanceof Error ? resultsQuery.error.message : 'Unable to search institution resources.'} onRetry={() => void resultsQuery.refetch()}/>
        : <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-[#091F5B]">{total.toLocaleString()} matching approved resources</p><span className="text-xs text-[#71809A]">Across your institution</span></div>
          {results.length ? <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">{results.map(item => <article key={item.id} className="flex min-w-0 flex-col break-words rounded-2xl border border-[#DCE4EF] bg-white p-4 shadow-sm transition hover:border-[#6121D0]/50 hover:shadow-md sm:p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#6121D0]"><FileText size={15}/>{String(item.type).replace(/_/g, ' ')}</div>
            <h3 className="mt-3 break-words text-lg font-bold text-[#091F5B]">{item.title}</h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[#4B5563]">{item.description || 'Open this resource for details.'}</p>
            <p className="mt-3 text-xs text-[#5C6982]">{[item.course, item.topic, item.faculty, item.department, item.level].filter(Boolean).join(' · ')}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE4EF] pt-3">
              <Link to={user ? `/resource/${encodeURIComponent(item.id)}` : `/open-resource/${encodeURIComponent(item.id)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#6121D0]"><BookOpen size={15}/>Open material</Link>
              {(user?.role === 'student' || user?.role === 'lecturer') && <ReportContentButton targetType="resource" targetId={item.id} label="Report" compact/>}
            </div>
          </article>)}</div> : <div className="rounded-2xl border border-dashed border-[#DCE4EF] p-6 text-center"><BookOpen className="mx-auto text-[#6121D0]" size={28}/><h3 className="mt-3 font-semibold text-[#091F5B]">No matching approved resources</h3><p className="mt-1 text-sm text-[#5C6982]">Try another title, course, contributor or topic.</p></div>}
          {results.length > 0 && <div className="flex min-w-0 flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center"><button disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="w-full rounded-xl border border-[#DCE4EF] px-4 py-2 text-sm font-semibold disabled:opacity-40 sm:w-auto">Previous</button><span className="text-center text-sm text-[#5C6982]">Page {page} of {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage(value => value + 1)} className="w-full rounded-xl border border-[#DCE4EF] px-4 py-2 text-sm font-semibold disabled:opacity-40 sm:w-auto">Next</button></div>}
        </div>}
    </section>}
  </main>;
}
