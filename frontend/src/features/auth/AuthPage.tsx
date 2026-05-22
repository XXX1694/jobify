import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Gauge,
  KanbanSquare,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { DEMO_CREDENTIALS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Logo } from '@/components/common/Logo';
import { MatchRing } from '@/components/common/MatchRing';
import { SkillTag } from '@/components/common/SkillTag';
import { cn } from '@/lib/cn';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

const FEATURES = [
  {
    icon: Gauge,
    title: 'Skill-match scoring',
    body: 'Every role is scored against your stack so you spend time only on real fits.',
  },
  {
    icon: KanbanSquare,
    title: 'A pipeline that thinks',
    body: 'Track each application from saved to offer on a board built for momentum.',
  },
  {
    icon: Sparkles,
    title: 'Curated, not cluttered',
    body: 'Hand-picked engineering roles aggregated and kept fresh — no noise.',
  },
];

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const status = useAuthStore((state) => state.status);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);

  const mode: 'login' | 'register' =
    location.pathname === '/register' ? 'register' : 'login';
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const fromState = location.state as { from?: string } | null;
  const redirectTo = fromState?.from ?? '/';

  if (status === 'authenticated') {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (mode === 'register') {
        await signUp(values.email.trim(), values.password);
      } else {
        await signIn(values.email.trim(), values.password);
      }
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  });

  function fillDemo(credentials: { email: string; password: string }) {
    setValue('email', credentials.email, { shouldValidate: true });
    setValue('password', credentials.password, { shouldValidate: true });
    clearErrors();
  }

  return (
    <div className="relative min-h-screen bg-canvas lg:grid lg:grid-cols-[1.05fr_minmax(0,1fr)]">
      {/* ── Brand panel ─────────────────────────────────────────── */}
      <aside className="relative hidden overflow-hidden border-r border-line bg-elevated lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -left-32 -top-32 size-[34rem] rounded-full bg-accent/[0.1] blur-[120px]" />
        <div className="absolute inset-0 grain-overlay opacity-[0.16] mix-blend-overlay" />

        <Link to="/login" className="relative w-fit">
          <Logo />
        </Link>

        <div className="relative">
          <div className="relative mb-12 h-56">
            <FloatingPreview />
          </div>
          <h1 className="max-w-md text-balance text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-fg">
            Find roles that{' '}
            <span className="text-gradient-accent">actually fit</span> — not just
            roles that exist.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
            Jobify scores every opening against your real skill set, then helps you
            run the hunt like an engineer.
          </p>

          <ul className="mt-9 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex gap-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface">
                  <feature.icon className="size-[1.1rem] text-accent-text" />
                </span>
                <div>
                  <p className="text-sm font-medium text-fg">{feature.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">
                    {feature.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-2xs uppercase tracking-[0.16em] text-fg-faint">
          Developer job intelligence · v1.0
        </p>
      </aside>

      {/* ── Form panel ──────────────────────────────────────────── */}
      <main className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <p className="mono-label">{mode === 'register' ? 'Get started' : 'Welcome back'}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
            {mode === 'register' ? 'Create your account' : 'Sign in to Jobify'}
          </h2>
          <p className="mt-1.5 text-sm text-fg-muted">
            {mode === 'register'
              ? 'A free account takes one step. No card, no noise.'
              : 'Pick up your hunt right where you left it.'}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface p-1">
            <ModeTab to="/login" active={mode === 'login'} label="Sign in" />
            <ModeTab to="/register" active={mode === 'register'} label="Register" />
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.dev"
                icon={<Mail />}
                invalid={Boolean(errors.email)}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-danger">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                icon={<Lock />}
                invalid={Boolean(errors.password)}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="grid size-7 place-items-center rounded-md text-fg-faint transition-colors hover:text-fg"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger/10 px-3 py-2.5 text-xs text-danger">
                <AlertCircle className="mt-px size-4 shrink-0" />
                <span>{errors.root.message}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              {mode === 'register' ? 'Create account' : 'Sign in'}
              {!isSubmitting && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-2xs uppercase tracking-[0.14em] text-fg-faint">
                or try a demo
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fillDemo(DEMO_CREDENTIALS.developer)}
              >
                Developer
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fillDemo(DEMO_CREDENTIALS.admin)}
              >
                Admin
              </Button>
            </div>
            <p className="mt-2.5 text-center text-2xs text-fg-faint">
              Demo accounts fill the form — just press {mode === 'register' ? 'Create account' : 'Sign in'}.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ModeTab({ to, active, label }: { to: string; active: boolean; label: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'relative flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
        active ? 'text-accent-ink' : 'text-fg-muted hover:text-fg',
      )}
    >
      {active && (
        <motion.span
          layoutId="auth-mode-tab"
          className="absolute inset-0 rounded-lg bg-accent"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

/** Decorative product preview — a faux job card resting on a soft stack. */
function FloatingPreview() {
  return (
    <motion.div
      className="relative w-80"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -rotate-[5deg] rounded-2xl border border-line/60 bg-surface/40"
      />
      <div
        aria-hidden
        className="absolute inset-0 rotate-[3deg] rounded-2xl border border-line/70 bg-surface/70"
      />
      <div className="relative rounded-2xl border border-line bg-surface p-5 shadow-pop">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-2xs uppercase tracking-[0.14em] text-fg-faint">
              Cloudflare
            </p>
            <p className="mt-1 text-sm font-semibold text-fg">Senior Go Engineer</p>
          </div>
          <MatchRing percent={92} size={52} strokeWidth={5} />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <SkillTag label="go" variant="matched" size="sm" />
          <SkillTag label="kubernetes" variant="matched" size="sm" />
          <SkillTag label="networking" variant="missing" size="sm" />
        </div>
      </div>
    </motion.div>
  );
}
