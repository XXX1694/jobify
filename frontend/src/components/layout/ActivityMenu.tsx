import { useNavigate } from 'react-router-dom';
import { Bell, Inbox } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApplications } from '@/hooks/useApplications';
import { formatRelativeTime } from '@/lib/format';

export function ActivityMenu() {
  const { data } = useApplications();
  const navigate = useNavigate();

  const recent = [...(data ?? [])]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Recent activity"
          className="relative"
        >
          <Bell className="size-[1.05rem]" />
          {recent.length > 0 && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent ring-2 ring-canvas" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[18rem]">
        <DropdownMenuLabel>Pipeline activity</DropdownMenuLabel>
        {recent.length > 0 ? (
          recent.map((app) => (
            <DropdownMenuItem
              key={app.id}
              onSelect={() => navigate('/applications')}
              className="flex-col items-start gap-1"
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-fg">
                  {app.job?.title ?? 'Tracked role'}
                </span>
                <StatusBadge status={app.status} size="sm" withIcon={false} />
              </span>
              <span className="truncate text-2xs text-fg-faint">
                {app.job?.company ?? 'Unknown company'} ·{' '}
                {formatRelativeTime(app.updated_at)}
              </span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
            <Inbox className="size-6 text-fg-faint" />
            <p className="text-xs text-fg-muted">
              Nothing here yet — start tracking a role.
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
