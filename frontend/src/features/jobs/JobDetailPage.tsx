import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Briefcase,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Wifi,
} from 'lucide-react';
import { ApiError } from '@/api/client';
import { useJob } from '@/hooks/useJobs';
import { useDeleteJob } from '@/hooks/useJobs';
import { useSavedJobIds, useToggleSavedJob } from '@/hooks/useSavedJobs';
import { useApplicationsByJob, useCreateApplication } from '@/hooks/useApplications';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  formatCompactNumber,
  formatDate,
  formatSalaryRange,
  htmlToPlainText,
  titleCase,
} from '@/lib/format';
import { matchTier } from '@/lib/match';
import { MatchRing } from '@/components/common/MatchRing';
import { SkillTag } from '@/components/common/SkillTag';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ErrorState } from '@/components/common/ErrorState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { JobFormDialog } from './JobFormDialog';
import { cn } from '@/lib/cn';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading, isError, error, refetch } = useJob(id);

  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');
  const profile = useAuthStore((state) => state.profile);
  const hasSkills = (profile?.skills?.length ?? 0) > 0;

  const savedIds = useSavedJobIds();
  const toggleSaved = useToggleSavedJob();
  const trackedByJob = useApplicationsByJob();
  const createApplication = useCreateApplication();
  const deleteJob = useDeleteJob();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <JobDetailSkeleton />;

  if (isError || !job) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="rounded-2xl border border-line bg-surface">
          <ErrorState
            title={notFound ? 'This role has closed' : 'Could not load this role'}
            description={
              notFound
                ? 'The opening you followed is no longer on the board.'
                : 'The API did not return this role. Try again in a moment.'
            }
            onRetry={notFound ? undefined : () => refetch()}
          />
        </div>
      </div>
    );
  }

  const saved = savedIds.has(job.id);
  const application = trackedByJob.get(job.id);
  const tier = matchTier(job.match_percent);

  return (
    <div className="space-y-6">
      <BackLink />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-surface-hi font-mono text-lg font-semibold text-fg-muted">
                {job.company.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg-muted">{job.company}</p>
                <p className="font-mono text-2xs uppercase tracking-[0.12em] text-fg-faint">
                  {job.source === 'manual' ? 'Posted on Jobify' : `via ${titleCase(job.source)}`}
                </p>
              </div>
            </div>
            <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-fg sm:text-[1.7rem]">
              {job.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-fg-muted">
              <span className="flex items-center gap-1.5">
                {job.is_remote ? (
                  <>
                    <Wifi className="size-3.5" />
                    Remote{job.location ? ` · ${job.location}` : ''}
                  </>
                ) : (
                  <>
                    <MapPin className="size-3.5" />
                    {job.location || 'On-site'}
                  </>
                )}
              </span>
              {job.job_type && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="size-3.5" />
                  {titleCase(job.job_type)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {formatDate(job.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="size-3.5" />
                {formatCompactNumber(job.views_count)} views
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
            <MatchRing
              percent={job.match_percent}
              size={104}
              strokeWidth={8}
              caption="match"
            />
            <span
              className="rounded-md px-2 py-0.5 text-2xs font-medium"
              style={{
                color: tier.color,
                backgroundColor: 'rgb(var(--c-surface-hi))',
              }}
            >
              {tier.label}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-elevated/40 px-6 py-4 sm:px-7">
          {application ? (
            <Button asChild variant="secondary">
              <Link to="/applications">
                <StatusBadge status={application.status} withIcon />
                In your pipeline
              </Link>
            </Button>
          ) : (
            <Button
              variant="primary"
              loading={createApplication.isPending}
              onClick={() =>
                createApplication.mutate({ jobId: job.id, note: '' })
              }
            >
              <Plus className="size-4" />
              Track this role
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => toggleSaved.mutate({ job, saved })}
            className={cn(saved && 'border-accent/30 text-accent-text')}
          >
            <Bookmark className={cn('size-4', saved && 'fill-current')} />
            {saved ? 'Shortlisted' : 'Shortlist'}
          </Button>
          {job.url && (
            <Button asChild variant="ghost">
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                Apply on company site
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          )}
          {isAdmin && (
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} aria-label="Edit role">
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteOpen(true)}
                aria-label="Delete role"
                className="text-danger hover:bg-danger/10"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-surface p-6">
            <div className="mb-4 flex items-center gap-2">
              <Target className="size-4 text-accent-text" />
              <h2 className="text-sm font-semibold text-fg">Skill match breakdown</h2>
            </div>
            {hasSkills ? (
              <div className="space-y-5">
                <div>
                  <p className="mono-label mb-2">
                    In your stack · {job.matched_skills.length}
                  </p>
                  {job.matched_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {job.matched_skills.map((skill) => (
                        <SkillTag key={skill} label={skill} variant="matched" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-fg-muted">
                      None of this role&rsquo;s skills are on your profile yet.
                    </p>
                  )}
                </div>
                <div>
                  <p className="mono-label mb-2">
                    Worth picking up · {job.missing_skills.length}
                  </p>
                  {job.missing_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {job.missing_skills.map((skill) => (
                        <SkillTag key={skill} label={skill} variant="missing" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-fg-muted">
                      You cover every skill this role asks for. 🎯
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-line bg-canvas p-5">
                <div className="flex items-center gap-2 text-sm text-fg">
                  <Sparkles className="size-4 text-accent-text" />
                  Add your skills to unlock match scoring
                </div>
                <p className="text-sm text-fg-muted">
                  Jobify scores roles against your profile. Add a few skills and
                  every role gets a personalised fit score.
                </p>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/profile">Complete your profile</Link>
                </Button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="mb-3 text-sm font-semibold text-fg">About the role</h2>
            <div className="whitespace-pre-line text-sm leading-relaxed text-fg-muted">
              {htmlToPlainText(job.description) ||
                'No description was provided for this role.'}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="mb-4 text-sm font-semibold text-fg">Snapshot</h2>
            <dl className="space-y-3.5">
              <SnapshotRow label="Compensation">
                {formatSalaryRange(job.salary_min, job.salary_max)}
              </SnapshotRow>
              <SnapshotRow label="Arrangement">
                {job.is_remote ? 'Remote-friendly' : 'On-site'}
              </SnapshotRow>
              <SnapshotRow label="Location">{job.location || '—'}</SnapshotRow>
              {job.job_type && (
                <SnapshotRow label="Employment">{titleCase(job.job_type)}</SnapshotRow>
              )}
              <SnapshotRow label="Posted">{formatDate(job.created_at)}</SnapshotRow>
              <SnapshotRow label="Source">{titleCase(job.source)}</SnapshotRow>
            </dl>
          </div>

          {job.skills.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="mono-label mb-3">Full stack · {job.skills.length}</p>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <SkillTag key={skill} label={skill} size="sm" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {isAdmin && (
        <>
          <JobFormDialog open={editOpen} onOpenChange={setEditOpen} job={job} />
          <ConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Delete this role?"
            description={`"${job.title}" will be removed from the Jobify board. This cannot be undone.`}
            confirmLabel="Delete role"
            destructive
            loading={deleteJob.isPending}
            onConfirm={() =>
              deleteJob.mutate(job.id, {
                onSuccess: () => {
                  setDeleteOpen(false);
                  navigate('/jobs');
                },
              })
            }
          />
        </>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/jobs"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
    >
      <ArrowLeft className="size-4" />
      Back to Explore
    </Link>
  );
}

function SnapshotRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-sm text-fg-faint">{label}</dt>
      <dd className="text-right text-sm font-medium text-fg">{children}</dd>
    </div>
  );
}

function JobDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="rounded-2xl border border-line bg-surface p-7">
        <div className="flex justify-between gap-6">
          <div className="flex-1 space-y-3">
            <Skeleton className="size-12 rounded-xl" />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="size-[104px] rounded-full" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
