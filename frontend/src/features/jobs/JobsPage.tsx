import { useMemo, useState } from 'react';
import { Plus, SearchX, Telescope } from 'lucide-react';
import type { Job } from '@/api/types';
import { useJobs } from '@/hooks/useJobs';
import { useAuthStore } from '@/hooks/useAuthStore';
import { calculateMatch } from '@/lib/match';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';
import { JobCard } from './JobCard';
import { JobCardSkeleton } from './JobCardSkeleton';
import { JobFilters } from './JobFilters';
import { EMPTY_JOB_FILTERS, type JobFilterValue } from './filters';
import { JobFormDialog } from './JobFormDialog';

const PAGE_SIZE = 12;

type SortKey = 'recent' | 'match' | 'salary' | 'views';

const SORT_OPTIONS = [
  { value: 'recent' as const, label: 'Latest' },
  { value: 'match' as const, label: 'Match' },
  { value: 'salary' as const, label: 'Salary' },
  { value: 'views' as const, label: 'Popular' },
];

export default function JobsPage() {
  const [filters, setFilters] = useState<JobFilterValue>(EMPTY_JOB_FILTERS);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>('recent');
  const [formOpen, setFormOpen] = useState(false);

  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');
  const profile = useAuthStore((state) => state.profile);
  const userSkills = useMemo(() => profile?.skills ?? [], [profile]);

  const { data, isLoading, isError, isFetching, refetch } = useJobs({
    page,
    limit: PAGE_SIZE,
    skills: filters.skills,
    remote: filters.remote,
    salary_min: filters.salaryMin || undefined,
  });

  function updateFilters(next: JobFilterValue) {
    setFilters(next);
    setPage(1);
  }

  const visibleJobs = useMemo<Job[]>(() => {
    const items = data?.items ?? [];
    const query = filters.search.trim().toLowerCase();
    const filtered = query
      ? items.filter(
          (job) =>
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query),
        )
      : items;

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (sort) {
        case 'match':
          return (
            calculateMatch(userSkills, b.skills).percent -
            calculateMatch(userSkills, a.skills).percent
          );
        case 'salary':
          return b.salary_max - a.salary_max;
        case 'views':
          return b.views_count - a.views_count;
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });
    return sorted;
  }, [data, filters.search, sort, userSkills]);

  const hasNext = (data?.items.length ?? 0) === PAGE_SIZE;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Explore"
        title="Open roles"
        description="Curated engineering positions, scored against your skill profile."
        actions={
          isAdmin && (
            <Button variant="primary" onClick={() => setFormOpen(true)}>
              <Plus className="size-4" />
              Post a role
            </Button>
          )
        }
      />

      <JobFilters value={filters} onChange={updateFilters} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          {isLoading ? (
            'Scanning the board…'
          ) : (
            <>
              <span className="font-medium text-fg">{visibleJobs.length}</span>{' '}
              role{visibleJobs.length === 1 ? '' : 's'} on this page
            </>
          )}
        </p>
        <Segmented
          aria-label="Sort roles"
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
          size="sm"
        />
      </div>

      {isError ? (
        <div className="rounded-2xl border border-line bg-surface">
          <ErrorState onRetry={() => refetch()} />
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : visibleJobs.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState
            icon={page > 1 ? Telescope : SearchX}
            title={page > 1 ? 'End of the list' : 'No roles match those filters'}
            description={
              page > 1
                ? 'There are no more roles on this page. Step back to keep browsing.'
                : 'Loosen the stack filters or salary floor to widen the search.'
            }
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  if (page > 1) setPage(page - 1);
                  else updateFilters(EMPTY_JOB_FILTERS);
                }}
              >
                {page > 1 ? 'Previous page' : 'Reset filters'}
              </Button>
            }
          />
        </div>
      ) : (
        <div
          className={`grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${
            isFetching ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {visibleJobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
      )}

      {!isLoading && !isError && (visibleJobs.length > 0 || page > 1) && (
        <Pagination page={page} hasNext={hasNext} onPageChange={setPage} />
      )}

      {isAdmin && <JobFormDialog open={formOpen} onOpenChange={setFormOpen} />}
    </div>
  );
}
