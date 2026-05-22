import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  hint?: string;
  accent?: boolean;
  loading?: boolean;
  index?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  suffix,
  hint,
  accent,
  loading,
  index = 0,
}: StatCardProps) {
  const display = useCountUp(value);

  if (loading) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5">
        <Skeleton className="h-[4.5rem] w-full" />
      </div>
    );
  }

  return (
    <div
      style={{ '--i': index } as CSSProperties}
      className="stagger rounded-2xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-line-hi"
    >
      <div className="flex items-center justify-between">
        <span className="mono-label">{label}</span>
        <span
          className={cn(
            'grid size-8 place-items-center rounded-lg border',
            accent
              ? 'border-accent/25 bg-accent/12 text-accent-text'
              : 'border-line bg-surface-hi text-fg-muted',
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p
        className={cn(
          'mt-3 font-mono text-[2rem] font-semibold leading-none tabular-nums',
          accent ? 'text-accent-text' : 'text-fg',
        )}
      >
        {Math.round(display)}
        {suffix && <span className="text-xl text-fg-faint">{suffix}</span>}
      </p>
      {hint && <p className="mt-1.5 text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}
