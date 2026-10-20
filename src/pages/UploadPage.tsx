import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { resourceUploadSchema, type ResourceUploadValues } from '../lib/validation';

export function UploadPage() {
  const { token } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResourceUploadValues>({
    resolver: zodResolver(resourceUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      course: '',
      topic: '',
      institution: '',
      level: '',
      type: 'lecture_notes',
      tags: '',
    },
  });

  const onSubmit = async (values: ResourceUploadValues) => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      const payload = {
        title: values.title,
        description: values.description,
        course: values.course,
        topic: values.topic,
        institution: values.institution,
        level: values.level,
        type: values.type,
        tags: values.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      await resourcesApi.create(payload, token);

      setSuccessMessage('Resource submitted successfully and sent to moderation.');
      reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">New upload</p>
        <h2 className="text-2xl font-semibold text-white">Submit academic resource</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Title</label>
            <input
              {...register('title')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            {errors.title && <p className="mt-1 text-sm text-rose-300">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Resource type</label>
            <select
              {...register('type')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            >
              <option value="lecture_notes">Lecture Notes</option>
              <option value="past_question">Past Question</option>
              <option value="research_paper">Research Paper</option>
              <option value="project">Project</option>
              <option value="slides">Slides</option>
              <option value="other">Other</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-rose-300">{errors.type.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Course</label>
            <input
              {...register('course')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            {errors.course && <p className="mt-1 text-sm text-rose-300">{errors.course.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Topic</label>
            <input
              {...register('topic')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            {errors.topic && <p className="mt-1 text-sm text-rose-300">{errors.topic.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Institution</label>
            <input
              {...register('institution')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            {errors.institution && <p className="mt-1 text-sm text-rose-300">{errors.institution.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Level</label>
            <input
              {...register('level')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
            {errors.level && <p className="mt-1 text-sm text-rose-300">{errors.level.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Description</label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
          {errors.description && <p className="mt-1 text-sm text-rose-300">{errors.description.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Tags</label>
          <input
            {...register('tags')}
            placeholder="ai, logistics, research"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
        </div>

        {submitError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            {submitError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-violet-500 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Submit resource'}
        </button>
      </form>
    </div>
  );
}
