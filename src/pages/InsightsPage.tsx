import { BarChart3, Lightbulb, Sparkles } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { insights } from '../lib/mock-data';

export function InsightsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Forecasting" title="Operational insights" />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel p-5">
          <div className="mb-3 flex items-center gap-2 text-violet-200">
            <BarChart3 size={18} />
            <span className="text-sm font-medium">Performance</span>
          </div>
          <div className="text-3xl font-semibold text-white">+12.4%</div>
        </div>
        <div className="glass-panel p-5">
          <div className="mb-3 flex items-center gap-2 text-emerald-200">
            <Sparkles size={18} />
            <span className="text-sm font-medium">Momentum</span>
          </div>
          <div className="text-3xl font-semibold text-white">High</div>
        </div>
        <div className="glass-panel p-5">
          <div className="mb-3 flex items-center gap-2 text-amber-200">
            <Lightbulb size={18} />
            <span className="text-sm font-medium">Opportunities</span>
          </div>
          <div className="text-3xl font-semibold text-white">9</div>
        </div>
      </div>

      <OverviewCard title="Priority recommendations" action="AI assisted">
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="text-lg font-medium text-white">{insight.title}</div>
                <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-violet-200">
                  {insight.section}
                </span>
              </div>
              <p className="text-sm text-slate-300">{insight.summary}</p>
              <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                <span>Confidence: {insight.confidence}</span>
                <span>Impact: {insight.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </OverviewCard>
    </div>
  );
}
