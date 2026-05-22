import { Skeleton } from '@/components/ui/Skeleton';

export function JobCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2 pt-0.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="size-12 shrink-0 rounded-full" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-14 rounded-lg" />
      </div>
      <div className="border-t border-line/70 pt-3.5">
        <Skeleton className="h-3.5 w-40" />
      </div>
    </div>
  );
}
