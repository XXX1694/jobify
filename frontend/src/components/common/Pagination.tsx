import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaginationProps {
  page: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

export function Pagination({ page, hasNext, onPageChange, totalPages }: PaginationProps) {
  const showTotal = typeof totalPages === 'number' && totalPages > 1;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>
      <span className="font-mono text-xs tabular-nums text-fg-muted">
        Page {page}
        {showTotal && <span className="text-fg-faint"> / {totalPages}</span>}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
