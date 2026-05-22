import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Telescope } from 'lucide-react';
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/api/types';
import { STATUS_META } from '@/lib/constants';
import { useApplications } from '@/hooks/useApplications';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { KanbanBoard } from './KanbanBoard';

export default function ApplicationsPage() {
  const { data, isLoading, isError, refetch } = useApplications();
  const applications = useMemo(() => data ?? [], [data]);

  const counts = useMemo(() => {
    const tally: Record<ApplicationStatus, number> = {
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    for (const application of applications) tally[application.status] += 1;
    return tally;
  }, [applications]);

  const hasApplications = applications.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Application tracker"
        description="Drag a card between stages to move a role through your funnel."
        actions={
          <Button asChild variant="secondary">
            <Link to="/jobs">
              <Telescope className="size-4" />
              Find roles
            </Link>
          </Button>
        }
      />

      {hasApplications && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {APPLICATION_STATUSES.map((status) => {
            const meta = STATUS_META[status];
            return (
              <div
                key={status}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3"
              >
                <span
                  className="font-mono text-2xl font-semibold tabular-nums text-fg"
                >
                  {counts[status]}
                </span>
                <span className="flex flex-col">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-fg">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: `rgb(var(${meta.tokenVar}))` }}
                    />
                    {meta.label}
                  </span>
                  <span className="text-2xs text-fg-faint">{meta.blurb}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {isError ? (
        <div className="rounded-2xl border border-line bg-surface">
          <ErrorState onRetry={() => refetch()} />
        </div>
      ) : isLoading ? (
        <BoardSkeleton />
      ) : !hasApplications ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState
            icon={Telescope}
            title="Your pipeline is empty"
            description="Track a role from Explore and it lands here. Then drag it between stages as your hunt progresses."
            action={
              <Button asChild variant="primary">
                <Link to="/jobs">Browse open roles</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <KanbanBoard applications={applications} />
      )}
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, columnIndex) => (
        <div key={columnIndex} className="w-[16.5rem] shrink-0 space-y-2.5">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2.5 rounded-2xl border border-dashed border-line p-2.5">
            {Array.from({ length: columnIndex === 0 ? 3 : 2 }).map((_, cardIndex) => (
              <Skeleton key={cardIndex} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
