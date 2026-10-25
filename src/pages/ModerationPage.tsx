import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock3, ShieldCheck, XCircle } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { sophiaApi } from '../api/sophiaApi';
import type { ModerationItem } from '../types';

export function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadQueue = async () => {
    try { setLoading(true); setError(''); setItems(await sophiaApi.moderation.list()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load moderation queue.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadQueue(); }, []);
  const pending = useMemo(() => items.filter((item) => item.status === 'pending'), [items]);

  const review = async (id: string, status: 'approved' | 'rejected') => {
    try { await sophiaApi.moderation.review(id, status); setItems((current) => current.filter((item) => item.id !== id)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Review failed.'); }
  };

  return <div className="space-y-6"><SectionTitle eyebrow="Trust & safety" title="Moderation queue" />{error && <div className="rounded-xl border border-rose-900/50 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div>}<OverviewCard title={`${pending.length} pending items`} action="Review queue"><div className="space-y-3">{loading ? <div className="p-6 text-sm text-slate-400">Loading moderation queue...</div> : pending.length === 0 ? <div className="p-6 text-sm text-slate-400">No pending items.</div> : pending.map((item) => <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-violet-300" /><h3 className="font-semibold text-white">{item.title}</h3></div><p className="mt-2 text-sm text-slate-400">{item.summary ?? `${item.type ?? 'resource'} • ${item.course ?? 'Unknown course'}`}</p></div><div className="flex gap-2"><button onClick={() => void review(item.id, 'approved')} className="rounded-xl border border-emerald-800 px-3 py-2 text-sm text-emerald-200"><CheckCircle2 size={15} className="mr-1 inline" />Approve</button><button onClick={() => void review(item.id, 'rejected')} className="rounded-xl border border-rose-800 px-3 py-2 text-sm text-rose-200"><XCircle size={15} className="mr-1 inline" />Reject</button><ArrowUpRight size={16} className="mt-2 text-slate-500" /></div></div></div>)}</div></OverviewCard><div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500"><Clock3 size={14} /> Decisions are recorded server-side.</div></div>;
}
