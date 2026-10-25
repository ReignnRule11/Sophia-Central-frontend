import { ArrowUpRight, BarChart3, Briefcase, CheckCircle2, Users } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';

export function AdminAnalyticsPage() {
  const metrics = [
    { label: 'Active learners', value: '48.2k', change: '+12.4%' },
    { label: 'Verified uploads', value: '4.7k', change: '+8.1%' },
    { label: 'AI tutor usage', value: '4.8k', change: '+22.3%' },
    { label: 'Moderation SLA', value: '1.7h', change: '-15m' },
  ];

  const channels = [
    { name: 'University of Lagos', value: 84 },
    { name: 'Univ. of Ibadan', value: 72 },
    { name: 'Babcock', value: 64 },
    { name: 'Others', value: 48 },
  ];

  const tableRows = [
    { institution: 'University of Lagos', resources: 4821, uploads: 264, retention: '81%' },
    { institution: 'University of Ibadan', resources: 4017, uploads: 211, retention: '78%' },
    { institution: 'Babcock University', resources: 2779, uploads: 174, retention: '74%' },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Operations" title="Admin analytics" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-panel p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{metric.label}</div>
            <div className="mt-4 text-3xl font-semibold text-white">{metric.value}</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-emerald-300"><ArrowUpRight size={14} /> {metric.change}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <OverviewCard title="Resource distribution" action="By institution">
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{channel.name}</span>
                  <span className="text-slate-400">{channel.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400" style={{ width: `${channel.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </OverviewCard>

        <OverviewCard title="Operational health" action="Live">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-2 text-violet-200"><BarChart3 size={16} /> Platform health</div>
              <div className="mt-3 text-2xl font-semibold text-white">96.8%</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-2 text-sky-200"><Users size={16} /> Community engagement</div>
              <div className="mt-3 text-2xl font-semibold text-white">84%</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-2 text-emerald-200"><CheckCircle2 size={16} /> Moderation completion</div>
              <div className="mt-3 text-2xl font-semibold text-white">91%</div>
            </div>
          </div>
        </OverviewCard>
      </div>

      <OverviewCard title="Institution performance" action="Last 30 days">
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Institution</th>
                <th className="px-4 py-3 font-medium">Resources</th>
                <th className="px-4 py-3 font-medium">Uploads</th>
                <th className="px-4 py-3 font-medium">Retention</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.institution} className="border-t border-slate-800 bg-slate-950/50">
                  <td className="px-4 py-3 text-slate-200">{row.institution}</td>
                  <td className="px-4 py-3 text-slate-300">{row.resources.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-300">{row.uploads}</td>
                  <td className="px-4 py-3 text-emerald-300">{row.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OverviewCard>
    </div>
  );
}
