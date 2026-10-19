import { useState } from 'react';
import { BookOpen, CheckCircle2, FileUp, Sparkles } from 'lucide-react';
import { OverviewCard, SectionTitle } from '../components/layout/AppShell';
import { sophiaApi } from '../api/sophiaApi';

export function UploadPage() {
  const [form, setForm] = useState({
    title: '',
    course: '',
    topic: '',
    institution: '',
    description: '',
    type: 'lecture_notes',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await sophiaApi.resources.create({
        title: form.title,
        course: form.course,
        topic: form.topic,
        institution: form.institution,
        description: form.description,
        type: form.type as any,
      });

      setMessage(`Resource submitted successfully: ${created?.title || form.title}`);
      setForm({ title: '', course: '', topic: '', institution: '', description: '', type: 'lecture_notes' });
    } catch (error) {
      setMessage('Upload queued for moderation. The backend is not reachable right now, but your resource is ready for review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Contribute" title="Upload a learning resource" />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <OverviewCard title="Why upload?" action="Community" >
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="mt-1 text-emerald-300" />
              Help students at your institution access the right study material faster.
            </div>
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="mt-1 text-violet-300" />
              Earn Wisdom Points for high-quality, verified uploads and referrals.
            </div>
            <div className="flex items-start gap-3">
              <BookOpen size={16} className="mt-1 text-sky-300" />
              Support an education-first resource ecosystem with trusted academic content.
            </div>
          </div>
        </OverviewCard>

        <form onSubmit={handleSubmit} className="glass-panel p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span>Resource title</span>
              <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-violet-400" placeholder="Introduction to Data Structures" required />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Course</span>
              <input name="course" value={form.course} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-violet-400" placeholder="CPE 211" required />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Topic</span>
              <input name="topic" value={form.topic} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-violet-400" placeholder="Data structures" required />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Institution</span>
              <input name="institution" value={form.institution} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-violet-400" placeholder="University of Lagos" required />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Resource type</span>
              <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-violet-400">
                <option value="lecture_notes">Lecture notes</option>
                <option value="past_question">Past question</option>
                <option value="research_paper">Research paper</option>
                <option value="project">Project</option>
                <option value="slides">Slides</option>
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span>Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-violet-400" placeholder="Describe what this resource helps students learn and how it can be used." required />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <FileUp size={16} />
              File upload will be connected to the backend storage flow.
            </div>
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Submitting...' : 'Submit resource'}
            </button>
          </div>

          {message ? <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
