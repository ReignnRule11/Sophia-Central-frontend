import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Info, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationsApi, type NotificationItem } from '../api/notifications';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const response = await notificationsApi.list(30);
      setNotifications(response.notifications ?? []);
      setUnreadCount(response.unreadCount ?? 0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load notifications.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const markRead = async (notification: NotificationItem) => {
    if (notification.isRead) return;
    setWorkingId(notification.id);
    try {
      await notificationsApi.markRead(notification.id);
      setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, isRead: true } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to update notification.'); }
    finally { setWorkingId(null); }
  };

  const markAllRead = async () => {
    if (!unreadCount) return;
    setWorkingId('all');
    try {
      await notificationsApi.markAllRead();
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to update notifications.'); }
    finally { setWorkingId(null); }
  };

  return <section className="mx-auto max-w-4xl space-y-6">
    <div className="rounded-3xl bg-[#2C36D9] p-6 text-white shadow-[0_18px_45px_rgba(44,54,217,0.18)] sm:p-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><Bell size={22} /></span><div><p className="text-xs uppercase tracking-[0.2em] text-white/75">Sophia Central</p><h2 className="text-2xl font-semibold">Notifications</h2></div></div><p className="mt-4 max-w-xl text-sm leading-6 text-white/85">Stay up to date with resource activity, account updates, moderation decisions, and learning events.</p></div><button type="button" onClick={() => void markAllRead()} disabled={!unreadCount || workingId === 'all'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6121D0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-[#6121D0] disabled:cursor-not-allowed disabled:opacity-50"><CheckCheck size={16} /> {workingId === 'all' ? 'Updating…' : `Mark all read${unreadCount ? ` (${unreadCount})` : ''}`}</button></div></div>

    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
    {loading ? <div className="flex items-center justify-center rounded-2xl border border-[#DCE4EF] bg-white p-10 text-sm text-[#5C6982]"><Loader2 size={18} className="mr-2 animate-spin" /> Loading notifications…</div> : notifications.length === 0 ? <div className="rounded-2xl border border-[#DCE4EF] bg-white p-10 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F6FC] text-[#2C36D9]"><Info size={20} /></div><h3 className="mt-4 text-lg font-semibold text-[#091F5B]">You are all caught up</h3><p className="mt-2 text-sm text-[#5C6982]">New notifications will appear here when there is activity on your account.</p></div> : <div className="space-y-3">{notifications.map((notification) => <article key={notification.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${notification.isRead ? 'border-[#DCE4EF]' : 'border-[#E1D3F5] bg-[#FCF9FF]'}`}><div className="flex gap-4"><div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notification.isRead ? 'bg-[#F3F6FC] text-[#71809A]' : 'bg-[#F7F1FF] text-[#6121D0]'}`}><Bell size={18} /></div><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-semibold text-[#091F5B]">{notification.title}</h3><p className="mt-1 text-xs text-[#71809A]">{new Date(notification.createdAt).toLocaleString()}</p></div>{!notification.isRead && <span className="rounded-full bg-[#6121D0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">New</span>}</div><p className="mt-3 text-sm leading-6 text-[#5C6982]">{notification.message}</p><div className="mt-4 flex flex-wrap gap-3">{notification.link && <Link to={notification.link} onClick={() => void markRead(notification)} className="text-sm font-semibold text-[#6121D0]">Open →</Link>}{!notification.isRead && <button type="button" onClick={() => void markRead(notification)} disabled={workingId === notification.id} className="text-sm font-semibold text-[#2C36D9]">{workingId === notification.id ? 'Updating…' : 'Mark as read'}</button>}</div></div></div></article>)}</div>}
  </section>;
}
