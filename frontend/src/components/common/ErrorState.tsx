import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went sideways',
  description = "We couldn't load this just now. The API may be unreachable.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-danger/10 blur-2xl" />
        <div className="grid size-[4.5rem] place-items-center rounded-2xl border border-danger/25 bg-danger/10">
          <AlertTriangle className="size-7 text-danger" strokeWidth={1.6} />
        </div>
      </div>
      <h3 className="text-base font-semibold tracking-tight text-fg">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-6">
          <RotateCw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
