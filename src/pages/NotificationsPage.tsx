import { Bell, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotificationsPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
          <Bell size={22} aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-white">Your notifications</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
          Updates about your learning activity will appear here when the notification service is enabled.
        </p>
        <div className="mt-6 flex gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
          <p className="text-sm leading-6 text-slate-300">
            The notification centre page is available, but live notifications and unread counts are not yet connected. No sample alerts are shown as if they were real.
          </p>
        </div>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
