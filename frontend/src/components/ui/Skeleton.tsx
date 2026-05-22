import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
}

/** Shimmering placeholder block used while data loads. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-surface-hi/70',
        className,
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-fg/[0.07] to-transparent" />
    </div>
  );
}
