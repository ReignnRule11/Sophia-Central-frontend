import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brandStats, featureHighlights } from '../lib/mock-data';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-lg font-bold text-violet-200">S</div>
          <div>
            <div className="text-lg font-semibold text-white">Sophia Central</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Study • Research • Grow</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#impact" className="transition hover:text-white">Impact</a>
          <a href="#community" className="transition hover:text-white">Community</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white">Sign in</Link>
          <Link to="/login" className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]">Get started</Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
          <div className="page-shell">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-violet-200">
              <Sparkles size={14} />
              Built for students
            </div>

            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The trusted academic hub students actually use.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Sophia Central brings lecture notes, past questions, research papers, and AI-guided study support into one place—so students spend less time searching and more time learning.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3.5 font-medium text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]">
                Explore the platform <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3.5 font-medium text-slate-200 transition hover:border-violet-400 hover:text-white">
                Join as lecturer
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {brandStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur">
                  <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="hero-orb absolute -left-12 top-10 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="hero-orb absolute bottom-8 right-0 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl" />

            <div className="relative rounded-[28px] border border-slate-800 bg-slate-900/90 p-5 shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_28px_80px_rgba(15,23,42,0.9)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Today’s study focus</div>
                  <div className="mt-2 text-xl font-semibold text-white">Digital Logic Design</div>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-200">Verified</div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="text-sm text-slate-400">Most relevant resources</div>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3">
                      <div>
                        <div className="font-medium text-white">Boolean Algebra Notes</div>
                        <div className="text-xs text-slate-400">CPE 221 • University of Lagos</div>
                      </div>
                      <BookOpen size={16} className="text-violet-300" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3">
                      <div>
                        <div className="font-medium text-white">2024 Past Questions</div>
                        <div className="text-xs text-slate-400">CPE 211 • Lagos State University</div>
                      </div>
                      <GraduationCap size={16} className="text-sky-300" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-violet-500/10 p-4">
                    <div className="text-sm text-violet-200">AI tutor</div>
                    <div className="mt-2 text-2xl font-semibold text-white">4.8k</div>
                    <div className="text-xs text-slate-400">study questions answered</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-sm text-slate-400">Wisdom Points</div>
                    <div className="mt-2 text-2xl font-semibold text-white">1,420</div>
                    <div className="text-xs text-slate-400">ready to redeem</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">Why students choose us</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Everything students need to study without the chaos.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureHighlights.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_20px_40px_rgba(109,40,217,0.15)]">
                <div className="mb-4 inline-flex rounded-xl bg-violet-500/10 p-2 text-violet-200">
                  <Sparkles size={18} />
                </div>
                <div className="text-lg font-semibold text-white">{feature.title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="impact" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="mb-3 flex items-center gap-2 text-violet-200"><BookOpen size={18} /> <span className="text-sm uppercase tracking-[0.2em]">Research</span></div>
              <div className="text-3xl font-semibold text-white">81%</div>
              <p className="mt-3 text-slate-400">of students spend over 21 minutes searching for academic resources.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="mb-3 flex items-center gap-2 text-sky-200"><Users size={18} /> <span className="text-sm uppercase tracking-[0.2em]">Community</span></div>
              <div className="text-3xl font-semibold text-white">71%</div>
              <p className="mt-3 text-slate-400">want topic-based search and a cleaner, more organized academic library.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="mb-3 flex items-center gap-2 text-emerald-200"><ShieldCheck size={18} /> <span className="text-sm uppercase tracking-[0.2em]">Trust</span></div>
              <div className="text-3xl font-semibold text-white">90%</div>
              <p className="mt-3 text-slate-400">of students say a verified, centralized academic platform would be extremely useful.</p>
            </div>
          </div>
        </section>

        <section id="community" className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-28">
          <div className="rounded-[28px] border border-slate-800 bg-gradient-to-r from-violet-500/10 via-slate-900 to-sky-500/10 p-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">The future is built together</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Be part of the education-first platform reshaping how students study.</h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/login" className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3.5 font-medium text-white">Start studying smarter</Link>
              <Link to="/login" className="rounded-full border border-slate-700 px-6 py-3.5 font-medium text-slate-200">Become a contributor</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
