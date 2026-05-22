import { cn } from '@/lib/cn';

interface LogoMarkProps {
  className?: string;
}

/** The brand mark — an open gauge arc echoing the match-ring motif. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      className={cn(
        'relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-[0.6rem] bg-gradient-to-br from-accent to-accent-deep shadow-glow-sm',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-5" fill="none" aria-hidden>
        <path
          d="M16 6.5a9.5 9.5 0 1 1-9.5 9.5"
          stroke="rgb(var(--c-accent-ink))"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="3.4" fill="rgb(var(--c-accent-ink))" />
      </svg>
    </span>
  );
}

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      {!collapsed && (
        <span className="flex items-baseline gap-px text-[1.05rem] font-semibold tracking-tight text-fg">
          Jobify
          <span className="text-accent-text">.</span>
        </span>
      )}
    </span>
  );
}
