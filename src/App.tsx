import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { UploadPage } from './pages/UploadPage';
import { AITutorPage } from './pages/AITutorPage';
import { WalletPage } from './pages/WalletPage';
import { ModerationPage } from './pages/ModerationPage';

function LoginPage() {
  const { login } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const role = String(formData.get('role') ?? 'student') as 'student' | 'lecturer' | 'moderator' | 'admin';
    login(email, password, role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-[0_0_0_1px_rgba(167,139,250,0.18),0_32px_80px_rgba(15,23,42,0.7)] lg:grid-cols-2">
        <div className="grid-pattern flex flex-col justify-between bg-slate-950/80 p-8">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-lg font-bold text-violet-200">S</div>
              <div>
                <div className="text-lg font-semibold text-white">Sophia Central</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Study • Research • Grow</div>
              </div>
            </div>
            <h1 className="max-w-sm text-4xl font-semibold text-white">Find the right academic resources faster.</h1>
            <p className="mt-4 max-w-md text-slate-300">A centralized academic resource platform for students, lecturers, moderators, and administrators.</p>
          </div>

          <div className="mt-16 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Search by course, level, institution, and topic</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Access verified lecture notes, past questions, and research</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">Moderate submissions and support AI-guided learning</div>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Sign in</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Email</label>
                <input name="email" type="email" defaultValue="ayomide@sophia.central" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400" />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Password</label>
                <input name="password" type="password" defaultValue="sophia123" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400" />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Role</label>
                <select name="role" defaultValue="student" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400">
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/20">
              Access portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: Array<'student' | 'lecturer' | 'moderator' | 'admin'> }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'moderator' || user?.role === 'admin' ? '/moderation' : '/dashboard'} replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student', 'lecturer', 'moderator', 'admin']}><AppShell title="Dashboard"><DashboardPage /></AppShell></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute allowedRoles={['student', 'lecturer', 'moderator', 'admin']}><AppShell title="Library"><LibraryPage /></AppShell></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute allowedRoles={['student', 'lecturer', 'moderator', 'admin']}><AppShell title="Upload"><UploadPage /></AppShell></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute allowedRoles={['student', 'lecturer', 'moderator', 'admin']}><AppShell title="AI Tutor"><AITutorPage /></AppShell></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute allowedRoles={['student']}><AppShell title="Wallet"><WalletPage /></AppShell></ProtectedRoute>} />
      <Route path="/moderation" element={<ProtectedRoute allowedRoles={['moderator', 'admin']}><AppShell title="Moderation"><ModerationPage /></AppShell></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={isAuthenticated ? (user?.role === 'moderator' || user?.role === 'admin' ? '/moderation' : '/dashboard') : '/'} replace />} />
    </Routes>
  );
}
