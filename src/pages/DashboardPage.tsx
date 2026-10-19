import { ArrowUpRight, CheckCircle2, Clock3, FileText, Sparkles, TrendingUp } from 'lucide-react';
import { OverviewCard, SectionTitle, UserBadge } from '../components/layout/AppShell';
import { featuredCourses, insightCards, libraryStats, mockResources, studyGoals } from '../lib/mock-data';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">Study dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Your academic momentum is building.</h2>
          </div>
          <UserBadge />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {libraryStats.map((stat) => (
          <div key={stat.label} className="glass-panel p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
              <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] text-violet-200">{stat.trend === 'up' ? '▲' : stat.trend === 'down' ? '▼' : '•'}</span>
            </div>
            <div className="mt-4 text-3xl font-semibold text-white">{stat.value}</div>
            <div className="mt-2 text-sm text-slate-400">{stat.helper}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OverviewCard title="Your learning path" action="Week 2">
          <div className="space-y-4">
            {featuredCourses.map((course) => (
              <div key={course.code} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{course.title}</div>
                    <div className="text-sm text-slate-400">{course.code} • {course.level}</div>
                  </div>
                  <div className="flex items-center gap-1 text-violet-200">
                    <FileText size={14} />
                    {course.resources}
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-400 to-emerald-300" />
                </div>
              </div>
            ))}
          </div>
        </OverviewCard>

        <OverviewCard title="Study goals" action="Priority">
          <div className="space-y-3">
            {studyGoals.map((goal) => (
              <div key={goal} className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-slate-200">
                <CheckCircle2 size={16} className="text-emerald-300" />
                {goal}
              </div>
            ))}
          </div>
        </OverviewCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <OverviewCard title="Recent resources" action="Curated">
          <div className="space-y-4">
            {mockResources.slice(0, 3).map((resource) => (
              <div key={resource.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-base font-medium text-white">{resource.title}</div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-emerald-200">
                    {resource.isVerified ? 'Verified' : 'Review'}
                  </span>
                </div>
                <div className="text-sm text-slate-400">{resource.course} • {resource.topic}</div>
                <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{resource.downloads} downloads</span>
                  <span>{resource.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </OverviewCard>

        <OverviewCard title="Insights" action="AI powered">
          <div className="space-y-4">
            {insightCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-slate-400">{card.title}</span>
                  <Sparkles size={16} className="text-violet-300" />
                </div>
                <div className="text-2xl font-semibold text-white">{card.value}</div>
                <div className="mt-2 text-sm text-slate-400">{card.helper}</div>
              </div>
            ))}
          </div>
        </OverviewCard>
      </div>
    </div>
  );
}
