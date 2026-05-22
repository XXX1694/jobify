import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Telescope } from 'lucide-react';
import { MatchRing } from '@/components/common/MatchRing';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[68vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 sm:gap-5"
      >
        <span className="font-mono text-[5.5rem] font-semibold leading-none tracking-tightest text-fg sm:text-[8rem]">
          4
        </span>
        <MatchRing percent={0} size={108} strokeWidth={8} caption="match" />
        <span className="font-mono text-[5.5rem] font-semibold leading-none tracking-tightest text-fg sm:text-[8rem]">
          4
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="mt-8 max-w-md"
      >
        <p className="mono-label">Error 404 · zero fit</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
          This route scored a 0% match
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          The page you were after doesn&rsquo;t exist — or it moved on to a better
          opportunity. Let&rsquo;s get you back to roles that actually fit.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Button asChild variant="primary">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to dashboard
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/jobs">
              <Telescope className="size-4" />
              Explore roles
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
