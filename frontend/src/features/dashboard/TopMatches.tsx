import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Job } from '@/api/types';
import { calculateMatch } from '@/lib/match';
import { MatchBar } from '@/components/common/MatchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

interface TopMatchesProps {
  jobs: Job[];
  skills: string[];
  loading: boolean;
}

export function TopMatches({ jobs, skills, loading }: TopMatchesProps) {
  const ranked = useMemo(() => {
    return jobs
      .map((job) => ({ job, percent: calculateMatch(skills, job.skills).percent }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);
  }, [jobs, skills]);

  return (
    <section className="rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-fg">Roles that fit you</h2>
          <p className="text-xs text-fg-muted">Ranked by match against your stack</p>
        </div>
        <Link
          to="/jobs"
          className="flex items-center gap-1 text-xs font-medium text-accent-text transition-opacity hover:opacity-80"
        >
          Explore all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-line">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-5 py-3.5">
              <Skeleton className="size-9 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-3.5 w-20" />
            </div>
          ))
        ) : skills.length === 0 ? (
          <div className="flex flex-col items-start gap-3 px-5 py-8">
            <p className="flex items-center gap-2 text-sm text-fg">
              <Sparkles className="size-4 text-accent-text" />
              Add skills to rank roles by fit
            </p>
            <p className="text-sm text-fg-muted">
              Once your profile has a few skills, Jobify ranks every opening by how
              well it matches you.
            </p>
            <Button asChild variant="secondary" size="sm">
              <Link to="/profile">Set up your profile</Link>
            </Button>
          </div>
        ) : (
          ranked.map(({ job, percent }) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-hi/60"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-hi font-mono text-sm font-semibold text-fg-muted">
                {job.company.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{job.title}</p>
                <p className="truncate text-xs text-fg-faint">{job.company}</p>
              </div>
              <MatchBar percent={percent} className="w-28 shrink-0" />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
