import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { resourceUploadSchema, type ResourceUploadValues } from '../lib/resourceValidation';

export function UploadPage() {
  const { isAuthenticated, user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ResourceUploadValues>({
    resolver: zodResolver(resourceUploadSchema),
    defaultValues: { title: '', description: '', course: '', topic: '', institution: '', level: '', type: 'lecture_notes', fileUrl: '', tags: '' },
  });

  const onSubmit = async (values: ResourceUploadValues) => {
    if (!isAuthenticated) return;
    try {
      setSubmitError(null);
      setSuccessMessage(null);
      await resourcesApi.create({
        title: values.title.trim(),
        description: values.description.trim(),
        course: values.course.trim(),
        topic: values.topic.trim(),
        institution: values.institution.trim() || user?.institution || '',
        level: values.level.trim(),
        type: values.type,
        ...(values.fileUrl?.trim() ? { fileUrl: values.fileUrl.trim() } : {}),
        tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setSuccessMessage('Resource submitted successfully and sent for moderator review.');
      reset({ title: '', description: '', course: '', topic: '', institution: user?.institution ?? '', level: '', type: 'lecture_notes', fileUrl: '', tags: '' });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    }
  };

  const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-violet-400';
  return <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
    <div className="mb-6"><p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Lecturer workspace · Resource submission</p><h2 className="mt-2 text-2xl font-semibold text-white">Submit an academic resource</h2><p className="mt-2 text-sm leading-6 text-slate-400">Add resource details and, if available, a secure HTTPS link to the file. Submissions enter the moderation queue before publication.</p></div>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label htmlFor="resource-title" className="mb-2 block text-sm text-slate-300">Title</label><input id="resource-title" {...register('title')} className={inputClass} />{errors.title && <p className="mt-1 text-sm text-rose-300">{errors.title.message}</p>}</div>
        <div><label htmlFor="resource-type" className="mb-2 block text-sm text-slate-300">Resource type</label><select id="resource-type" {...register('type')} className={inputClass}><option value="lecture_notes">Lecture Notes</option><option value="past_question">Past Question</option><option value="research_paper">Research Paper</option><option value="project">Project</option><option value="slides">Slides</option><option value="other">Other</option></select>{errors.type && <p className="mt-1 text-sm text-rose-300">{errors.type.message}</p>}</div>
        <div><label htmlFor="resource-course" className="mb-2 block text-sm text-slate-300">Course taught</label><input id="resource-course" {...register('course')} placeholder="e.g. CSC 101" className={inputClass} />{errors.course && <p className="mt-1 text-sm text-rose-300">{errors.course.message}</p>}</div>
        <div><label htmlFor="resource-topic" className="mb-2 block text-sm text-slate-300">Topic</label><input id="resource-topic" {...register('topic')} className={inputClass} />{errors.topic && <p className="mt-1 text-sm text-rose-300">{errors.topic.message}</p>}</div>
        <div><label htmlFor="resource-institution" className="mb-2 block text-sm text-slate-300">Institution</label><input id="resource-institution" {...register('institution')} placeholder={user?.institution || 'Your institution'} className={inputClass} />{errors.institution && <p className="mt-1 text-sm text-rose-300">{errors.institution.message}</p>}</div>
        <div><label htmlFor="resource-level" className="mb-2 block text-sm text-slate-300">Level</label><input id="resource-level" {...register('level')} placeholder="e.g. 200 level" className={inputClass} />{errors.level && <p className="mt-1 text-sm text-rose-300">{errors.level.message}</p>}</div>
        <div className="md:col-span-2"><label htmlFor="resource-file-url" className="mb-2 block text-sm text-slate-300">Resource file URL (optional)</label><input id="resource-file-url" type="url" {...register('fileUrl')} placeholder="https://…" className={inputClass} aria-describedby="resource-file-help" />{errors.fileUrl && <p className="mt-1 text-sm text-rose-300">{errors.fileUrl.message}</p>}<p id="resource-file-help" className="mt-1 text-xs text-slate-500">Use a secure HTTPS link to a file hosted in storage you control. Direct file uploads are not enabled by the current backend.</p></div>
        <div className="md:col-span-2"><label htmlFor="resource-description" className="mb-2 block text-sm text-slate-300">Description</label><textarea id="resource-description" {...register('description')} rows={5} className={inputClass} />{errors.description && <p className="mt-1 text-sm text-rose-300">{errors.description.message}</p>}</div>
        <div className="md:col-span-2"><label htmlFor="resource-tags" className="mb-2 block text-sm text-slate-300">Tags</label><input id="resource-tags" {...register('tags')} placeholder="ai, revision, engineering" className={inputClass} /></div>
      </div>
      {submitError && <p role="alert" className="rounded-xl border border-rose-900/50 bg-rose-950/30 p-3 text-sm text-rose-200">{submitError}</p>}
      {successMessage && <p role="status" className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-3 text-sm text-emerald-200">{successMessage}</p>}
      <button type="submit" disabled={isSubmitting || !isAuthenticated} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Submitting…' : 'Submit for moderator review'}</button>
    </form>
  </div>;
}
