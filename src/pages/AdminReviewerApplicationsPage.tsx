import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../lib/api/client';

type ReviewerApplication = {
  id: string;
  userId: string;
  status: string;
  qualifications: string[];
  expertiseAreas: string[];
  institution: string;
  faculty: string;
  department: string;
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
  const [items, setItems] = useState<ReviewerApplication[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('submitted');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
      setItems(await apiRequest<ReviewerApplication[]>(`/reviewer-applications${query}`));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load reviewer applications.'); }
    finally { setLoading(false); }
  }, [filter]);
  useEffect(() => { void load(); }, [load]);

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
    <section className="rounded-2xl border border-[#E4DDF8] bg-[#F7F4FF] p-5 sm:p-6"><div className="flex items-center gap-3"><span className="rounded-xl bg-white p-3 text-[#6121D0]"><ShieldCheck /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6121D0]">Governance</p><h2 className="text-xl font-bold text-[#091F5B]">Academic Reviewer Applications</h2></div></div><p className="mt-3 text-sm leading-6 text-[#52627B]">Verify qualifications, subject expertise, academic scope and conflict declarations before granting reviewer capability. Approval does not change the applicant's Student or Lecturer account type.</p></section>
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{notice}</p>}
    <div className="flex flex-wrap items-center justify-between gap-3"><label className="text-sm font-semibold text-[#091F5B]">Application status <select value={filter} onChange={e => setFilter(e.target.value)} className="ml-2 rounded-lg border border-[#DCE4EF] bg-white px-3 py-2"><option value="submitted">Submitted</option><option value="under_review">Under review</option><option value="more_information_required">More information required</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="suspended">Suspended</option><option value="revoked">Revoked</option><option value="">All statuses</option></select></label><button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-[#DCE4EF] px-3 py-2 text-sm font-semibold text-[#091F5B]"><RefreshCw size={15}/> Refresh</button></div>
    {loading ? <p className="p-5 text-sm text-[#64748B]">Loading applications…</p> : items.length === 0 ? <p className="rounded-xl border border-[#DCE4EF] p-6 text-sm text-[#64748B]">No applications in this status.</p> : items.map(item => <article key={item.id} className="space-y-4 rounded-2xl border border-[#DCE4EF] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-[#091F5B]">{item.user?.firstName || 'Applicant'} {item.user?.lastName || ''}</h3><p className="text-sm text-[#64748B]">{item.user?.email} · @{item.user?.academicHandle || 'handle unavailable'} · {item.user?.role}</p><p className="mt-1 text-xs capitalize text-[#6121D0]">{item.status.replace(/_/g, ' ')} · {new Date(item.createdAt).toLocaleString()}</p></div><span className="rounded-full bg-[#F0EBFF] px-3 py-1 text-xs font-semibold text-[#6121D0]">{item.expertiseAreas.length} expertise areas</span></div>
      <div className="grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase text-[#64748B]">Qualifications</p><p className="mt-1 text-sm text-[#26364F]">{item.qualifications.join(', ')}</p></div><div><p className="text-xs font-bold uppercase text-[#64748B]">Expertise</p><p className="mt-1 text-sm text-[#26364F]">{item.expertiseAreas.join(', ')}</p></div><div><p className="text-xs font-bold uppercase text-[#64748B]">Academic scope</p><p className="mt-1 text-sm text-[#26364F]">{item.institution} · {item.faculty} · {item.department}</p><p className="text-sm text-[#26364F]">Levels: {item.academicLevels.join(', ')}</p></div><div><p className="text-xs font-bold uppercase text-[#64748B]">Supporting documents</p>{item.supportingDocuments?.length ? item.supportingDocuments.map(url => <a key={url} href={url} target="_blank" rel="noreferrer noopener" className="block break-all text-sm text-[#004BEC] underline">Open supporting document</a>) : <p className="mt-1 text-sm text-[#64748B]">None supplied</p>}</div></div>
      <div><p className="text-xs font-bold uppercase text-[#64748B]">Review experience</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#26364F]">{item.reviewExperience}</p></div>
      <div><p className="text-xs font-bold uppercase text-[#64748B]">Conflict-of-interest declaration</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#26364F]">{item.conflictDeclaration}</p></div>
      {['submitted', 'under_review', 'more_information_required'].includes(item.status) && <div className="space-y-3 border-t border-[#EEF1F6] pt-4"><label className="block text-sm font-semibold text-[#091F5B]">Decision note<textarea value={notes[item.id] ?? ''} onChange={e => setNotes(v => ({ ...v, [item.id]: e.target.value }))} placeholder="Required for rejection; explain requested information or conditions…" className="mt-2 min-h-20 w-full rounded-xl border border-[#DCE4EF] p-3 text-sm font-normal" /></label><div className="flex flex-wrap gap-2">{actions.map(action => <button key={action.status} type="button" disabled={busy === item.id} onClick={() => void decide(item, action.status)} className={`rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50 ${action.status === 'approved' ? 'border-emerald-300 text-emerald-800' : action.status === 'rejected' ? 'border-rose-300 text-rose-800' : 'border-[#DCE4EF] text-[#091F5B]'}`}>{busy === item.id ? 'Saving…' : action.label}</button>)}</div></div>}
    </article>)}
  </div>;
}
