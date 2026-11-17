import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../lib/api/client';
import { useTheme } from '../context/ThemeContext';

type ReviewerDecision = { id: string; fromStatus: string; toStatus: string; note?: string | null; createdAt: string; actor?: { firstName?: string; lastName?: string; email?: string } | null };

type ReviewerApplication = {
  id: string;
  userId: string;
  status: string;
  qualifications: string[];
  expertiseAreas: string[];
  institution?: string | null;
  faculty?: string | null;
  department?: string | null;
  academicLevels: string[];
  reviewExperience: string;
  supportingDocuments?: string[];
  conflictDeclaration: string;
  decisionNote?: string | null;
  createdAt: string;
  user?: { firstName?: string; lastName?: string; email?: string; academicHandle?: string; role?: string };
};

const actions = [
  { status: 'under_review', label: 'Mark under review' },
  { status: 'more_information_required', label: 'Request more information' },
  { status: 'approved', label: 'Approve reviewer access' },
  { status: 'rejected', label: 'Reject application' },
] as const;

export function AdminReviewerApplicationsPage() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [items, setItems] = useState<ReviewerApplication[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('submitted');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [decisionHistory, setDecisionHistory] = useState<Record<string, ReviewerDecision[]>>({});
  const [historyOpen, setHistoryOpen] = useState<Record<string, boolean>>({});
  const [historyLoading, setHistoryLoading] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
      setItems(await apiRequest<ReviewerApplication[]>(`/reviewer-applications${query}`));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load reviewer applications.'); }
    finally { setLoading(false); }
  }, [filter]);
  useEffect(() => { void load(); }, [load]);

  const toggleHistory = async (item: ReviewerApplication) => {
    const nextOpen = !historyOpen[item.id];
    setHistoryOpen(current => ({ ...current, [item.id]: nextOpen }));
    if (!nextOpen || decisionHistory[item.id]) return;
    setHistoryLoading(item.id);
    try {
      const history = await apiRequest<ReviewerDecision[]>(`/reviewer-applications/${encodeURIComponent(item.id)}/decisions`);
      setDecisionHistory(current => ({ ...current, [item.id]: history }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load decision history.');
    } finally { setHistoryLoading(''); }
  };

  const decide = async (item: ReviewerApplication, status: string) => {
    const note = notes[item.id]?.trim() || '';
    if (['rejected', 'revoked'].includes(status) && !note) { setError('Add a reason before rejecting or revoking an application.'); return; }
    setBusy(item.id); setError(''); setNotice('');
    try {
      await apiRequest(`/reviewer-applications/${encodeURIComponent(item.id)}/decision`, {
        method: 'PATCH', body: JSON.stringify({ status, ...(note ? { note } : {}) }),
      });
      setNotice(`Application updated: ${status.replace(/_/g, ' ')}.`);
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to update this application.'); }
    finally { setBusy(''); }
  };

  return <div className="space-y-5">
    <section className="rounded-2xl border border-[#E4DDF8] bg-[#F7F4FF] p-4 sm:p-6 dark:border-[#40365A] dark:bg-[#211A34]"><div className="flex items-center gap-3"><span className="rounded-xl bg-white p-3 text-[#6121D0] dark:bg-slate-800 dark:text-[#C4A7FF]"><ShieldCheck /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6121D0] dark:text-[#C4A7FF]">Governance</p><h2 className="text-xl font-bold text-[#091F5B] dark:text-white dark:text-white">Academic Reviewer Applications</h2></div></div><p className="mt-3 text-sm leading-6 text-[#52627B] dark:text-slate-300">Verify qualifications, subject expertise, academic scope and conflict declarations before granting reviewer capability. Approval does not change the applicant's Student or Lecturer account type.</p></section>
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</p>}
    <div className="flex flex-wrap items-center justify-between gap-3"><label className="text-sm font-semibold text-[#091F5B] dark:text-slate-100">Application status <select value={filter} onChange={e => setFilter(e.target.value)} className="ml-2 rounded-lg border border-[#DCE4EF] bg-white px-3 py-2 text-[#26364F] dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="submitted">Submitted</option><option value="under_review">Under review</option><option value="more_information_required">More information required</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="suspended">Suspended</option><option value="revoked">Revoked</option><option value="">All statuses</option></select></label><button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-[#DCE4EF] px-3 py-2 text-sm font-semibold text-[#091F5B] dark:border-slate-700 dark:text-slate-100 dark:text-slate-100"><RefreshCw size={15}/> Refresh</button></div>
    {loading ? <p className="p-5 text-sm text-[#64748B] dark:text-slate-400">Loading applications…</p> : items.length === 0 ? <p className="rounded-xl border border-[#DCE4EF] p-5 sm:p-6 text-sm text-[#64748B] dark:text-slate-400 dark:border-slate-700 dark:text-slate-400">No applications in this status.</p> : items.map(item => <article key={item.id} className="min-w-0 space-y-4 rounded-2xl border border-[#DCE4EF] bg-white p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-[#091F5B] dark:text-white">{item.user?.firstName || 'Applicant'} {item.user?.lastName || ''}</h3><p className="text-sm text-[#64748B] dark:text-slate-400">{item.user?.email} · @{item.user?.academicHandle || 'handle unavailable'} · {item.user?.role}</p><p className="mt-1 text-xs capitalize text-[#6121D0] dark:text-[#C4A7FF]">{item.status.replace(/_/g, ' ')} · {new Date(item.createdAt).toLocaleString()}</p></div><span className="rounded-full bg-[#F0EBFF] px-3 py-1 text-xs font-semibold text-[#6121D0] dark:bg-[#35264F] dark:text-[#D8C6FF]">{item.expertiseAreas.length} expertise areas</span></div>
      <div className="grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase text-[#64748B] dark:text-slate-400">Qualifications</p><p className="mt-1 text-sm text-[#26364F] dark:text-slate-200">{item.qualifications.join(', ')}</p></div><div><p className="text-xs font-bold uppercase text-[#64748B] dark:text-slate-400">Expertise</p><p className="mt-1 text-sm text-[#26364F] dark:text-slate-200">{item.expertiseAreas.join(', ')}</p></div><div><p className="text-xs font-bold uppercase text-[#64748B] dark:text-slate-400">Academic scope</p><p className="mt-1 text-sm text-[#26364F] dark:text-slate-200">{item.institution || 'Independent / unaffiliated'} · {item.faculty || '—'} · {item.department || '—'}</p><p className="text-sm text-[#26364F] dark:text-slate-200">Levels: {item.academicLevels.join(', ')}</p></div><div><p className="text-xs font-bold uppercase text-[#64748B] dark:text-slate-400">Supporting documents</p>{item.supportingDocuments?.length ? item.supportingDocuments.map(url => <a key={url} href={url} target="_blank" rel="noreferrer noopener" className="block break-all text-sm text-[#004BEC] underline">Open supporting document</a>) : <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">None supplied</p>}</div></div>
      <div><p className="text-xs font-bold uppercase text-[#64748B] dark:text-slate-400">Review experience</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#26364F] dark:text-slate-200">{item.reviewExperience}</p></div>
      <div><p className="text-xs font-bold uppercase text-[#64748B] dark:text-slate-400">Conflict-of-interest declaration</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#26364F] dark:text-slate-200">{item.conflictDeclaration}</p></div>
      <div className="border-t border-[#EEF1F6] pt-3 dark:border-slate-700"><button type="button" onClick={() => void toggleHistory(item)} className="text-sm font-semibold text-[#6121D0] underline underline-offset-4 dark:text-[#C4A7FF]">{historyOpen[item.id] ? 'Hide decision history' : 'View decision history'}</button>
        {historyOpen[item.id] && <div className="mt-3 space-y-3 rounded-xl bg-[#F8FAFE] p-3 dark:bg-slate-950">{historyLoading === item.id ? <p className="text-sm text-[#64748B] dark:text-slate-400">Loading audit history…</p> : (decisionHistory[item.id] ?? []).length === 0 ? <p className="text-sm text-[#64748B] dark:text-slate-400">No administrative decisions recorded yet.</p> : (decisionHistory[item.id] ?? []).map(entry => <div key={entry.id} className="border-b border-[#E8EDF5] pb-3 last:border-0 last:pb-0 dark:border-slate-800"><p className="text-sm font-semibold capitalize text-[#091F5B] dark:text-white">{entry.fromStatus.replace(/_/g, ' ')} → {entry.toStatus.replace(/_/g, ' ')}</p><p className="mt-1 text-xs text-[#64748B] dark:text-slate-400">{entry.actor?.firstName || 'Administrator'} {entry.actor?.lastName || ''} · {new Date(entry.createdAt).toLocaleString()}</p>{entry.note && <p className="mt-1 whitespace-pre-wrap text-sm text-[#26364F] dark:text-slate-200">{entry.note}</p>}</div>)}</div>}
      </div>
      {['submitted', 'under_review', 'more_information_required', 'approved', 'suspended'].includes(item.status) && <div className="space-y-3 border-t border-[#EEF1F6] pt-4 dark:border-slate-700"><label className="block text-sm font-semibold text-[#091F5B] dark:text-slate-100">Decision note<textarea value={notes[item.id] ?? ''} onChange={e => setNotes(v => ({ ...v, [item.id]: e.target.value }))} placeholder="Required for rejection; explain requested information or conditions…" className="mt-2 min-h-20 w-full rounded-xl border border-[#DCE4EF] p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label><div className="flex flex-wrap gap-2">{actions.filter(action => ['submitted', 'under_review', 'more_information_required'].includes(item.status)).map(action => <button key={action.status} type="button" disabled={busy === item.id} onClick={() => void decide(item, action.status)} className={`rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50 ${action.status === 'approved' ? 'border-emerald-300 text-emerald-800 dark:border-emerald-700 dark:text-emerald-300' : action.status === 'rejected' ? 'border-rose-300 text-rose-800 dark:border-rose-800 dark:text-rose-300' : 'border-[#DCE4EF] text-[#091F5B] dark:border-slate-700 dark:text-slate-200'}`}>{busy === item.id ? 'Saving…' : action.label}</button>)}{item.status === 'approved' && <><button type="button" disabled={busy === item.id} onClick={() => void decide(item, 'suspended')} className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-900 disabled:opacity-50">Suspend reviewer access</button><button type="button" disabled={busy === item.id} onClick={() => void decide(item, 'revoked')} className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-800 disabled:opacity-50">Revoke permanently</button></>}{item.status === 'suspended' && <button type="button" disabled={busy === item.id} onClick={() => void decide(item, 'approved')} className="rounded-lg border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50">Restore reviewer access</button>}</div></div>}
    </article>)}
  </div>;
}
