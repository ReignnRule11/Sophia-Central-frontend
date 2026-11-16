import { ArrowLeft, ArrowUpRight, Globe2, Mail, MessageCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';
import { publicContactEmails } from '../config/publicContact';

export function CommunityPage() {
  const generalEmail = publicContactEmails.general;

  return (
    <main className="min-h-screen bg-[#F6F8FC] text-[#1F2937]">
      <header className="border-b border-[#E4EAF5] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <BrandLogo variant="full" tone="dark" />
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-[#DCE4EF] px-3.5 py-2.5 text-sm font-semibold text-[#334155] transition hover:border-[#B9C8F5] hover:bg-[#F3F6FC]">
            <ArrowLeft size={16} /> Back to Sophis Central
          </Link>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#091F5B] via-[#2C36D9] to-[#6121D0] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white/90">
            <Globe2 size={15} /> BEYOND CAMPUS, CONNECTED
          </span>
          <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">The Sophis Central Community</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#E5E7EB] sm:text-lg">
            A shared space for everyone interested in learning, research and academic collaboration—wherever you study, teach or live.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <article className="rounded-3xl border border-[#E1E7F0] bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-2xl bg-[#F0EBFF] p-3 text-[#6121D0]"><Users size={24} /></span>
          <h2 className="mt-5 text-2xl font-bold text-[#091F5B]">One community, many academic journeys.</h2>
          <p className="mt-4 text-sm leading-7 text-[#5C6982]">
            Sophis Central is for students, lecturers, researchers, graduates and supporters of education. You do not need to belong to a particular institution, faculty, department, country, region or level to be part of the wider community.
          </p>
          <p className="mt-3 text-sm leading-7 text-[#5C6982]">
            Follow our official channels and stay connected as the community grows.
          </p>
        </article>

        <article className="rounded-3xl border border-[#E1E7F0] bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-2xl bg-[#EAF1FF] p-3 text-[#004BEC]"><MessageCircle size={24} /></span>
          <h2 className="mt-5 text-2xl font-bold text-[#091F5B]">Connect with Sophis Central</h2>
          <p className="mt-3 text-sm leading-7 text-[#5C6982]">
            For general enquiries, partnership conversations or information about joining the wider community, reach us by email.
          </p>
          <a href={`mailto:${generalEmail}?subject=${encodeURIComponent('Sophis Central Community')}`} className="mt-6 inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-[#DCE4EF] bg-[#F8FAFF] px-4 py-4 text-left transition hover:border-[#B9C8F5] hover:bg-[#F3F6FC]">
            <span className="flex min-w-0 items-center gap-3">
              <span className="rounded-xl bg-white p-2.5 text-[#6121D0] shadow-sm"><Mail size={19} /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-wide text-[#71809A]">General enquiries</span><span className="mt-1 block break-all text-sm font-semibold text-[#091F5B]">{generalEmail}</span></span>
            </span>
            <ArrowUpRight size={18} className="shrink-0 text-[#6121D0]" />
          </a>
          <p className="mt-4 text-xs leading-6 text-[#8995A8]">Official social profile and community invitation links will be added here once confirmed.</p>
        </article>
      </section>

      <footer className="border-t border-[#E1E7F0] bg-white px-4 py-6 text-center text-xs text-[#71809A]">
        © {new Date().getFullYear()} Sophis Central. All rights reserved.
      </footer>
    </main>
  );
}
