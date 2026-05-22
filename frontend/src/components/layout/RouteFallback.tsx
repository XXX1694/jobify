import { Spinner } from '@/components/ui/Spinner';

/** Suspense fallback shown while a lazily-loaded route chunk arrives. */
export function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Spinner className="size-6 text-accent-text" />
      <span className="mono-label">Loading view</span>
    </div>
  );
}
