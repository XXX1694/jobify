import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const theme = useTheme((state) => state.theme);
  const toggle = useTheme((state) => state.toggle);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {theme === 'dark' ? (
            <Moon className="size-[1.05rem]" />
          ) : (
            <Sun className="size-[1.05rem]" />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
