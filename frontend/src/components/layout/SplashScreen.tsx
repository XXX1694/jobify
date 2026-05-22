import { motion } from 'framer-motion';
import { LogoMark } from '@/components/common/Logo';

/** Full-screen brand loader shown while the session is being resolved. */
export function SplashScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <motion.span
            className="absolute inset-0 rounded-2xl bg-accent/30"
            animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LogoMark className="size-12 rounded-2xl" />
          </motion.div>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="size-1.5 rounded-full bg-accent"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: index * 0.16,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
