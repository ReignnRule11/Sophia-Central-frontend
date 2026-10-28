import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { academicApi, type CourseOption, type InstitutionOption } from '../api/academic';
import { useAuth } from '../context/AuthContext';

const levels = ['100', '200', '300', '400', '500', '600', 'Postgraduate'];
type Step = 1 | 2 | 3 | 4;

export function ProfileOnboardingPage() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [step, setStep] = useState<Step>(1);
  const [institutionId, setInstitutionId] = useState('');
  const [institutionManual, setInstitutionManual] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [facultyManual, setFacultyManual] = useState('');
  const [department, setDepartment] = useState('');
  const [departmentManual, setDepartmentManual] = useState('');
  const [programme, setProgramme] = useState('');
  const [studyLevel, setStudyLevel] = useState('');
  const [coursesTaught, setCoursesTaught] = useState<string[]>([]);
  const [courseInput, setCourseInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isLecturer = user?.role === 'lecturer';
  const totalSteps = isLecturer ? 4 : 3;
  const selectedInstitution = useMemo(() => institutions.find((item) => item.id === institutionId), [institutions, institutionId]);
  const selectedFaculty = selectedInstitution?.faculties?.find((item) => item.id === facultyId);
  const departments = selectedFaculty?.departments ?? [];
  const useManualInstitution = institutionId === '__manual__';
  const useManualFaculty = facultyId === '__manual__' || (Boolean(institutionId) && !useManualInstitution && (selectedInstitution?.faculties?.length ?? 0) === 0);
  const useManualDepartment = useManualFaculty || (Boolean(facultyId) && departments.length === 0);

  useEffect(() => {
    let active = true;
    academicApi.institutions().then((data) => { if (active) setInstitutions(Array.isArray(data) ? data : []); }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Unable to load institutions.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!institutionId || institutionId === '__manual__' || !isLecturer) { setCourses([]); return; }
    let active = true;
    academicApi.courses(institutionId).then((data) => { if (active) setCourses(Array.isArray(data) ? data : []); }).catch(() => { if (active) setCourses([]); });
    return () => { active = false; };
  }, [institutionId, isLecturer]);

  const institutionName = useManualInstitution ? institutionManual.trim() : selectedInstitution?.name ?? '';
  const facultyName = useManualFaculty ? facultyManual.trim() : selectedFaculty?.name ?? '';
  const canContinue = () => {
    if (step === 1) return useManualInstitution ? Boolean(institutionManual.trim()) : Boolean(institutionId);
    if (step === 2) return Boolean((useManualFaculty ? facultyManual.trim() : facultyId) && (department === '__manual__' ? departmentManual.trim() : department.trim()));
    if (isLecturer) return step === 3 ? coursesTaught.length > 0 : step === 4;
    return Boolean(programme.trim() && studyLevel);
  };
  const addCourse = (value: string) => { const clean = value.trim(); if (!clean || coursesTaught.includes(clean)) return; setCoursesTaught((current) => [...current, clean]); setCourseInput(''); };

  const save = async () => {
    if (!canContinue()) return;
    setSaving(true); setError('');
    try {
      await completeOnboarding({ institution: institutionName, faculty: facultyName, department: department === '__manual__' ? departmentManual.trim() : department.trim(), programme: isLecturer ? undefined : programme.trim(), studyLevel: isLecturer ? undefined : studyLevel, coursesTaught: isLecturer ? coursesTaught : undefined });
      navigate(isLecturer ? '/lecturer' : '/dashboard', { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save your academic profile.');
    } finally { setSaving(false); }
  };

  if (!user) return null;
  return <main className="min-h-screen bg-white px-4 py-8 text-[#091F5B] sm:px-6 lg:py-12">
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.24em] text-[#2C36D9]">Sophia Central · Academic setup</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{isLecturer ? 'Set up your lecturer profile' : 'Set up your student profile'}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#5C6982]">Complete your academic profile so Sophia can personalise your resource discovery and study experience.</p></div><div className="rounded-full border border-[#D7DEEA] bg-[#F3F6FC] px-3 py-1 text-xs font-semibold text-[#2C36D9]">{isLecturer ? 'Lecturer' : 'Student'}</div></div>
      <div className="mb-6 flex gap-2" aria-label="Onboarding progress">{Array.from({ length: totalSteps }, (_, index) => index + 1).map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-[#6121D0]' : 'bg-[#E8ECF3]'}`} />)}</div>
      <section className="rounded-3xl border border-[#DCE4EF] bg-white p-5 shadow-[0_20px_60px_rgba(9,31,91,0.08)] sm:p-8">
        {loading ? <p className="text-[#5C6982]">Loading institutions…</p> : error && !institutions.length ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : <>
          {step === 1 && <div className="space-y-5"><div><p className="text-xs uppercase tracking-[0.18em] text-[#6121D0]">Step 1</p><h2 className="mt-2 text-2xl font-semibold">Institution {isLecturer ? 'select / verify' : 'selection'}</h2><p className="mt-2 text-sm text-[#5C6982]">Choose the institution that anchors your academic identity.</p></div><select value={institutionId} onChange={(event) => { setInstitutionId(event.target.value); setFacultyId(''); setDepartment(''); }} className="brand-input w-full" aria-label="Institution"><option value="">Select institution</option>{institutions.map((item) => <option key={item.id} value={item.id}>{item.name}{item.city ? ` · ${item.city}` : ''}</option>)}<option value="__manual__">My institution is not listed</option></select>{useManualInstitution && <input value={institutionManual} onChange={(event) => setInstitutionManual(event.target.value)} placeholder="Enter institution name" className="brand-input w-full" aria-label="Institution name" />}{!institutions.length && <p className="text-sm text-[#5C6982]">No institutions were returned by the catalogue. Enter your institution manually to continue.</p>}</div>}
          {step === 2 && <div className="space-y-5"><div><p className="text-xs uppercase tracking-[0.18em] text-[#6121D0]">Step 2</p><h2 className="mt-2 text-2xl font-semibold">Faculty & department</h2><p className="mt-2 text-sm text-[#5C6982]">Select your faculty first; the department list follows the selected faculty.</p></div><select value={facultyId} onChange={(event) => { setFacultyId(event.target.value); setFacultyManual(''); setDepartment(''); setDepartmentManual(''); }} className="brand-input w-full" aria-label="Faculty"><option value="">Select faculty</option>{(selectedInstitution?.faculties ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}<option value="__manual__">My faculty is not listed</option></select>{useManualFaculty && <input value={facultyManual} onChange={(event) => setFacultyManual(event.target.value)} placeholder="Enter faculty name" className="brand-input w-full" aria-label="Faculty name" />}{useManualDepartment ? <input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Enter department name" className="brand-input w-full" aria-label="Department name" /> : <select value={department} onChange={(event) => { setDepartment(event.target.value); setDepartmentManual(''); }} disabled={!facultyId} className="brand-input w-full disabled:opacity-50" aria-label="Department"><option value="">Select department</option>{departments.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}<option value="__manual__">My department is not listed</option></select>}{department === '__manual__' && <input value={departmentManual} onChange={(event) => setDepartmentManual(event.target.value)} placeholder="Enter department name" className="brand-input w-full" aria-label="Department name" />}</div>}
          {!isLecturer && step === 3 && <div className="space-y-5"><div><p className="text-xs uppercase tracking-[0.18em] text-[#6121D0]">Step 3</p><h2 className="mt-2 text-2xl font-semibold">Programme & level</h2><p className="mt-2 text-sm text-[#5C6982]">Tell Sophia what you are studying so resource discovery can be scoped correctly.</p></div><input value={programme} onChange={(event) => setProgramme(event.target.value)} placeholder="e.g. Computer Engineering" className="brand-input w-full" aria-label="Programme" /><select value={studyLevel} onChange={(event) => setStudyLevel(event.target.value)} className="brand-input w-full" aria-label="Level"><option value="">Select level</option>{levels.map((level) => <option key={level} value={level}>{level}</option>)}</select></div>}
          {isLecturer && step === 3 && <div className="space-y-5"><div><p className="text-xs uppercase tracking-[0.18em] text-[#6121D0]">Step 3</p><h2 className="mt-2 text-2xl font-semibold">Courses taught</h2><p className="mt-2 text-sm text-[#5C6982]">Select available courses or add a course manually if it is not in the catalogue.</p></div>{courses.length > 0 && <select onChange={(event) => { if (event.target.value) addCourse(event.target.value); }} className="brand-input w-full" aria-label="Course catalogue"><option value="">Add a course from the catalogue</option>{courses.map((course) => <option key={course.id} value={course.code ? `${course.code} — ${course.title}` : course.title}>{course.code ? `${course.code} — ${course.title}` : course.title}</option>)}</select>}<div className="flex gap-2"><input value={courseInput} onChange={(event) => setCourseInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCourse(courseInput); } }} placeholder="e.g. CSC 301 — Data Structures" className="brand-input min-w-0 flex-1" /><button type="button" onClick={() => addCourse(courseInput)} className="rounded-xl bg-[#6121D0] px-4 py-3 font-semibold text-white transition hover:bg-[#2C36D9]">Add</button></div><div className="flex flex-wrap gap-2">{coursesTaught.map((course) => <button key={course} type="button" onClick={() => setCoursesTaught((current) => current.filter((item) => item !== course))} className="rounded-full border border-[#E1D3F5] bg-[#F7F1FF] px-3 py-1.5 text-sm text-[#6121D0]">{course} ×</button>)}</div></div>}
          {isLecturer && step === 4 && <div className="space-y-5"><div><p className="text-xs uppercase tracking-[0.18em] text-[#6121D0]">Step 4</p><h2 className="mt-2 text-2xl font-semibold">Verify your academic identity</h2><p className="mt-2 text-sm text-[#5C6982]">Review the institution, faculty, department and courses that will appear on your lecturer profile.</p></div><div className="grid gap-3 sm:grid-cols-2">{[['Institution', institutionName], ['Faculty', facultyName], ['Department', department === '__manual__' ? departmentManual : department], ['Courses taught', coursesTaught.join(', ') || 'None']].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#DCE4EF] bg-[#F8FAFD] p-4"><div className="text-xs uppercase tracking-[0.16em] text-[#71809A]">{label}</div><div className="mt-2 text-sm font-medium text-[#091F5B]">{value}</div></div>)}</div></div>}
          {error && <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep((current) => Math.max(1, current - 1) as Step)} disabled={step === 1 || saving} className="rounded-xl border border-[#D7DEEA] px-5 py-3 font-medium text-[#091F5B] disabled:opacity-40">Back</button>{step < totalSteps ? <button type="button" onClick={() => canContinue() && setStep((current) => Math.min(totalSteps, current + 1) as Step)} disabled={!canContinue() || saving} className="rounded-xl bg-[#6121D0] px-5 py-3 font-semibold text-white transition hover:bg-[#2C36D9] disabled:cursor-not-allowed disabled:opacity-40">Continue</button> : <button type="button" onClick={() => void save()} disabled={!canContinue() || saving} className="rounded-xl bg-[#6121D0] px-5 py-3 font-semibold text-white transition hover:bg-[#2C36D9] disabled:cursor-not-allowed disabled:opacity-40">{saving ? 'Saving profile…' : isLecturer ? 'Enter lecturer dashboard' : 'Enter student dashboard'}</button>}</div>
        </>}
      </section>
    </div>
  </main>;
}
