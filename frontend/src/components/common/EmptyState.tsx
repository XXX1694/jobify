import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-accent/10 blur-2xl" />
        <div className="grain-overlay grid size-[4.5rem] place-items-center rounded-2xl border border-line bg-gradient-to-br from-surface-hi to-surface">
          <Icon className="size-7 text-accent-text" strokeWidth={1.5} />
        </div>
        <span className="absolute -right-1.5 -top-1.5 size-2.5 rounded-full bg-accent shadow-glow-sm" />
        <span className="absolute -bottom-1 -left-2 size-1.5 rounded-full bg-accent/40" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-fg">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
