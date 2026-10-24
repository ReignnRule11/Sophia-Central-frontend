
import { useState } from 'react';
import { Search, BookOpen, Bookmark, GraduationCap, FileText, FlaskConical, FolderOpen, Clock3, ArrowRight, Bell, SlidersHorizontal } from 'lucide-react';
import { mockResources } from '../lib/mock-data';

const categories = [
  { name: 'Lecture Notes', icon: BookOpen },
  { name: 'Past Questions', icon: FileText },
  { name: 'Research Papers', icon: FlaskConical },
  { name: 'Project Resources', icon: FolderOpen },
];

export function DashboardPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All resources');
  const [saved, setSaved] = useState<string[]>([]);

  const resources = mockResources.filter((resource) => {
    const matchesSearch = `${resource.title} ${resource.course} ${resource.topic}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === 'All resources' ||
      String(resource.type ?? '').toLowerCase().includes(activeCategory.toLowerCase()) ||
      (activeCategory === 'Lecture Notes' && String(resource.title).toLowerCase().includes('note')) ||
      (activeCategory === 'Past Questions' && String(resource.title).toLowerCase().includes('question')) ||
      (activeCategory === 'Research Papers' && String(resource.title).toLowerCase().includes('research')) ||
      (activeCategory === 'Project Resources' && String(resource.title).toLowerCase().includes('project'));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F3F5FB] text-[#101A35]">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
        <div>
          <p className="text-sm text-slate-500">Wednesday, October 21</p>
          <h1 className="mt-1 text-xl font-bold md:text-2xl">Your academic space</h1>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50">
            <Bell size={19} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3155D9] font-semibold text-white">
            S
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-7 md:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101A35] via-[#253C86] to-[#5965C9] p-6 text-white md:p-9">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-medium text-blue-200">WELCOME TO SOPHIS CENTRAL</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Less time searching.<br />More time studying.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 md:text-base">
              Find academic resources, discover research, and make your next study session count.
            </p>
            <a href="#discover" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#101A35] transition hover:bg-blue-50">
              Explore resources <ArrowRight size={17} />
            </a>
          </div>
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10" />
          <div className="pointer-events-none absolute bottom-[-100px] right-36 h-56 w-56 rounded-full bg-[#8655E8]/30 blur-3xl" />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Explore by category</h2>
              <p className="mt-1 text-sm text-slate-500">Start with the kind of resource you need.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => {
                  setActiveCategory(name);
                  document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex min-h-28 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#3155D9]/50 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EDF5] text-[#3155D9] transition group-hover:bg-[#3155D9] group-hover:text-white">
                  <Icon size={21} />
                </span>
                <span className="text-sm font-semibold">{name}</span>
              </button>
            ))}
          </div>
        </section>

        <section id="discover" className="scroll-mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Discover resources</h2>
            <p className="mt-1 text-sm text-slate-500">Search for a course, topic, or academic resource.</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-[#3155D9] focus-within:ring-2 focus-within:ring-[#3155D9]/10">
              <Search size={20} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try a course code or topic..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                aria-label="Search resources"
              />
            </div>
            <button
              onClick={() => setActiveCategory('All resources')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50"
            >
              <SlidersHorizontal size={18} /> All resources
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['All resources', ...categories.map((category) => category.name)].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? 'bg-[#3155D9] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-[#3155D9] hover:text-[#3155D9]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.length > 0 ? resources.slice(0, 6).map((resource) => (
              <article key={resource.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#3155D9]/40 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-lg bg-[#E8EDF5] px-3 py-1.5 text-xs font-semibold text-[#3155D9]">
                    {String(resource.type ?? 'Academic resource')}
                  </span>
                  <button
                    aria-label={saved.includes(String(resource.id)) ? 'Remove bookmark' : 'Save resource'}
                    onClick={() => setSaved((current) =>
                      current.includes(String(resource.id))
                        ? current.filter((id) => id !== String(resource.id))
                        : [...current, String(resource.id)]
                    )}
                    className={`rounded-lg p-2 ${saved.includes(String(resource.id)) ? 'bg-[#EEE8FF] text-[#8655E8]' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    <Bookmark size={18} fill={saved.includes(String(resource.id)) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug">{resource.title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-500">{resource.course} · {resource.topic}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><GraduationCap size={15} /> Academic resource</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> Study material</span>
                </div>
              </article>
            )) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <BookOpen className="mx-auto text-slate-400" size={32} />
                <h3 className="mt-3 font-semibold">No resources found</h3>
                <p className="mt-1 text-sm text-slate-500">Try another keyword or choose a different category.</p>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Showing sample resources for the current prototype.
          </p>
        </section>

        <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
          Sophis Central · Less time searching. More time studying.
        </footer>
      </main>
    </div>
  );
}
