import { motion } from 'framer-motion';
import { matchTier } from '@/lib/match';
import { cn } from '@/lib/cn';

interface MatchBarProps {
  percent: number;
  className?: string;
  showLabel?: boolean;
}

export function MatchBar({ percent, className, showLabel = true }: MatchBarProps) {
  const safe = Math.max(0, Math.min(100, Math.round(percent || 0)));
  const tier = matchTier(safe);

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hi">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: tier.color }}
          initial={{ width: 0 }}
          animate={{ width: `${safe}%` }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right font-mono text-2xs font-medium tabular-nums text-fg-muted">
          {safe}%
        </span>
      )}
    </div>
  );
}
