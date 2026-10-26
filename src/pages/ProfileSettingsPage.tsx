import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function ProfileSettingsPage() {
  const { user, completeOnboarding } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', institution: '', faculty: '', department: '', programme: '', studyLevel: '', bio: '', handle: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? user.name?.split(' ')[0] ?? '',
      lastName: user.lastName ?? user.name?.split(' ').slice(1).join(' ') ?? '',
      institution: user.institution ?? '',
      faculty: user.faculty ?? '',
      department: user.department ?? '',
      programme: user.programme ?? '',
      studyLevel: user.studyLevel ?? '',
      bio: user.bio ?? '',
      handle: user.handle ?? '',
    });
  }, [user]);

  if (!user) return null;
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await completeOnboarding({
        institution: form.institution.trim(),
        faculty: form.faculty.trim(),
        department: form.department.trim(),
        programme: user.role === 'student' ? form.programme.trim() : undefined,
        studyLevel: user.role === 'student' ? form.studyLevel : undefined,
        coursesTaught: user.role === 'lecturer' ? user.coursesTaught : undefined,
        bio: form.bio.trim(),
        socialHandle: form.handle.trim(),
      });
      setMessage('Profile updated successfully.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const fields: Array<[keyof typeof form, string, string]> = [
    ['firstName', 'First name', 'Your first name'],
    ['lastName', 'Last name', 'Your last name'],
    ['institution', 'Institution', 'Your institution'],
    ['faculty', 'Faculty', 'Your faculty'],
    ['department', 'Department', 'Your department'],
  ];

  return <div className="mx-auto max-w-4xl space-y-6">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Account & Settings</p>
      <h2 className="mt-2 text-3xl font-bold text-white">Your profile</h2>
      <p className="mt-2 text-slate-400">Review and edit the academic identity used across Sophia Central.</p>
    </div>
    <section className="glass-panel p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(([key, label, placeholder]) => <label key={key} className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
          <input value={form[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-violet-400" />
        </label>)}
        {user.role === 'student' && <>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Programme</span><input value={form.programme} onChange={(event) => update('programme', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Study level</span><input value={form.studyLevel} onChange={(event) => update('studyLevel', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" /></label>
        </>}
        <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Academic handle</span><input value={form.handle} onChange={(event) => update('handle', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" /></label>
        <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-300">Bio</span><textarea value={form.bio} onChange={(event) => update('bio', event.target.value)} rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Tell your academic community about yourself" /></label>
      </div>
      {message && <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}
      {error && <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
      <div className="mt-6 flex justify-end"><button type="button" onClick={() => void save()} disabled={saving} className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save profile changes'}</button></div>
    </section>
  </div>;
}
