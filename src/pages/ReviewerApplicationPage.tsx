import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type Application = {
  id: string;
  status: string;
  decisionNote?: string | null;
  createdAt: string;
  updatedAt: string;
};

const splitLines = (value: string) => value.split(/[\n,;]/).map(item => item.trim()).filter(Boolean);

export function ReviewerApplicationPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [expertiseAreas, setExpertiseAreas] = useState('');
  const [academicLevels, setAcademicLevels] = useState('');
  const [reviewExperience, setReviewExperience] = useState('');
  const [supportingDocuments, setSupportingDocuments] = useState('');
  const [conflictDeclaration, setConflictDeclaration] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest<Application[]>('/reviewer-applications/me')
      .then(items => { if (active && items.length) setApplication(items[0]); })
      .catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'Unable to load your application status.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError(''); setNotice('');
    try {
      const result = await apiRequest<Application>('/reviewer-applications', {
        method: 'POST',
        body: JSON.stringify({
          qualifications: splitLines(qualifications),
          expertiseAreas: splitLines(expertiseAreas),
          institution: user?.institution || '',
          faculty: user?.faculty || '',
          department: user?.department || '',
          academicLevels: splitLines(academicLevels),
          reviewExperience,
          supportingDocuments: splitLines(supportingDocuments),
          conflictDeclaration,
          policyAccepted,
        }),
      });
      setApplication(result);
      setNotice('Your Academic Reviewer application has been submitted for administrator review.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to submit your application.');
    } finally { setSaving(false); }
  };

  const canResubmit = !application || ['rejected', 'more_information_required'].includes(application.status);
  return <div className="mx-auto max-w-4xl space-y-6">
    <section className="rounded-2xl border border-[#E4DDF8] bg-[#F7F4FF] p-4 sm:p-7 dark:border-[#40365A] dark:bg-[#211A34]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6121D0] dark:text-[#C4A7FF]">Additional account capability</p>
      <h2 className="mt-2 text-2xl font-bold text-[#091F5B] dark:text-white">Become an Academic Reviewer</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#52627B] dark:text-slate-300 dark:text-slate-300">Reviewer access is an additional capability. Your existing {user?.role === 'lecturer' ? 'Lecturer' : 'Student'} account, resources and academic identity remain unchanged. Access is enabled only after administrator approval.</p>
    </section>
    {loading ? <p className="text-sm text-[#64748B]">Loading application status…</p> : application && <section className="rounded-2xl border border-[#DCE4EF] bg-white p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-semibold text-[#091F5B] dark:text-slate-100 dark:text-white">Latest application status</p>
      <p className="mt-2 inline-flex rounded-full bg-[#F0EBFF] px-3 py-1 text-sm font-semibold capitalize text-[#6121D0] dark:bg-[#35264F] dark:text-[#D8C6FF]">{application.status.replace(/_/g, ' ')}</p>
      {application.decisionNote && <p className="mt-3 text-sm leading-6 text-[#52627B] dark:text-slate-300 dark:text-slate-300">Administrator note: {application.decisionNote}</p>}
      <p className="mt-2 text-xs text-[#64748B] dark:text-slate-400">Submitted {new Date(application.createdAt).toLocaleString()}</p>
    </section>}
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</p>}
    {canResubmit && <form onSubmit={submit} className="space-y-5 rounded-2xl border border-[#DCE4EF] bg-white p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-7">
      <p className="text-sm leading-6 text-[#52627B] dark:text-slate-300 dark:text-slate-300">Provide accurate, verifiable information. Separate entries with commas or new lines.</p>
      <label className="block text-sm font-semibold text-[#091F5B] dark:text-slate-100">Qualifications and credentials<textarea required minLength={2} value={qualifications} onChange={e => setQualifications(e.target.value)} placeholder="Degrees, professional credentials, certifications…" className="mt-2 min-h-24 w-full rounded-xl border border-[#DCE4EF] p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-950 dark:text-white placeholder:dark:text-slate-500" /></label>
      <label className="block text-sm font-semibold text-[#091F5B] dark:text-slate-100">Subject expertise<textarea required minLength={2} value={expertiseAreas} onChange={e => setExpertiseAreas(e.target.value)} placeholder="e.g. Computer science, statistics, research methods…" className="mt-2 min-h-24 w-full rounded-xl border border-[#DCE4EF] p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-950 dark:text-white placeholder:dark:text-slate-500" /></label>
      <div className="grid gap-4 sm:grid-cols-3"><label className="text-sm font-semibold text-[#091F5B] dark:text-slate-100">Institution<input readOnly value={user?.institution || ''} className="mt-2 w-full rounded-xl border border-[#DCE4EF] bg-slate-50 p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" /></label><label className="text-sm font-semibold text-[#091F5B] dark:text-slate-100">Faculty<input readOnly value={user?.faculty || ''} className="mt-2 w-full rounded-xl border border-[#DCE4EF] bg-slate-50 p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" /></label><label className="text-sm font-semibold text-[#091F5B] dark:text-slate-100">Department<input readOnly value={user?.department || ''} className="mt-2 w-full rounded-xl border border-[#DCE4EF] bg-slate-50 p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" /></label></div>
      <label className="block text-sm font-semibold text-[#091F5B] dark:text-slate-100">Academic levels qualified to review<textarea required value={academicLevels} onChange={e => setAcademicLevels(e.target.value)} placeholder="e.g. Undergraduate, postgraduate, doctoral…" className="mt-2 min-h-20 w-full rounded-xl border border-[#DCE4EF] p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-950 dark:text-white placeholder:dark:text-slate-500" /></label>
      <label className="block text-sm font-semibold text-[#091F5B] dark:text-slate-100">Academic, research or peer-review experience<textarea required minLength={30} maxLength={5000} value={reviewExperience} onChange={e => setReviewExperience(e.target.value)} placeholder="Describe relevant experience and responsibilities…" className="mt-2 min-h-32 w-full rounded-xl border border-[#DCE4EF] p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-950 dark:text-white placeholder:dark:text-slate-500" /></label>
      <label className="block text-sm font-semibold text-[#091F5B] dark:text-slate-100">Supporting document links (HTTPS only)<textarea value={supportingDocuments} onChange={e => setSupportingDocuments(e.target.value)} placeholder="https://… (one link per line)" className="mt-2 min-h-20 w-full rounded-xl border border-[#DCE4EF] p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-950 dark:text-white placeholder:dark:text-slate-500" /></label>
      <label className="block text-sm font-semibold text-[#091F5B] dark:text-slate-100">Conflict-of-interest declaration<textarea required minLength={20} maxLength={3000} value={conflictDeclaration} onChange={e => setConflictDeclaration(e.target.value)} placeholder="Declare relevant personal, academic, financial or professional relationships and confirm you will recuse yourself when conflicts arise." className="mt-2 min-h-28 w-full rounded-xl border border-[#DCE4EF] p-3 text-sm font-normal text-[#26364F] dark:border-slate-700 dark:bg-slate-950 dark:text-white placeholder:dark:text-slate-500" /></label>
      <label className="flex items-start gap-3 text-sm leading-6 text-[#52627B] dark:text-slate-300"><input type="checkbox" checked={policyAccepted} onChange={e => setPolicyAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-[#6121D0]" /><span>I have read and agree to the Sophis Central Academic Reviewer policy, including impartiality, confidentiality, conflict disclosure, recusal and the prohibition on reviewing my own work.</span></label>
      <button type="submit" disabled={saving || !policyAccepted} className="rounded-xl bg-[#6121D0] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Submitting…' : 'Submit reviewer application'}</button>
    </form>}
  </div>;
}
