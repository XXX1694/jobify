import { STATUS_META } from '@/lib/constants';
import type { ApplicationStatus } from '@/api/types';
import { cn } from '@/lib/cn';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
  withIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = 'md',
  withIcon = true,
  className,
}: StatusBadgeProps) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        size === 'sm' ? 'h-5 px-1.5 text-2xs' : 'h-6 px-2 text-xs',
        className,
      )}
      style={{
        color: `rgb(var(${meta.tokenVar}))`,
        backgroundColor: `rgb(var(${meta.tokenVar}) / 0.12)`,
        borderColor: `rgb(var(${meta.tokenVar}) / 0.28)`,
      }}
    >
      {withIcon && <Icon className={size === 'sm' ? 'size-3' : 'size-3.5'} />}
      {meta.label}
    </span>
  );
}
