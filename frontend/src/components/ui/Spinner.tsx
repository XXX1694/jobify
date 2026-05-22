import { cn } from '@/lib/cn';

interface SpinnerProps {
  className?: string;
}

/** Minimal currentColor border spinner — sizes via font-size/width classes. */
export function Spinner({ className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em]',
        className,
      )}
    />
  );
}
