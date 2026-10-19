import { useState } from 'react';
import { CheckCircle2, ChevronRight, FileUp, GraduationCap, Sparkles } from 'lucide-react';
import { OverviewCard, SectionTitle, UserBadge } from '../components/layout/AppShell';
import { sophiaApi } from '../api/sophiaApi';

export function LecturerDashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const stats = [
    { label: 'Uploaded this month', value: '38', helper: '+12% vs last month' },
    { label: 'Student engagement', value: '92%', helper: 'revision completions' },
    { label: 'AI-assisted answers', value: '1,430', helper: 'across your courses' },
    { label: 'Question backlog', value: '18', helper: 'awaiting review' },
  ];

  const resources = [
    { title: 'Digital Logic Revision Pack', course: 'CPE 221', type: 'Lecture notes', completion: '96%' },
    { title: 'Semiconductor Lab Questions', course: 'CPE 311', type: 'Past questions', completion: '88%' },
    { title: 'Intro to AI Study Slides', course: 'CSE 420', type: 'Slides', completion: '79%' },
  ];

  const students = [
    { name: 'Ayomide O.', progress: 92, status: 'On track' },
    { name: 'Tari A.', progress: 87, status: 'Needs revision' },
    { name: 'Ruth I.', progress: 95, status: 'Excellent' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle eyebrow="Lecturer workspace" title="Instructor overview" />
        <UserBadge />
      </div>

      {showOnboarding ? (
        <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-violet-200">Onboarding</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">Three steps to build a stronger course library</h3>
            </div>
            <button onClick={() => setShowOnboarding(false)} className="rounded-full border border-violet-400/30 bg-slate-900 px-4 py-2 text-sm text-violet-100">Dismiss</button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {['Upload a lecture pack', 'Review student questions', 'Share a revision checklist'].map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-200">{index + 1}</div>
                <div className="text-sm text-slate-200">{step}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
            <div className="mt-4 text-3xl font-semibold text-white">{stat.value}</div>
            <div className="mt-1 text-sm text-slate-400">{stat.helper}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OverviewCard title="Latest course resources" action="Published">
          <div className="space-y-3">
            {resources.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.course} • {item.type}</div>
                  </div>
                  <button className="inline-flex items-center gap-1 text-violet-200">
                    View <ChevronRight size={16} />
                  </button>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400" style={{ width: item.completion }} />
                </div>
                <div className="mt-2 text-right text-xs uppercase tracking-[0.18em] text-slate-400">{item.completion}</div>
              </div>
            ))}
          </div>
        </OverviewCard>

        <OverviewCard title="Student progress" action="This week">
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.name} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">{student.name}</span>
                  <span className="text-xs uppercae tracking-[0.18em] text-violet-200">{student.status}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400" style={{ width: `${student.progress}%` }} />
                </div>
                <div className="mt-2 text-right text-xs text-slate-400">{student.progress}%</div>
              </div>
            ))}
          </div>
        </OverviewCard>
      </div>
    </div>
  );
}
