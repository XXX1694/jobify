import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/api/types';
import { useUpdateApplicationStatus } from '@/hooks/useApplications';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCardView } from './ApplicationCard';

type Grouped = Record<ApplicationStatus, Application[]>;

function groupByStatus(applications: Application[]): Grouped {
  const grouped: Grouped = {
    saved: [],
    applied: [],
    interview: [],
    offer: [],
    rejected: [],
  };
  for (const application of applications) {
    grouped[application.status].push(application);
  }
  return grouped;
}

export function KanbanBoard({ applications }: { applications: Application[] }) {
  const updateStatus = useUpdateApplicationStatus();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  );

  const grouped = useMemo(() => groupByStatus(applications), [applications]);
  const activeApplication = activeId
    ? applications.find((application) => application.id === activeId) ?? null
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const nextStatus = over.id as ApplicationStatus;
    const currentStatus = active.data.current?.status as ApplicationStatus | undefined;
    if (currentStatus && currentStatus !== nextStatus) {
      updateStatus.mutate({ id: String(active.id), status: nextStatus });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex min-h-[56vh] items-stretch gap-4 overflow-x-auto pb-3">
        {APPLICATION_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={grouped[status]}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.22,1,0.36,1)' }}>
        {activeApplication && (
          <ApplicationCardView application={activeApplication} isOverlay />
        )}
      </DragOverlay>
    </DndContext>
  );
}
