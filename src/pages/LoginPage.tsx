import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-5xl overflow-hidden rounded-3xl bg-[#2C36D9] shadow-xl lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-[260px] flex-col items-center justify-center px-8 py-10 text-center text-white lg:min-h-[560px] lg:px-10">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white px-3 shadow-sm">
            <span className="text-2xl font-extrabold text-[#091F5B]">SC</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/85">Continue your learning journey with Sophia Central.</p>
        </div>

        <div className="bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold text-[#091F5B]">Sign in to your account</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#091F5B]">Welcome back</h2>
            <form className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-[#091F5B]">Email
                <input type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#2C36D9] focus:ring-2 focus:ring-[#2C36D9]/20" />
              </label>
              <label className="block text-sm font-semibold text-[#091F5B]">Password
                <div className="relative mt-2">
                  <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 outline-none focus:border-[#2C36D9] focus:ring-2 focus:ring-[#2C36D9]/20" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2C36D9]">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </label>
              <button type="submit" className="w-full rounded-xl bg-[#6121D0] px-5 py-3.5 font-bold text-white transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#6121D0]/30">Sign in</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
