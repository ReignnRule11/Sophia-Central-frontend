export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
      <div className="animate-pulse">{message}</div>
    </div>
  );
}
