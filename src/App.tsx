import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppShell } from './components/layout/AppShell';
import { BrandLogo } from './components/brand/BrandLogo';
import HomePage from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { UploadPage } from './pages/UploadPage';
import { AITutorPage } from './pages/AITutorPage';
import { WalletPage } from './pages/WalletPage';
import { ModerationPage } from './pages/ModerationPage';
import { LecturerDashboardPage } from './pages/LecturerDashboardPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { loginSchema, type LoginValues } from './lib/validation';
import { OnboardingPage } from './pages/OnboardingPage';
import { ResourceReaderPage } from './pages/ResourceReaderPage';

function destinationForRole(role?: string) {
  if (role === 'moderator' || role === 'admin') return '/moderation';
  if (role === 'lecturer') return '/lecturer';
  return '/dashboard';
}

function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    await login(values.email, values.password);
  };

  if (isAuthenticated && user) {
    return <Navigate to={destinationForRole(user.role)} replace />;
  }

  return (
    <main className="min-h-screen bg-[#F5F8FC] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto grid min-h-[650px] w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#DCE4EF] bg-white shadow-[0_24px_70px_rgba(7,30,84,0.12)] lg:grid-cols-2">
        <section className="brand-gradient relative flex flex-col justify-between overflow-hidden p-7 text-white sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full border-[40px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[40px] border-white/10"
          />

          <div className="relative">
            <div className="inline-flex rounded-xl bg-white p-2">
              <BrandLogo
                variant="full"
                linked={false}
                className="w-[190px]"
              />
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
              Study · Research · Grow
            </p>

            <h1 className="mt-4 max-w-lg text-4xl font-bold leading-tight sm:text-5xl">
              Your academic journey starts here.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-blue-50">
              Discover academic resources, organise your studies, and get
              AI-guided support throughout your learning journey.
            </p>
          </div>

          <div className="relative mt-12 space-y-3">
            {[
              'Find relevant notes and past questions',
              'Discover and share academic resources',
              'Learn with AI-guided study support',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-white backdrop-blur-sm"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20"
                >
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C24B3]">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#071E54] sm:text-4xl">
                Sign in to Sophia
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5C6982]">
                Continue your learning journey from where you left off.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-[#071E54]"
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'login-email-error' : undefined
                  }
                  className="brand-input"
                />

                {errors.email && (
                  <p
                    id="login-email-error"
                    className="mt-1 text-sm text-rose-600"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-medium text-[#071E54]"
                >
                  Password
                </label>

                <input
                  id="login-password"
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'login-password-error' : undefined
                  }
                  className="brand-input"
                />

                {errors.password && (
                  <p
                    id="login-password-error"
                    className="mt-1 text-sm text-rose-600"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="brand-button w-full px-4 py-3 font-semibold shadow-lg shadow-blue-900/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>

              <p className="text-center text-sm text-[#5C6982]">
                New to Sophia Central?{' '}
                <Link
                  to="/onboarding"
                  className="font-semibold text-[#0B3CC1] transition-colors hover:text-[#6C24B3]"
                >
                  Create an account
                </Link>
              </p>
            </form>

            <div className="mt-8 border-t border-[#DCE4EF] pt-5 text-center">
              <p className="text-xs text-[#71809A]">
                Sophia Central · Your academic journey, organised.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={destinationForRole(user?.role)}
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              <Navigate
                to={destinationForRole(user?.role)}
                replace
              />
            ) : (
              <OnboardingPage />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={['student', 'lecturer', 'moderator', 'admin']}
            >
              <AppShell title="Dashboard">
                <DashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lecturer"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <AppShell title="Lecturer Dashboard">
                <LecturerDashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute
              allowedRoles={['student', 'lecturer', 'moderator', 'admin']}
            >
              <AppShell title="Library">
                <LibraryPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resource/:id"
          element={
            <ProtectedRoute allowedRoles={['student', 'lecturer', 'moderator', 'admin']}>
              <AppShell title="Resource Reader">
                <ResourceReaderPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <AppShell title="Upload">
                <UploadPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai"
          element={
            <ProtectedRoute
              allowedRoles={['student', 'lecturer', 'moderator', 'admin']}
            >
              <AppShell title="AI Tutor">
                <AITutorPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <AppShell title="Wallet">
                <WalletPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderation"
          element={
            <ProtectedRoute allowedRoles={['moderator', 'admin']}>
              <AppShell title="Moderation">
                <ModerationPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppShell title="Admin Analytics">
                <AdminAnalyticsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? destinationForRole(user?.role)
                  : '/login'
              }
              replace
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}