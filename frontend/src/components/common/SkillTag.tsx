import { Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export type SkillTagVariant = 'neutral' | 'matched' | 'missing' | 'add';

interface SkillTagProps {
  label: string;
  variant?: SkillTagVariant;
  size?: 'sm' | 'md';
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

const VARIANT_CLS: Record<SkillTagVariant, string> = {
  neutral: 'border-line bg-surface-hi text-fg-muted',
  matched: 'border-accent/30 bg-accent/12 text-accent-text',
  missing: 'border-dashed border-line text-fg-faint',
  add: 'border-dashed border-line text-fg-muted hover:border-accent/40 hover:text-accent-text',
};

export function SkillTag({
  label,
  variant = 'neutral',
  size = 'md',
  onRemove,
  onClick,
  className,
}: SkillTagProps) {
  const interactive = Boolean(onClick);
  const Tag = interactive ? 'button' : 'span';

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border font-mono lowercase transition-colors duration-150',
        size === 'sm' ? 'h-6 px-2 text-2xs' : 'h-7 px-2.5 text-xs',
        VARIANT_CLS[variant],
        interactive && 'cursor-pointer',
        className,
      )}
    >
      {variant === 'matched' && <Check className="size-3 shrink-0" strokeWidth={2.5} />}
      {variant === 'add' && <Plus className="size-3 shrink-0" strokeWidth={2.5} />}
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="-mr-0.5 grid size-3.5 place-items-center rounded text-fg-faint transition-colors hover:bg-line-hi hover:text-fg"
          aria-label={`Remove ${label}`}
        >
          <X className="size-2.5" strokeWidth={3} />
        </button>
      )}
    </Tag>
  );
}
