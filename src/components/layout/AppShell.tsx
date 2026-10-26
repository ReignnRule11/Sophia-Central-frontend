import {
  Bell, BookOpen, Bookmark, BrainCircuit, LayoutGrid, LogOut, Moon, Search,
  ShieldCheck, SunMedium, Upload, Users, WalletCards, Menu, X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { roleUsers } from '../../lib/mock-data';
import { BrandLogo } from '../brand/BrandLogo';

const studentNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'Academic & research materials', href: '/library', icon: BookOpen },
  { label: 'Saved resources', href: '/saved', icon: Bookmark },
  { label: 'AI Tutor', href: '/ai', icon: BrainCircuit },
  { label: 'Wallet', href: '/wallet', icon: WalletCards },
];
const lecturerNav = [
  { label: 'Dashboard', href: '/lecturer', icon: LayoutGrid },
  { label: 'Resource library', href: '/library', icon: BookOpen },
  { label: 'Submit resource', href: '/upload', icon: Upload },
];
const adminNav = [
  { label: 'Dashboard', href: '/moderation', icon: LayoutGrid },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Resource review', href: '/moderation', icon: ShieldCheck },
  { label: 'Resource library', href: '/library', icon: BookOpen },
  { label: 'Analytics', href: '/analytics', icon: LayoutGrid },
];

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { user, logout } = useAuth(); const { theme, toggleTheme } = useTheme(); const navigate = useNavigate(); const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navItems = user?.role === 'lecturer' ? lecturerNav : user?.role === 'moderator' || user?.role === 'admin' ? adminNav : studentNav;
  const nav = <nav aria-label="Main navigation" className="space-y-1">{navItems.map(({ href, label, icon: Icon }) => <NavLink key={label} to={href} onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-violet-500/15 text-violet-100 ring-1 ring-violet-500/30' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`}><Icon size={17} />{label}</NavLink>)}</nav>;
  return <div className="app-shell min-h-screen bg-slate-950 text-slate-100" data-theme={theme}><div className="flex min-h-screen"><aside className="hidden w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950/80 p-5 lg:flex"><div className="mb-8"><BrandLogo variant="full" linked={false} tone="light" /></div>{nav}<div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4"><p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">Your institution</p><p className="text-sm text-slate-200">{user?.institution || 'Institution not set'}</p><p className="mt-1 text-xs text-slate-500">Resources are organised around your academic community.</p></div></aside><main className="min-w-0 flex-1"><header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur sm:px-6"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileNavOpen((open) => !open)} className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200 lg:hidden" aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileNavOpen}>{mobileNavOpen ? <X size={18} /> : <Menu size={18} />}</button><div className="min-w-0"><p className="hidden text-[10px] uppercase tracking-[0.22em] text-slate-400 sm:block">Sophia Central · {user?.institution || 'Academic workspace'}</p><h1 className="truncate text-xl font-semibold text-white sm:text-2xl">{title}</h1></div></div><div className="flex shrink-0 items-center gap-2"><button type="button" onClick={() => navigate('/library')} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:border-violet-500" aria-label="Search academic resources"><Search size={15} /><span className="hidden sm:inline">Search resources</span></button><button type="button" className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}</button><button type="button" className="hidden rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200 sm:block" aria-label="Notifications"><Bell size={16} /></button><button type="button" onClick={() => void logout()} className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-sm text-rose-100 sm:px-3 sm:py-2"><LogOut size={15} className="sm:mr-2 sm:inline" /><span className="hidden sm:inline">Sign out</span></button></div></div>{mobileNavOpen && <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-3 lg:hidden">{nav}</div>}</header><div className="page-shell p-4 sm:p-6">{children}</div></main></div></div>;
}
export function UserBadge() { const { user } = useAuth(); const current = user ?? roleUsers.student; return <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-sm font-semibold text-white">{current.avatar || current.name?.slice(0, 1)}</div><div><div className="text-sm font-medium text-white">{current.name}</div><div className="text-xs text-slate-400">{current.institution || 'Institution not set'}</div></div></div>; }
export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="mb-5"><p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">{eyebrow}</p><h2 className="mt-1 text-xl font-semibold text-white">{title}</h2></div>; }
export function OverviewCard({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) { return <div className="glass-panel p-5"><div className="mb-5 flex items-center justify-between gap-3"><h3 className="text-base font-medium text-white">{title}</h3>{action ? <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{action}</span> : null}</div>{children}</div>; }
