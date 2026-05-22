import { cn } from '@/lib/cn';
import { clamp } from '@/lib/format';

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface-hi', className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'h-full rounded-full bg-accent transition-[width] duration-700 ease-smooth',
          indicatorClassName,
        )}
        style={{ width: `${clamp(value, 0, 100)}%` }}
      />
    </div>
  );
}
