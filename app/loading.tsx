/** Shown instantly on navigation while the next page renders on the server. */
export default function Loading() {
  return (
    <div className="animate-pulse space-y-6 py-4" aria-hidden>
      <div className="h-6 w-1/3 rounded bg-muted" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}
