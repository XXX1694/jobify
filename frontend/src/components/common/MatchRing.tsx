import { useId } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { matchTier } from '@/lib/match';
import { cn } from '@/lib/cn';

interface MatchRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  caption?: string;
  className?: string;
}

/**
 * The signature motif — a circular gauge of how well a role fits the user's
 * skills. Low fit reads muted grey, fair reads amber, strong/excellent glow lime.
 */
export function MatchRing({
  percent,
  size = 64,
  strokeWidth = 5,
  showValue = true,
  caption,
  className,
}: MatchRingProps) {
  const safe = Math.max(0, Math.min(100, Math.round(percent || 0)));
  const tier = matchTier(safe);
  const gradientId = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const display = useCountUp(safe, 1.15);
  const usesGradient = tier.tier === 'strong' || tier.tier === 'excellent';

  return (
    <div
      className={cn('relative grid shrink-0 place-items-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${safe}% skill match`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--c-accent))" />
            <stop offset="100%" stopColor="rgb(var(--c-accent-deep))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--c-line))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={usesGradient ? `url(#${gradientId})` : tier.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * safe) / 100 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          style={
            usesGradient
              ? { filter: 'drop-shadow(0 0 5px rgb(var(--c-accent) / 0.55))' }
              : undefined
          }
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-semibold leading-none tracking-tight text-fg tabular-nums"
            style={{ fontSize: size * 0.3 }}
          >
            {Math.round(display)}
            <span className="text-fg-faint" style={{ fontSize: size * 0.16 }}>
              %
            </span>
          </span>
          {caption && (
            <span
              className="mt-1 font-mono uppercase tracking-[0.16em] text-fg-faint"
              style={{ fontSize: Math.max(8, size * 0.1) }}
            >
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
