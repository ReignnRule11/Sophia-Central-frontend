import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { registerSchema, type RegisterValues } from '../lib/validation';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

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
      role: 'student',
      handle: '',
      socialLinks: {
        linkedin: '',
        instagram: '',
        twitter: '',
      },
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    await registerUser({
      ...values,
      handle: values.handle || `${values.firstName.toLowerCase()}.${values.lastName.toLowerCase()}`,
      authProvider: 'email',
      socialLinks: values.socialLinks,
    });
    navigate('/dashboard');
  };

  const socialButtons = [
    { label: 'Continue with Google', provider: 'google' },
    { label: 'Continue with Apple', provider: 'apple' },
    { label: 'Continue with GitHub', provider: 'github' },
    { label: 'Continue with LinkedIn', provider: 'linkedin' },
    { label: 'Continue with Instagram', provider: 'instagram' },
    { label: 'Continue with Twitter', provider: 'twitter' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_32px_80px_rgba(15,23,42,0.7)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid-pattern flex flex-col justify-between bg-slate-950/80 p-8 lg:p-10">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-lg font-bold text-violet-200">S</div>
              <div>
                <div className="text-lg font-semibold text-white">Sophia Central</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Study • Research • Grow</div>
              </div>
            </div>

            <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-200">
              Welcome aboard
            </div>

            <h1 className="mt-6 max-w-md text-4xl font-semibold text-white lg:text-5xl">
              Build your academic hub in minutes.
            </h1>
            <p className="mt-5 max-w-lg text-slate-300">
              Create your account to discover verified learning resources, upload academic work, and collaborate with students and lecturers.
            </p>
          </div>

          <div className="mt-10 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Access verified notes, past questions, and research papers</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Create a unique social handle for your academic identity</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Join role-specific tools for students, lecturers, moderators, and admins</div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">Create account</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Get started</h2>
              </div>
              <Link to="/login" className="text-sm text-violet-200 hover:text-violet-100">Sign in</Link>
            </div>

            <div className="space-y-3">
              {socialButtons.map((button) => (
                <button
                  key={button.provider}
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:border-violet-400 hover:text-violet-100"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold uppercase">
                    {button.provider.slice(0, 1)}
                  </span>
                  {button.label}
                </button>
              ))}
            </div>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
              <div className="h-px flex-1 bg-slate-800" />
              or
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">First name</label>
                  <input
                    {...register('firstName')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-rose-300">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Last name</label>
                  <input
                    {...register('lastName')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-rose-300">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Social handle</label>
                <input
                  type="text"
                  placeholder="@ayomide"
                  {...register('handle')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                />
                {errors.handle && <p className="mt-1 text-sm text-rose-300">{errors.handle.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                />
                {errors.email && <p className="mt-1 text-sm text-rose-300">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                />
                {errors.password && <p className="mt-1 text-sm text-rose-300">{errors.password.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Role</label>
                <select
                  {...register('role')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">LinkedIn</label>
                  <input
                    type="text"
                    placeholder="linkedin.com/in/yourprofile"
                    {...register('socialLinks.linkedin')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Instagram</label>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    {...register('socialLinks.instagram')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Twitter</label>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    {...register('socialLinks.twitter')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-violet-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
