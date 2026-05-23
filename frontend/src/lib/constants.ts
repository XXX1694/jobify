import {
  Bookmark,
  CalendarClock,
  LayoutDashboard,
  Send,
  ShieldCheck,
  Sparkles,
  Telescope,
  User,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { ApplicationStatus } from '@/api/types';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Your search at a glance',
  },
  {
    path: '/jobs',
    label: 'Explore',
    icon: Telescope,
    description: 'Browse and filter open roles',
  },
  {
    path: '/applications',
    label: 'Pipeline',
    icon: Send,
    description: 'Track every application',
  },
  {
    path: '/saved',
    label: 'Shortlist',
    icon: Bookmark,
    description: 'Roles you bookmarked',
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: User,
    description: 'Skills, salary and preferences',
  },
];

/** Admin-only navigation entry — kept out of NAV_ITEMS so it never renders for developers. */
export const ADMIN_NAV_ITEM: NavItem = {
  path: '/admin',
  label: 'Admin',
  icon: ShieldCheck,
  description: 'Manage roles on the board',
};

export interface StatusMeta {
  label: string;
  blurb: string;
  /** CSS custom property holding the status colour as an `R G B` triplet. */
  tokenVar: string;
  icon: LucideIcon;
}

export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  saved: {
    label: 'Saved',
    blurb: 'On the radar',
    tokenVar: '--s-saved',
    icon: Bookmark,
  },
  applied: {
    label: 'Applied',
    blurb: 'Application sent',
    tokenVar: '--s-applied',
    icon: Send,
  },
  interview: {
    label: 'Interview',
    blurb: 'In conversation',
    tokenVar: '--s-interview',
    icon: CalendarClock,
  },
  offer: {
    label: 'Offer',
    blurb: 'Offer on the table',
    tokenVar: '--s-offer',
    icon: Sparkles,
  },
  rejected: {
    label: 'Closed',
    blurb: 'Not moving forward',
    tokenVar: '--s-rejected',
    icon: XCircle,
  },
};

export function statusColor(status: ApplicationStatus, alpha = 1): string {
  const v = STATUS_META[status].tokenVar;
  return alpha === 1 ? `rgb(var(${v}))` : `rgb(var(${v}) / ${alpha})`;
}

/** Popular skills offered as quick-add chips in the profile editor & filters. */
export const SKILL_SUGGESTIONS: string[] = [
  'go',
  'typescript',
  'react',
  'python',
  'postgres',
  'redis',
  'kubernetes',
  'docker',
  'aws',
  'rust',
  'node.js',
  'graphql',
  'kafka',
  'terraform',
  'java',
  'next.js',
  'tailwind',
  'grpc',
  'linux',
  'distributed systems',
];

export const DEMO_CREDENTIALS = {
  developer: { email: 'alex.kim@gmail.com', password: 'Test1234!' },
  admin: { email: 'admin@jobify.dev', password: 'Test1234!' },
};

/** Centralised TanStack Query keys. */
export const qk = {
  me: ['me'] as const,
  jobs: (filters?: unknown) => ['jobs', filters ?? {}] as const,
  job: (id: string) => ['job', id] as const,
  applications: ['applications'] as const,
  savedJobs: ['saved-jobs'] as const,
};
