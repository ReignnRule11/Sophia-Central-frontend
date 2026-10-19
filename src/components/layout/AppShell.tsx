import { BriefcaseBusiness, ChartNoAxesCombined, FolderKanban, LayoutGrid, LogOut, Search, Settings, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { currentUser, navItems } from '../../lib/mock-data';

const iconMap: Record<string, typeof LayoutGrid> = {
  'layout-grid': LayoutGrid,
  'folder-kanban': FolderKanban,
  users: Users,
  'chart-no-axes-combined': ChartNoAxesCombined
};

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-800 bg-slate-950/80 p-6 lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg font-bold text-violet-200">
              S
            </div>
            <div>
              <div className="text-lg font-semibold text-white">Sophia Central</div>
              <div className="text-xs text-slate-400">Operations OS</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon] ?? LayoutGrid;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-violet-500/15 text-violet-100 ring-1 ring-violet-500/40' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center gap-2 text-emerald-300">
              <ShieldCheck size={16} />
              <span className="text-sm font-medium">System health</span>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Platform</span>
                <span className="text-emerald-300">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Security</span>
                <span className="text-emerald-300">Healthy</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Command center</p>
                <h1 className="mt-1 text-2xl font-semibold text-white">{title}</h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="hidden rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 sm:flex sm:items-center sm:gap-2">
                  <Search size={14} />
                  Search
                </button>
                <button className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200">
                  <Settings size={16} />
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function UserBadge() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-sm font-semibold text-white">
        {currentUser.avatar}
      </div>
      <div>
        <div className="text-sm font-medium text-white">{currentUser.name}</div>
        <div className="text-xs text-slate-400">{currentUser.role}</div>
      </div>
    </div>
  );
}

export const QuickStat = ({ label, value, icon: Icon, tone = 'neutral' }: { label: string; value: string; icon: typeof TrendingUp; tone?: 'neutral' | 'positive' | 'warning' }) => (
  <div className="glass-panel p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <span className={`rounded-lg p-2 ${tone === 'positive' ? 'bg-emerald-500/10 text-emerald-300' : tone === 'warning' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
        <TrendingUp size={14} />
      </span>
    </div>
    <div className="text-2xl font-semibold text-white">{value}</div>
  </div>
);

export const AccentBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="label-pill">{children}</span>
);

export const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="mb-5">
    <p className="text-xs uppercase tracking-[0.24em] text-violet-300">{eyebrow}</p>
    <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
  </div>
);

export const StatusDot = ({ tone }: { tone: 'positive' | 'warning' | 'neutral' }) => (
  <span
    className={`inline-block h-2.5 w-2.5 rounded-full ${
      tone === 'positive' ? 'bg-emerald-400' : tone === 'warning' ? 'bg-amber-400' : 'bg-slate-400'
    }`}
  />
);

export const MetricPill = ({ tone, children }: { tone: 'positive' | 'warning' | 'neutral'; children: React.ReactNode }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
      tone === 'positive' ? 'bg-emerald-500/10 text-emerald-200' : tone === 'warning' ? 'bg-amber-500/10 text-amber-200' : 'bg-slate-700 text-slate-200'
    }`}
  >
    <StatusDot tone={tone} />
    {children}
  </span>
);

export const OverviewCard = ({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) => (
  <div className="glass-panel p-5">
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-base font-medium text-white">{title}</h3>
      {action ? <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{action}</span> : null}
    </div>
    {children}
  </div>
);
