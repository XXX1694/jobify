import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

/**
 * Animate a number from 0 to `target` once it mounts (or when target changes).
 * Respects `prefers-reduced-motion`.
 */
export function useCountUp(target: number, durationSec = 1.1): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target === 0) {
      setValue(target);
      return;
    }
    const controls = animate(0, target, {
      duration: durationSec,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [target, durationSec]);

  return value;
}
