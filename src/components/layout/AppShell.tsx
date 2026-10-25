
import {
  Bell,
  BookOpen,
  BrainCircuit,
  LayoutGrid,
  LogOut,
  Moon,
  Search,
  ShieldCheck,
  SunMedium,
  Upload,
  WalletCards,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { roleUsers } from '../../lib/mock-data';
import { BrandLogo } from '../brand/BrandLogo';

const studentNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'Library', href: '/library', icon: BookOpen },
  { label: 'Upload', href: '/upload', icon: Upload },
  { label: 'AI Tutor', href: '/ai', icon: BrainCircuit },
  { label: 'Wallet', href: '/wallet', icon: WalletCards },
];

const lecturerNav = [
  { label: 'Overview', href: '/lecturer', icon: LayoutGrid },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'Library', href: '/library', icon: BookOpen },
  { label: 'Upload', href: '/upload', icon: Upload },
  { label: 'AI Tutor', href: '/ai', icon: BrainCircuit },
];

const adminNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'Library', href: '/library', icon: BookOpen },
  { label: 'Moderation', href: '/moderation', icon: ShieldCheck },
  { label: 'Analytics', href: '/analytics', icon: LayoutGrid },
  { label: 'Upload', href: '/upload', icon: Upload },
];

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems =
    user?.role === 'lecturer'
      ? lecturerNav
      : user?.role === 'moderator' || user?.role === 'admin'
        ? adminNav
        : studentNav;

  return (
    <div
      className="app-shell min-h-screen bg-slate-950 text-slate-100"
      data-theme={theme}
    >
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-slate-800 bg-slate-950/80 p-5 lg:flex">
          {/* Shared brand component */}
          <div className="mb-8">
            <BrandLogo
              variant="full"
              linked={false}
              tone="light"
            />
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-violet-500/15 text-violet-100 ring-1 ring-violet-500/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
              <span>Campus health</span>
              <span className="text-emerald-300">Live</span>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Verified resources</span>
                <span className="text-emerald-300">98%</span>
              </div>

              <div className="flex items-center justify-between">
                <span>AI tutor uptime</span>
                <span className="text-sky-300">99.4%</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                  Academic command center
                </p>

                <h1 className="mt-1 text-2xl font-semibold text-white">
                  {title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 md:flex"
                >
                  <Search size={14} />
                  Search resources
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200 transition hover:text-violet-200"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? (
                    <SunMedium size={16} />
                  ) : (
                    <Moon size={16} />
                  )}
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <div className="page-shell p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function UserBadge() {
  const { user } = useAuth();
  const current = user ?? roleUsers.student;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-sm font-semibold text-white">
        {current.avatar}
      </div>

      <div>
        <div className="text-sm font-medium text-white">
          {current.name}
        </div>
        <div className="text-xs text-slate-400">
          {current.institution}
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
    </div>
  );
}

export function OverviewCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-medium text-white">{title}</h3>
        {action ? (
          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            {action}
          </span>
        ) : null}
      </div>

      {children}
    </div>
  );
}