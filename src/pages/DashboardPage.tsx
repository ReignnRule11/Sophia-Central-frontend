import { ArrowUpRight, CircleDashed, Clock3, FolderKanban, TrendingUp } from 'lucide-react';
import { OverviewCard, MetricPill, SectionTitle, UserBadge } from '../components/layout/AppShell';
import { activities, metrics, pipeline, projects, teamMembers } from '../lib/mock-data';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-violet-500/20 bg-violet-500/5 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-violet-200">Executive overview</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Sophia is tracking ahead of plan</h2>
        </div>
        <div className="flex items-center gap-3">
          <UserBadge />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-panel p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</span>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                  metric.status === 'positive' ? 'bg-emerald-500/10 text-emerald-200' : metric.status === 'warning' ? 'bg-amber-500/10 text-amber-200' : 'bg-slate-700 text-slate-200'
                }`}
              >
                {metric.delta}
              </span>
            </div>
            <div className="mt-5 text-3xl font-semibold text-white">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <OverviewCard title="Delivery momentum" action="7d trend">
          <div className="grid gap-4 sm:grid-cols-7">
            {pipeline.map((value, index) => (
              <div key={index} className="flex h-44 flex-col justify-end gap-3">
                <div className="flex items-end justify-center">
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-violet-500 via-violet-400 to-violet-300"
                    style={{ height: `${value}%` }}
                  />
                </div>
                <div className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                </div>
              </div>
            ))}
          </div>
        </OverviewCard>

        <OverviewCard title="System health" action="live">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Core services</span>
                <span className="text-emerald-300">98.7%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[98.7%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Queue capacity</span>
                <span className="text-amber-300">74%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-amber-400 to-amber-300" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Ops completion</span>
                <span className="text-violet-300">84%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-violet-400 to-violet-300" />
              </div>
            </div>
          </div>
        </OverviewCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <OverviewCard title="Project pipeline" action="8 active">
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-medium text-white">{project.name}</div>
                    <div className="text-sm text-slate-400">{project.owner}</div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${project.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-200' : project.risk === 'Medium' ? 'bg-amber-500/10 text-amber-200' : 'bg-rose-500/10 text-rose-200'}`}>
                    {project.risk} risk
                  </span>
                </div>

                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                  <span>{project.status}</span>
                  <span>{project.due}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-violet-300 to-emerald-300" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </OverviewCard>

        <OverviewCard title="Recent activity" action="Live feed">
          <div className="space-y-4">
            {activities.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-xl ${item.tone === 'positive' ? 'bg-emerald-500/10 text-emerald-300' : item.tone === 'warning' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-200'}`}>
                  <CircleDashed size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-400">{item.detail}</div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    <Clock3 size={12} />
                    {item.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </OverviewCard>
      </div>
    </div>
  );
}
