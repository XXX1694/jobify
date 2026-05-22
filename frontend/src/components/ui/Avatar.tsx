import { initials } from '@/lib/format';
import { cn } from '@/lib/cn';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

const SIZES: Record<AvatarSize, string> = {
  sm: 'size-7 text-2xs',
  md: 'size-9 text-xs',
  lg: 'size-12 text-base',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-mono font-semibold uppercase',
        'bg-gradient-to-br from-accent/25 to-accent/5 text-accent-text ring-1 ring-inset ring-accent/20',
        SIZES[size],
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
