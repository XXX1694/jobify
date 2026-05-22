import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import type { Application } from '@/api/types';
import { STATUS_META } from '@/lib/constants';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatRelativeTime } from '@/lib/format';
import { Skeleton } from '@/components/ui/Skeleton';

interface RecentActivityProps {
  applications: Application[];
  loading: boolean;
}

export function RecentActivity({ applications, loading }: RecentActivityProps) {
  const recent = useMemo(
    () =>
      [...applications]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, 6),
    [applications],
  );

  return (
    <section className="rounded-2xl border border-line bg-surface">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold text-fg">Recent activity</h2>
        <p className="text-xs text-fg-muted">Latest moves across your pipeline</p>
      </div>

      {loading ? (
        <div className="divide-y divide-line">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-5 py-3.5">
              <Skeleton className="size-2 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
          <Inbox className="size-7 text-fg-faint" />
          <p className="text-sm text-fg-muted">No pipeline activity yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {recent.map((application) => {
            const meta = STATUS_META[application.status];
            return (
              <li key={application.id}>
                <Link
                  to={`/jobs/${application.job_id}`}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-hi/60"
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: `rgb(var(${meta.tokenVar}))` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">
                      {application.job?.title ?? 'Tracked role'}
                    </p>
                    <p className="truncate text-xs text-fg-faint">
                      {application.job?.company ?? 'Unknown company'} ·{' '}
                      {formatRelativeTime(application.updated_at)}
                    </p>
                  </div>
                  <StatusBadge status={application.status} size="sm" withIcon={false} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
