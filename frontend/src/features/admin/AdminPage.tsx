import { useMemo, useState } from 'react';
import { Inbox, Plus, Search, SearchX } from 'lucide-react';
import type { Job } from '@/api/types';
import { useDeleteJob, useJobs } from '@/hooks/useJobs';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { JobFormDialog } from '@/features/jobs/JobFormDialog';
import { AdminSummary } from './AdminSummary';
import { AdminJobsTable, AdminJobsTableSkeleton } from './AdminJobsTable';

const PAGE_SIZE = 15;

export default function AdminPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formJob, setFormJob] = useState<Job | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useJobs({
    page,
    limit: PAGE_SIZE,
  });
  const deleteJob = useDeleteJob();

  const items = useMemo<Job[]>(() => data?.items ?? [], [data]);
  const meta = data?.meta ?? null;

  const query = search.trim();
  const visible = useMemo<Job[]>(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q),
    );
  }, [items, query]);

  function openCreate() {
    setFormJob(null);
    setFormOpen(true);
  }

  function openEdit(job: Job) {
    setFormJob(job);
    setFormOpen(true);
  }

  function openDelete(job: Job) {
    setDeleteTarget(job);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteJob.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Role management"
        description="Publish, edit and retire roles on the Jobify board."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus className="size-4" />
            Post a role
          </Button>
        }
      />

      {!isLoading && !isError && items.length > 0 && (
        <AdminSummary jobs={items} total={meta?.total ?? null} />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          icon={<Search />}
          placeholder="Search this page by title or company…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full sm:w-80"
          aria-label="Search roles on this page"
        />
        {!isLoading && !isError && (
          <p className="text-sm text-fg-muted">
            {query ? (
              <>
                <span className="font-medium text-fg">{visible.length}</span> of{' '}
                {items.length} match
              </>
            ) : (
              <>
                <span className="font-medium text-fg">{items.length}</span> role
                {items.length === 1 ? '' : 's'} on this page
              </>
            )}
          </p>
        )}
      </div>

      {isError ? (
        <div className="rounded-2xl border border-line bg-surface">
          <ErrorState onRetry={() => refetch()} />
        </div>
      ) : isLoading ? (
        <AdminJobsTableSkeleton />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState
            icon={Inbox}
            title={page > 1 ? 'Nothing on this page' : 'No roles yet'}
            description={
              page > 1
                ? 'This page is empty. Step back to keep reviewing roles.'
                : 'The board is empty. Publish the first role to get started.'
            }
            action={
              page > 1 ? (
                <Button
                  variant="secondary"
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous page
                </Button>
              ) : (
                <Button variant="primary" onClick={openCreate}>
                  <Plus className="size-4" />
                  Post a role
                </Button>
              )
            }
          />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState
            icon={SearchX}
            title="No roles match your search"
            description={`Nothing on this page matches "${query}". Try another term or clear the search.`}
            action={
              <Button variant="secondary" onClick={() => setSearch('')}>
                Clear search
              </Button>
            }
          />
        </div>
      ) : (
        <div
          className={`transition-opacity ${
            isFetching ? 'opacity-60' : 'opacity-100'
          }`}
        >
          <AdminJobsTable
            jobs={visible}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </div>
      )}

      {!isLoading && !isError && meta && meta.pages > 1 && (
        <Pagination
          page={page}
          hasNext={page < meta.pages}
          totalPages={meta.pages}
          onPageChange={setPage}
        />
      )}

      <JobFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        job={formJob ?? undefined}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this role?"
        description={
          deleteTarget ? (
            <>
              <span className="font-medium text-fg">{deleteTarget.title}</span>{' '}
              will be removed from the Jobify board. This can&rsquo;t be undone.
            </>
          ) : undefined
        }
        confirmLabel="Delete role"
        destructive
        loading={deleteJob.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
