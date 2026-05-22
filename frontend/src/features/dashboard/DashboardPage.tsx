import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, CalendarClock, Layers, Sparkles } from 'lucide-react';
import type { ApplicationStatus, Job } from '@/api/types';
import { useApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useAuthStore } from '@/hooks/useAuthStore';
import { calculateMatch } from '@/lib/match';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { MatchRing } from '@/components/common/MatchRing';
import { StatCard } from './StatCard';
import { PipelineChart } from './PipelineChart';
import { TopMatches } from './TopMatches';
import { RecentActivity } from './RecentActivity';

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const applicationsQuery = useApplications();
  const jobsQuery = useJobs({ limit: 60 });
  const savedQuery = useSavedJobs();

  const applications = useMemo(
    () => applicationsQuery.data ?? [],
    [applicationsQuery.data],
  );
  const jobs = useMemo(() => jobsQuery.data?.items ?? [], [jobsQuery.data]);
  const skills = useMemo(() => profile?.skills ?? [], [profile]);

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

  const topMatch = useMemo(() => {
    if (skills.length === 0 || jobs.length === 0) return null;
    return jobs
      .map((job) => ({ job, percent: calculateMatch(skills, job.skills).percent }))
      .sort((a, b) => b.percent - a.percent)[0]!;
  }, [skills, jobs]);

  const firstName =
    profile?.name?.trim().split(/\s+/)[0] ||
    user?.email?.split('@')[0] ||
    'there';
  const incompleteProfile = skills.length < 3;

  return (
    <div className="space-y-6">
      <div>
        <p className="mono-label">{DATE_FORMAT.format(new Date())}</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-fg sm:text-[1.75rem]">
          {greeting()}, <span className="text-gradient-accent">{firstName}</span>
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          Here&rsquo;s where your job hunt stands today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="In pipeline"
          value={applications.length}
          icon={Layers}
          hint="roles you're tracking"
          loading={applicationsQuery.isLoading}
          index={0}
        />
        <StatCard
          label="Interviews"
          value={counts.interview}
          icon={CalendarClock}
          hint="active conversations"
          loading={applicationsQuery.isLoading}
          index={1}
        />
        <StatCard
          label="Offers"
          value={counts.offer}
          icon={Sparkles}
          hint="on the table"
          accent={counts.offer > 0}
          loading={applicationsQuery.isLoading}
          index={2}
        />
        <StatCard
          label="Shortlisted"
          value={savedQuery.data?.items.length ?? 0}
          icon={Bookmark}
          hint="saved for later"
          loading={savedQuery.isLoading}
          index={3}
        />
      </div>

      {incompleteProfile && <ProfilePrompt />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PipelineChart counts={counts} loading={applicationsQuery.isLoading} />
          <TopMatches jobs={jobs} skills={skills} loading={jobsQuery.isLoading} />
        </div>
        <div className="space-y-6">
          <BestMatchCard
            match={topMatch}
            hasSkills={skills.length > 0}
            loading={jobsQuery.isLoading}
          />
          <RecentActivity
            applications={applications}
            loading={applicationsQuery.isLoading}
          />
        </div>
      </div>
    </div>
  );
}

function ProfilePrompt() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-accent/25 bg-accent/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent-text">
          <Sparkles className="size-4.5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-fg">Sharpen your matches</p>
          <p className="mt-0.5 text-sm text-fg-muted">
            Add at least three skills to your profile to unlock accurate fit scores
            on every role.
          </p>
        </div>
      </div>
      <Button asChild variant="primary" size="sm" className="shrink-0">
        <Link to="/profile">
          Complete profile
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

interface BestMatchCardProps {
  match: { job: Job; percent: number } | null;
  hasSkills: boolean;
  loading: boolean;
}

function BestMatchCard({ match, hasSkills, loading }: BestMatchCardProps) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-line bg-surface p-5">
        <Skeleton className="h-3.5 w-28" />
        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </section>
    );
  }

  if (!hasSkills || !match) {
    return (
      <section className="rounded-2xl border border-line bg-surface p-5">
        <p className="mono-label">Strongest match</p>
        <div className="mt-3 flex items-center gap-4">
          <MatchRing percent={0} size={80} strokeWidth={6} />
          <div>
            <p className="text-sm font-medium text-fg">No matches yet</p>
            <p className="mt-0.5 text-xs text-fg-muted">
              Add skills to your profile to surface your best-fit role.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <p className="mono-label">Strongest match</p>
      <div className="mt-3 flex items-center gap-4">
        <MatchRing percent={match.percent} size={80} strokeWidth={6} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">{match.job.title}</p>
          <p className="truncate text-xs text-fg-faint">{match.job.company}</p>
        </div>
      </div>
      <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
        <Link to={`/jobs/${match.job.id}`}>
          View this role
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
}
