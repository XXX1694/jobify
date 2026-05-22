import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'default' | 'accent' | 'outline' | 'solid' | 'muted';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-surface-hi text-fg-muted border border-line',
  accent: 'bg-accent/12 text-accent-text border border-accent/25',
  outline: 'border border-line text-fg-muted',
  solid: 'bg-fg text-canvas border border-transparent',
  muted: 'bg-surface-hi/60 text-fg-faint border border-transparent',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-2xs font-medium leading-5',
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
