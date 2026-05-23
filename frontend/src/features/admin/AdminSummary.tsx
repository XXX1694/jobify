import { useMemo } from 'react';
import { Briefcase, Wifi, type LucideIcon } from 'lucide-react';
import type { Job } from '@/api/types';
import { titleCase } from '@/lib/format';
import { cn } from '@/lib/cn';

interface AdminSummaryProps {
  /** Jobs on the current page — all per-page figures are derived from these. */
  jobs: Job[];
  /** Board-wide total reported by the API meta, if available. */
  total: number | null;
}

export function AdminSummary({ jobs, total }: AdminSummaryProps) {
  const remoteCount = useMemo(
    () => jobs.filter((job) => job.is_remote).length,
    [jobs],
  );

  const sources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const job of jobs) {
      const key = job.source || 'unknown';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [jobs]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatTile
        icon={Briefcase}
        label="Total roles"
        value={total ?? jobs.length}
        hint="on the board"
      />
      <StatTile
        icon={Wifi}
        label="Remote"
        value={remoteCount}
        hint="on this page"
        accent
      />
      <div className="col-span-2 rounded-xl border border-line bg-surface px-4 py-3.5">
        <p className="mono-label">Sources · this page</p>
        {sources.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {sources.map(([name, count]) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-hi px-2 py-1"
              >
                <span className="text-2xs font-medium text-fg-muted">
                  {titleCase(name)}
                </span>
                <span className="font-mono text-2xs tabular-nums text-fg-faint">
                  {count}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-fg-faint">No roles to summarise</p>
        )}
      </div>
    </div>
  );
}

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: number;
  hint: string;
  accent?: boolean;
}

function StatTile({ icon: Icon, label, value, hint, accent = false }: StatTileProps) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3.5">
      <div className="flex items-center justify-between">
        <p className="mono-label">{label}</p>
        <Icon
          className={cn('size-3.5', accent ? 'text-accent-text' : 'text-fg-faint')}
        />
      </div>
      <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-fg">
        {value}
      </p>
      <p className="mt-0.5 text-2xs text-fg-faint">{hint}</p>
    </div>
  );
}
