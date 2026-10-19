import { ArrowUpRight, BriefcaseBusiness, TrendingUp } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { teamMembers } from '../lib/mock-data';

export function TeamPage() {
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="People" title="Team capacity" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="glass-panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-200">
                {member.name
                  .split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <div className="font-medium text-white">{member.name}</div>
                <div className="text-xs text-slate-400">{member.role}</div>
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
              <span>Capacity</span>
              <span>{member.capacity}%</span>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-emerald-300" style={{ width: `${member.capacity}%` }} />
            </div>

            <div className="space-y-1 text-sm text-slate-300">
              <div>Focus: {member.focus}</div>
              <div>{member.availability}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
