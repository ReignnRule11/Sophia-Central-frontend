import { Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDefaultWorkspacePath, getPrimaryRole, hasMultipleWorkspaces } from '../lib/account-access';

export function WorkspaceSelectionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  if (!hasMultipleWorkspaces(user)) {
    return <Navigate to={getDefaultWorkspacePath(user)} replace />;
  }

  const academicRole = getPrimaryRole(user);
  const academicLabel = academicRole === 'lecturer' ? 'Lecturer Workspace' : 'Student Workspace';
  const academicDescription = academicRole === 'lecturer'
    ? 'Your teaching dashboard, academic resources and lecturer tools.'
    : 'Your learning dashboard, academic resources, AI Tutor and student community.';
  const academicDestination = academicRole === 'lecturer' ? '/lecturer/dashboard' : '/student/dashboard';

  return (
    <main className="min-h-screen bg-[#F3F6FC] px-4 py-10 text-[#1F2937] sm:px-6">
      <section className="mx-auto w-full max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6121D0]">Sophis Central</p>
          <h1 className="mt-3 text-3xl font-bold text-[#091F5B] sm:text-4xl">Choose your workspace</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#64748B]">Your account has more than one approved workspace. Choose where you want to continue.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={() => navigate(academicDestination)} className="group rounded-2xl border border-[#DCE4EF] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#6121D0] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6121D0]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6121D0]"><GraduationCap size={24} /></span>
            <span className="mt-5 block text-lg font-bold text-[#091F5B]">{academicLabel}</span>
            <span className="mt-2 block text-sm leading-6 text-[#64748B]">{academicDescription}</span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6121D0]"><BookOpen size={16} /> Continue</span>
          </button>
          <button type="button" onClick={() => navigate('/moderation')} className="group rounded-2xl border border-[#DCE4EF] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#6121D0] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6121D0]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6121D0]"><ShieldCheck size={24} /></span>
            <span className="mt-5 block text-lg font-bold text-[#091F5B]">Academic Reviewer Workspace</span>
            <span className="mt-2 block text-sm leading-6 text-[#64748B]">Your assigned academic reviews, assessment history and reviewer tools.</span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6121D0]"><ShieldCheck size={16} /> Continue</span>
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-[#64748B]">One account · One sign-in · Separate authorized workspaces</p>
      </section>
    </main>
  );
}
