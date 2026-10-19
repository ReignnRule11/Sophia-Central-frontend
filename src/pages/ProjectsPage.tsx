import { ArrowUpRight, BriefcaseBusiness, FolderKanban, TrendingUp } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { projects } from '../lib/mock-data';

export function ProjectsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Portfolio" title="Program overview" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-panel p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Initiatives</div>
          <div className="mt-4 text-3xl font-semibold text-white">18</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Milestones</div>
          <div className="mt-4 text-3xl font-semibold text-white">42</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Dependencies</div>
          <div className="mt-4 text-3xl font-semibold text-white">7</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Forecast</div>
          <div className="mt-4 text-3xl font-semibold text-white">92%</div>
        </div>
      </div>

      <OverviewCard title="Active initiatives" action="Updated today">
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium text-white">{project.name}</div>
                  <div className="text-sm text-slate-400">Owner: {project.owner}</div>
                </div>
                <div className="flex items-center gap-2 text-violet-200">
                  <FolderKanban size={16} />
                  <span className="text-sm">{project.status}</span>
                </div>
              </div>

              <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-emerald-300" style={{ width: `${project.progress}%` }} />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{project.progress}% complete</span>
                <span>{project.due}</span>
              </div>
            </div>
          ))}
        </div>
      </OverviewCard>
    </div>
  );
}
