import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/features/jobs/JobCard';
import { JobCardSkeleton } from '@/features/jobs/JobCardSkeleton';

export default function SavedJobsPage() {
  const { data, isLoading, isError, refetch } = useSavedJobs();
  const jobs = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Shortlist"
        title="Saved roles"
        description="Roles you bookmarked to revisit. Tap the bookmark again to remove one."
      />

      {isError ? (
        <div className="rounded-2xl border border-line bg-surface">
          <ErrorState onRetry={() => refetch()} />
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState
            icon={Bookmark}
            title="Nothing shortlisted yet"
            description="Tap the bookmark icon on any role to keep it here for a closer look later."
            action={
              <Button asChild variant="primary">
                <Link to="/jobs">Explore roles</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <p className="text-sm text-fg-muted">
            <span className="font-medium text-fg">{jobs.length}</span> role
            {jobs.length === 1 ? '' : 's'} shortlisted
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
