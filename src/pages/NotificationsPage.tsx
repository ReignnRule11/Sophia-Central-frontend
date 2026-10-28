import { Bell, CheckCheck, ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationsApi, type NotificationItem } from '../api/notifications';

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try { const response = await notificationsApi.list(); setItems(response.notifications ?? []); setUnreadCount(response.unreadCount ?? 0); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load notifications.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const markRead = async (item: NotificationItem) => {
    if (item.isRead) return;
    try { await notificationsApi.markRead(item.id); setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, isRead: true } : entry)); setUnreadCount((count) => Math.max(0, count - 1)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to update notification.'); }
  };

  const markAllRead = async () => {
    if (!unreadCount || marking) return;
    setMarking(true); setError('');
    try { await notificationsApi.markAllRead(); setItems((current) => current.map((item) => ({ ...item, isRead: true }))); setUnreadCount(0); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to mark notifications as read.'); }
    finally { setMarking(false); }
  };

  return <div className="mx-auto max-w-4xl space-y-6">
    <section className="rounded-3xl bg-[#2C36D9] p-6 text-white shadow-sm sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Sophia Central</p><h2 className="mt-2 text-3xl font-bold">Notifications</h2><p className="mt-2 text-sm text-white/90">Stay informed about your resources, learning activity, and account.</p></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6121D0] text-white"><Bell size={22} /></div></div></section>
    <div className="flex items-center justify-between gap-3"><p className="text-sm text-[#5C6982]">{unreadCount ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up'}</p><button type="button" onClick={() => void markAllRead()} disabled={!unreadCount || marking} className="inline-flex items-center gap-2 rounded-xl bg-[#6121D0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5120B0] disabled:cursor-not-allowed disabled:opacity-50"><CheckCheck size={16} />{marking ? 'Updating…' : 'Mark all as read'}</button></div>
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}
    {loading ? <div className="flex items-center gap-2 rounded-2xl border border-[#DCE4EF] bg-white p-6 text-sm text-[#5C6982]"><Loader2 className="animate-spin" size={17} /> Loading notifications…</div> : items.length === 0 ? <div className="rounded-2xl border border-[#DCE4EF] bg-white p-8 text-center"><Bell className="mx-auto text-[#2C36D9]" size={28} /><h3 className="mt-3 font-semibold text-[#091F5B]">No notifications yet</h3><p className="mt-1 text-sm text-[#5C6982]">New activity will appear here automatically.</p><Link to="/dashboard" className="mt-5 inline-flex rounded-xl bg-[#6121D0] px-4 py-2.5 text-sm font-semibold text-white">Back to dashboard</Link></div> : <div className="space-y-3">{items.map((item) => <article key={item.id} onClick={() => void markRead(item)} className={`rounded-2xl border bg-white p-5 transition ${item.isRead ? 'border-[#DCE4EF]' : 'border-[#6121D0]/30 shadow-sm'}`}><div className="flex gap-4"><div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.isRead ? 'bg-[#DCE4EF]' : 'bg-[#6121D0]'}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-semibold text-[#091F5B]">{item.title}</h3><time className="text-xs text-[#71809A]">{new Date(item.createdAt).toLocaleString()}</time></div><p className="mt-2 text-sm leading-6 text-[#5C6982]">{item.message}</p>{item.link && <Link to={item.link} onClick={() => void markRead(item)} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2C36D9]">Open <ExternalLink size={14} /></Link>}</div></div></article>)}</div>}
  </div>;
}
