import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { registerSchema, type RegisterValues } from '../lib/validation';
import { BrandLogo } from '../components/brand/BrandLogo';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      institution: '',
      faculty: '',
      department: '',
      handle: '',
      socialLinks: { linkedin: '', instagram: '', twitter: '' },
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setSubmitError('');
    try {
      await registerUser({
        ...values,
        handle: values.handle || `${values.firstName.toLowerCase()}.${values.lastName.toLowerCase()}`,
        authProvider: 'email',
        socialLinks: values.socialLinks,
      });
      navigate('/onboarding/profile', { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_32px_80px_rgba(15,23,42,0.7)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid-pattern flex flex-col justify-between bg-slate-950/80 p-8 lg:p-10">
          <div>
            <div className="mb-8"><BrandLogo variant="full" linked={false} tone="light" /></div>
            <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-200">Welcome aboard</div>
            <h1 className="mt-6 max-w-md text-4xl font-semibold text-white lg:text-5xl">Build your academic hub in minutes.</h1>
            <p className="mt-5 max-w-lg text-slate-300">Create your account to discover verified learning resources, upload academic work, and collaborate with students and lecturers.</p>
          </div>
          <div className="mt-10 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Access verified notes, past questions, and research papers</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Complete your institution, faculty, department and academic profile</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Enter role-specific tools only after academic onboarding</div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <div><p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">Create account</p><h2 className="mt-2 text-3xl font-semibold text-white">Get started</h2></div>
              <Link to="/login" className="text-sm text-violet-200 hover:text-violet-100">Sign in</Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="firstName" className="mb-2 block text-sm text-slate-300">First name</label><input id="firstName" {...register('firstName')} autoComplete="given-name" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400" />{errors.firstName && <p className="mt-1 text-sm text-rose-300">{errors.firstName.message}</p>}</div>
                <div><label htmlFor="lastName" className="mb-2 block text-sm text-slate-300">Last name</label><input id="lastName" {...register('lastName')} autoComplete="family-name" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400" />{errors.lastName && <p className="mt-1 text-sm text-rose-300">{errors.lastName.message}</p>}</div>
              </div>
              <div><label htmlFor="email" className="mb-2 block text-sm text-slate-300">Email</label><input id="email" type="email" {...register('email')} autoComplete="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400" />{errors.email && <p className="mt-1 text-sm text-rose-300">{errors.email.message}</p>}</div>
              <div><label htmlFor="password" className="mb-2 block text-sm text-slate-300">Password</label><input id="password" type="password" {...register('password')} autoComplete="new-password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400" />{errors.password && <p className="mt-1 text-sm text-rose-300">{errors.password.message}</p>}</div>
              <div><label htmlFor="handle" className="mb-2 block text-sm text-slate-300">Academic handle <span className="text-slate-500">(optional)</span></label><input id="handle" type="text" placeholder="@yourname" {...register('handle')} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400" />{errors.handle && <p className="mt-1 text-sm text-rose-300">{errors.handle.message}</p>}</div>
              {submitError && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{submitError}</div>}
              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Creating account...' : 'Create account'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
