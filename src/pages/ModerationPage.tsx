import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, ShieldCheck, XCircle } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { sophiaApi } from '../api/sophiaApi';
import type { ModerationItem } from '../types';

export function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await sophiaApi.moderation.list();
      setItems(Array.isArray(result) ? result : []);
    } catch {
      setError('Unable to load moderation queue right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const pendingCount = useMemo(() => items.filter((item) => item.status === 'pending').length, [items]);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await sophiaApi.moderation.review(id, status);
      setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    } catch {
      setError('Action could not be completed. Please retry.');
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Trust & quality" title="Moderation queue" />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Pending</div>
          <div className="mt-4 text-3xl font-semibold text-white">{pendingCount}</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Approved</div>
          <div className="mt-4 text-3xl font-semibold text-white">{items.filter((item) => item.status === 'approved').length}</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Flagged</div>
          <div className="mt-4 text-3xl font-semibold text-white">{items.filter((item) => item.status === 'flagged').length}</div>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

      <OverviewCard title="Review submissions" action={loading ? 'Loading...' : 'Live queue'}>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-300"><Clock3 size={16} /> Loading moderation queue...</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-lg font-medium text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.course} • {item.institution}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                    <ShieldCheck size={14} />
                    {item.status}
                  </div>
                </div>

                <p className="mb-4 text-sm text-slate-300">{item.summary}</p>

                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{item.type}</span>
                  <span>Uploaded by {item.uploadedBy}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleReview(item.id, 'approved')} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button onClick={() => handleReview(item.id, 'rejected')} className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </OverviewCard>
    </div>
  );
}
