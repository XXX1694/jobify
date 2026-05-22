import { forwardRef, type CSSProperties, type PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ArrowUpRight, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Application } from '@/api/types';
import { APPLICATION_STATUSES } from '@/api/types';
import { STATUS_META } from '@/lib/constants';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/hooks/useApplications';
import { calculateMatch, matchTier } from '@/lib/match';
import { formatRelativeTime } from '@/lib/format';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/cn';

interface ApplicationCardViewProps {
  application: Application;
  isDragging?: boolean;
  isOverlay?: boolean;
  style?: CSSProperties;
  dragHandleProps?: Record<string, unknown>;
}

export const ApplicationCardView = forwardRef<HTMLDivElement, ApplicationCardViewProps>(
  ({ application, isDragging, isOverlay, style, dragHandleProps }, ref) => {
    const navigate = useNavigate();
    const profile = useAuthStore((state) => state.profile);
    const updateStatus = useUpdateApplicationStatus();
    const removeApplication = useDeleteApplication();

    const job = application.job;
    const { percent } = calculateMatch(profile?.skills, job?.skills);
    const tier = matchTier(percent);
    const stopDrag = {
      onPointerDown: (event: PointerEvent) => event.stopPropagation(),
    };

    return (
      <div
        ref={ref}
        style={style}
        {...dragHandleProps}
        className={cn(
          'group/card cursor-grab touch-none rounded-xl border border-line bg-elevated p-3.5 active:cursor-grabbing',
          'transition-shadow duration-150',
          isDragging && !isOverlay && 'opacity-30',
          isOverlay && 'rotate-2 cursor-grabbing shadow-pop',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-mono text-2xs uppercase tracking-[0.12em] text-fg-faint">
            {job?.company ?? 'Unknown company'}
          </p>
          <div className="flex shrink-0 items-center gap-0.5">
            <GripVertical className="size-3.5 text-fg-faint opacity-0 transition-opacity group-hover/card:opacity-100" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  {...stopDrag}
                  className="grid size-6 place-items-center rounded-md text-fg-faint transition-colors hover:bg-surface-hi hover:text-fg"
                  aria-label="Application actions"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onPointerDown={(e) => e.stopPropagation()}>
                {job && (
                  <DropdownMenuItem onSelect={() => navigate(`/jobs/${job.id}`)}>
                    <ArrowUpRight />
                    Open role
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Move to</DropdownMenuLabel>
                {APPLICATION_STATUSES.filter((s) => s !== application.status).map(
                  (status) => {
                    const meta = STATUS_META[status];
                    return (
                      <DropdownMenuItem
                        key={status}
                        onSelect={() =>
                          updateStatus.mutate({ id: application.id, status })
                        }
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: `rgb(var(${meta.tokenVar}))` }}
                        />
                        {meta.label}
                      </DropdownMenuItem>
                    );
                  },
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  destructive
                  onSelect={() => removeApplication.mutate(application.id)}
                >
                  <Trash2 />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <button
          {...stopDrag}
          onClick={() => job && navigate(`/jobs/${job.id}`)}
          className="mt-1 block text-left"
        >
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-fg transition-colors hover:text-accent-text">
            {job?.title ?? 'Tracked role'}
          </p>
        </button>

        {application.note && (
          <p className="mt-2 line-clamp-2 border-l-2 border-line pl-2 text-xs italic leading-relaxed text-fg-muted">
            {application.note}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className="rounded-md px-1.5 py-0.5 font-mono text-2xs font-medium tabular-nums"
            style={{ color: tier.color, backgroundColor: 'rgb(var(--c-surface-hi))' }}
          >
            {percent}% fit
          </span>
          <span className="font-mono text-2xs text-fg-faint">
            {formatRelativeTime(application.updated_at)}
          </span>
        </div>
      </div>
    );
  },
);
ApplicationCardView.displayName = 'ApplicationCardView';

export function DraggableApplicationCard({ application }: { application: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
    data: { status: application.status },
  });

  return (
    <ApplicationCardView
      ref={setNodeRef}
      application={application}
      isDragging={isDragging}
      style={{ transform: CSS.Translate.toString(transform) }}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
}
