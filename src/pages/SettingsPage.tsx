import { Link } from 'react-router-dom';
import { Moon, SunMedium, UserRound, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  return <div className="mx-auto max-w-4xl space-y-6">
    <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Preferences</p><h2 className="mt-2 text-3xl font-bold text-white">Settings</h2><p className="mt-2 text-slate-400">Manage your profile shortcut, appearance, and account security information.</p></div>
    <section className="glass-panel space-y-5 p-5 sm:p-7">
      <div className="flex items-start gap-4"><span className="rounded-xl bg-violet-500/15 p-3 text-violet-200"><UserRound size={20}/></span><div className="min-w-0 flex-1"><h3 className="font-semibold text-white">Profile information</h3><p className="mt-1 text-sm text-slate-400">Update the academic details associated with your {user?.role ?? 'Sophia'} account.</p><Link to="/profile" className="mt-3 inline-flex rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-violet-200 hover:border-violet-400">Edit my profile</Link></div></div>
      <div className="border-t border-slate-800"/>
      <div className="flex items-start gap-4"><span className="rounded-xl bg-violet-500/15 p-3 text-violet-200">{theme === 'dark' ? <Moon size={20}/> : <SunMedium size={20}/>}</span><div className="min-w-0 flex-1"><h3 className="font-semibold text-white">Appearance</h3><p className="mt-1 text-sm text-slate-400">Current theme: {theme === 'dark' ? 'Dark' : 'Light'}.</p><button type="button" onClick={toggleTheme} className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-violet-200 hover:border-violet-400">Switch to {theme === 'dark' ? 'light' : 'dark'} theme</button></div></div>
      <div className="border-t border-slate-800"/>
      <div className="flex items-start gap-4"><span className="rounded-xl bg-violet-500/15 p-3 text-violet-200"><ShieldCheck size={20}/></span><div className="min-w-0 flex-1"><h3 className="font-semibold text-white">Account security</h3><p className="mt-1 text-sm text-slate-400">Request a secure password reset link if you need to regain access to your account.</p><Link to="/forgot-password" className="mt-3 inline-flex rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-violet-200 hover:border-violet-400">Password recovery</Link></div></div>
    </section>
  </div>;
}
