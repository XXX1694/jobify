import { Link } from 'react-router-dom';
import { Eye, MapPin, Pencil, Trash2, Wifi } from 'lucide-react';
import type { Job } from '@/api/types';
import { formatCompactNumber, formatDate, formatSalaryRange } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { SkillTag } from '@/components/common/SkillTag';

interface AdminJobsTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const TH = 'mono-label whitespace-nowrap px-4 py-3 text-left font-medium';

export function AdminJobsTable({ jobs, onEdit, onDelete }: AdminJobsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-hi/40">
              <th className={TH}>Role</th>
              <th className={`${TH} hidden lg:table-cell`}>Stack</th>
              <th className={`${TH} hidden sm:table-cell`}>Salary</th>
              <th className={`${TH} hidden md:table-cell`}>Location</th>
              <th className={`${TH} hidden xl:table-cell`}>Views</th>
              <th className={`${TH} hidden lg:table-cell`}>Posted</th>
              <th className={`${TH} text-right`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface JobRowProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

function JobRow({ job, onEdit, onDelete }: JobRowProps) {
  const visibleSkills = job.skills.slice(0, 3);
  const extraSkills = job.skills.length - visibleSkills.length;

  return (
    <tr className="border-b border-line/60 transition-colors last:border-0 hover:bg-surface-hi/40">
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-hi font-mono text-sm font-semibold text-fg-muted">
            {job.company.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="block max-w-[16rem] truncate font-medium text-fg transition-colors hover:text-accent-text"
            >
              {job.title}
            </Link>
            <p className="truncate text-xs text-fg-muted">{job.company}</p>
          </div>
        </div>
      </td>

      <td className="hidden px-4 py-3 lg:table-cell">
        {visibleSkills.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleSkills.map((skill) => (
              <SkillTag key={skill} label={skill} size="sm" />
            ))}
            {extraSkills > 0 && (
              <span className="inline-flex h-6 items-center rounded-lg border border-line px-2 font-mono text-2xs text-fg-faint">
                +{extraSkills}
              </span>
            )}
          </div>
        ) : (
          <span className="text-fg-faint">—</span>
        )}
      </td>

      <td className="hidden whitespace-nowrap px-4 py-3 font-medium text-fg-muted sm:table-cell">
        {formatSalaryRange(job.salary_min, job.salary_max)}
      </td>

      <td className="hidden px-4 py-3 md:table-cell">
        {job.is_remote ? (
          <Badge variant="accent">
            <Wifi className="size-3" />
            Remote
          </Badge>
        ) : (
          <Badge variant="outline">
            <MapPin className="size-3" />
            <span className="max-w-[8rem] truncate">
              {job.location || 'On-site'}
            </span>
          </Badge>
        )}
      </td>

      <td className="hidden whitespace-nowrap px-4 py-3 xl:table-cell">
        <span className="flex items-center gap-1.5 font-mono text-xs text-fg-muted">
          <Eye className="size-3.5 text-fg-faint" />
          {formatCompactNumber(job.views_count)}
        </span>
      </td>

      <td className="hidden whitespace-nowrap px-4 py-3 font-mono text-xs text-fg-muted lg:table-cell">
        {formatDate(job.created_at)}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(job)}
            aria-label={`Edit ${job.title}`}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(job)}
            aria-label={`Delete ${job.title}`}
            className="text-fg-faint hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function AdminJobsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line bg-surface-hi/40 px-4 py-3.5">
        <Skeleton className="h-3 w-20" />
      </div>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-line/60 px-4 py-3.5 last:border-0"
        >
          <Skeleton className="size-9 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-44" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="hidden h-6 w-32 rounded-lg lg:block" />
          <Skeleton className="hidden h-4 w-20 sm:block" />
          <Skeleton className="hidden h-6 w-20 rounded-md md:block" />
          <Skeleton className="size-8 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
