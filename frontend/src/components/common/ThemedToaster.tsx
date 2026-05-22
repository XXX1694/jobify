import { Toaster } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

/** Sonner toaster wired to the app theme and design tokens. */
export function ThemedToaster() {
  const theme = useTheme((state) => state.theme);

  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      offset={16}
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            'group !rounded-xl !border !border-line !bg-elevated !text-fg !shadow-pop !font-sans',
          title: '!text-sm !font-medium',
          description: '!text-xs !text-fg-muted',
          actionButton: '!bg-accent !text-accent-ink !rounded-lg',
          cancelButton: '!bg-surface-hi !text-fg-muted !rounded-lg',
          icon: 'group-data-[type=success]:!text-accent-text group-data-[type=error]:!text-danger',
        },
      }}
    />
  );
}
