import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface KbdProps {
  children: ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-line bg-surface-hi px-1 font-mono text-[0.65rem] font-medium text-fg-muted',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
