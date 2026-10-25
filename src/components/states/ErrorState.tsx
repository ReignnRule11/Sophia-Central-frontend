export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100">
      <p className="font-medium">Something went wrong</p>
      <p className="mt-2 text-sm text-rose-200">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-rose-500 px-3 py-2 text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
}
