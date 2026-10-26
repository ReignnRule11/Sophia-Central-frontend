import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';

export function ForgotPasswordPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#F5F8FC] px-4 py-10"><section className="w-full max-w-lg rounded-3xl border border-[#DCE4EF] bg-white p-7 shadow-xl sm:p-10">
    <div className="mb-8 inline-flex rounded-xl bg-white"><BrandLogo variant="full" linked={false} className="w-[190px]" /></div>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C24B3]">Account recovery</p>
    <h1 className="mt-3 text-3xl font-bold text-[#071E54]">Forgot your password?</h1>
    <p className="mt-4 text-sm leading-6 text-[#5C6982]">The password-recovery screen is now available, but Sophia Central's connected backend does not yet provide a password-reset request endpoint or email delivery. We cannot send a reset link until that backend flow is implemented.</p>
    <div role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">For now, contact the Sophia Central administrator for account recovery. Do not share your current password with anyone.</div>
    <Link to="/login" className="mt-6 inline-flex w-full justify-center rounded-xl bg-[#0B3CC1] px-4 py-3 font-semibold text-white">Back to sign in</Link>
  </section></main>;
}
