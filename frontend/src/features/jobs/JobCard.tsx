import type { CSSProperties, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Eye, MapPin, Wifi } from 'lucide-react';
import type { Job } from '@/api/types';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSavedJobIds, useToggleSavedJob } from '@/hooks/useSavedJobs';
import { useApplicationsByJob } from '@/hooks/useApplications';
import { calculateMatch } from '@/lib/match';
import { formatRelativeTime, formatSalaryRange, formatCompactNumber } from '@/lib/format';
import { MatchRing } from '@/components/common/MatchRing';
import { SkillTag } from '@/components/common/SkillTag';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/lib/cn';

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const profile = useAuthStore((state) => state.profile);
  const savedIds = useSavedJobIds();
  const toggleSaved = useToggleSavedJob();
  const trackedByJob = useApplicationsByJob();

  const userSkills = profile?.skills ?? [];
  const hasSkills = userSkills.length > 0;
  const { percent, matched } = calculateMatch(userSkills, job.skills);
  const matchedSet = new Set(matched);
  const saved = savedIds.has(job.id);
  const application = trackedByJob.get(job.id);

  const visibleSkills = job.skills.slice(0, 4);
  const extraSkills = job.skills.length - visibleSkills.length;

  function handleBookmark(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggleSaved.mutate({ job, saved });
  }

  return (
    <Link
      to={`/jobs/${job.id}`}
      style={{ '--i': index } as CSSProperties}
      className={cn(
        'stagger group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5',
        'transition-[transform,border-color,box-shadow] duration-200 ease-smooth',
        'hover:-translate-y-1 hover:border-line-hi hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-hi font-mono text-sm font-semibold text-fg-muted">
            {job.company.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{job.company}</p>
            {job.job_type && (
              <p className="font-mono text-2xs uppercase tracking-[0.12em] text-fg-faint">
                {job.job_type.replace(/_/g, ' ')}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleBookmark}
          aria-label={saved ? 'Remove from shortlist' : 'Add to shortlist'}
          aria-pressed={saved}
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-lg border transition-colors',
            saved
              ? 'border-accent/30 bg-accent/12 text-accent-text'
              : 'border-line text-fg-faint hover:border-line-hi hover:text-fg',
          )}
        >
          <Bookmark className={cn('size-4', saved && 'fill-current')} />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-pretty text-[0.95rem] font-semibold leading-snug text-fg transition-colors group-hover:text-accent-text">
          {job.title}
        </h3>
        {hasSkills && (
          <MatchRing percent={percent} size={50} strokeWidth={4.5} />
        )}
      </div>

      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <SkillTag
              key={skill}
              label={skill}
              size="sm"
              variant={matchedSet.has(skill.toLowerCase()) ? 'matched' : 'neutral'}
            />
          ))}
          {extraSkills > 0 && (
            <span className="inline-flex h-6 items-center rounded-lg border border-line px-2 font-mono text-2xs text-fg-faint">
              +{extraSkills}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/70 pt-3.5">
        <div className="flex min-w-0 items-center gap-2 text-xs text-fg-muted">
          <span className="font-medium text-fg">
            {formatSalaryRange(job.salary_min, job.salary_max)}
          </span>
          <span className="text-fg-faint">·</span>
          <span className="flex items-center gap-1 truncate">
            {job.is_remote ? (
              <>
                <Wifi className="size-3 shrink-0" />
                Remote
              </>
            ) : (
              <>
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{job.location || 'On-site'}</span>
              </>
            )}
          </span>
        </div>
        {application ? (
          <StatusBadge status={application.status} size="sm" withIcon={false} />
        ) : (
          <span className="flex shrink-0 items-center gap-2.5 font-mono text-2xs text-fg-faint">
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {formatCompactNumber(job.views_count)}
            </span>
            <span>{formatRelativeTime(job.created_at)}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
