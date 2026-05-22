import { useDroppable } from '@dnd-kit/core';
import type { Application, ApplicationStatus } from '@/api/types';
import { STATUS_META } from '@/lib/constants';
import { DraggableApplicationCard } from './ApplicationCard';
import { cn } from '@/lib/cn';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const meta = STATUS_META[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const color = `rgb(var(${meta.tokenVar}))`;

  return (
    <div className="flex w-[16.5rem] shrink-0 flex-col">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-fg">{meta.label}</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-md bg-surface-hi px-1 font-mono text-2xs font-medium text-fg-muted">
          {applications.length}
        </span>
        <span className="ml-auto text-2xs text-fg-faint">{meta.blurb}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-1 flex-col gap-2.5 rounded-2xl border border-dashed p-2.5 transition-colors duration-150',
          isOver ? 'border-accent/45 bg-accent/[0.05]' : 'border-line bg-surface/40',
        )}
      >
        {applications.length === 0 ? (
          <div className="grid flex-1 place-items-center rounded-xl py-10 text-center">
            <p className="text-2xs text-fg-faint">
              {isOver ? 'Release to move here' : 'Nothing here yet'}
            </p>
          </div>
        ) : (
          applications.map((application) => (
            <DraggableApplicationCard key={application.id} application={application} />
          ))
        )}
      </div>
    </div>
  );
}
