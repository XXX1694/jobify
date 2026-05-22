import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { Command } from 'cmdk';
import {
  ArrowRight,
  Building2,
  CornerDownLeft,
  LogOut,
  MoonStar,
  Search,
  SunMedium,
} from 'lucide-react';
import { listJobs } from '@/api/jobs';
import { NAV_ITEMS } from '@/lib/constants';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSignOut } from '@/hooks/useSignOut';
import { calculateMatch, matchTier } from '@/lib/match';
import { Kbd } from '@/components/ui/Kbd';
import { Spinner } from '@/components/ui/Spinner';

const ITEM_CLASS =
  'flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-fg-muted outline-none transition-colors data-[selected=true]:bg-surface-hi data-[selected=true]:text-fg';

export function CommandPalette() {
  const open = useCommandPalette((state) => state.open);
  const setOpen = useCommandPalette((state) => state.setOpen);
  const toggle = useCommandPalette((state) => state.toggle);
  const navigate = useNavigate();
  const theme = useTheme((state) => state.theme);
  const toggleTheme = useTheme((state) => state.toggle);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useSignOut();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', 'command-palette'],
    queryFn: () => listJobs({ limit: 48 }),
    enabled: open,
    staleTime: 60_000,
  });

  const userSkills = profile?.skills ?? [];
  const searching = search.trim().length > 0;
  const jobList = (jobs?.items ?? []).slice(0, searching ? 48 : 6);

  function run(action: () => void) {
    setOpen(false);
    setSearch('');
    action();
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch('');
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-elevated shadow-pop data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          aria-label="Command menu"
        >
          <DialogPrimitive.Title className="sr-only">Command menu</DialogPrimitive.Title>
          <Command
            loop
            className="flex flex-col"
            filter={(value, query, keywords) => {
              const haystack = `${value} ${(keywords ?? []).join(' ')}`.toLowerCase();
              return haystack.includes(query.toLowerCase()) ? 1 : 0;
            }}
          >
            <div className="flex items-center gap-2.5 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-fg-faint" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search roles, pages and actions…"
                className="h-12 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint"
              />
              <Kbd>esc</Kbd>
            </div>

            <Command.List className="max-h-[58vh] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-10 text-center text-sm text-fg-muted">
                No matches for &ldquo;{search}&rdquo;.
              </Command.Empty>

              <Command.Group
                heading="Pages"
                className="[&_[cmdk-group-heading]]:mono-label [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2"
              >
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.path}
                      value={`${item.label} ${item.description}`}
                      onSelect={() => run(() => navigate(item.path))}
                      className={ITEM_CLASS}
                    >
                      <Icon className="size-4 shrink-0 text-fg-faint" />
                      <span className="flex-1 font-medium text-fg">{item.label}</span>
                      <span className="hidden text-2xs text-fg-faint sm:block">
                        {item.description}
                      </span>
                      <ArrowRight className="size-3.5 text-fg-faint" />
                    </Command.Item>
                  );
                })}
              </Command.Group>

              <Command.Group
                heading="Roles"
                className="[&_[cmdk-group-heading]]:mono-label [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3"
              >
                {isLoading && (
                  <div className="flex items-center gap-2 px-3 py-3 text-sm text-fg-muted">
                    <Spinner className="size-3.5" />
                    Loading roles…
                  </div>
                )}
                {jobList.map((job) => {
                  const { percent } = calculateMatch(userSkills, job.skills);
                  const tier = matchTier(percent);
                  return (
                    <Command.Item
                      key={job.id}
                      value={`${job.title} ${job.company}`}
                      keywords={job.skills}
                      onSelect={() => run(() => navigate(`/jobs/${job.id}`))}
                      className={ITEM_CLASS}
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line bg-surface">
                        <Building2 className="size-3.5 text-fg-faint" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium text-fg">{job.title}</span>
                        <span className="truncate text-2xs text-fg-faint">
                          {job.company}
                        </span>
                      </span>
                      {userSkills.length > 0 && (
                        <span
                          className="font-mono text-2xs font-medium tabular-nums"
                          style={{ color: tier.color }}
                        >
                          {percent}%
                        </span>
                      )}
                    </Command.Item>
                  );
                })}
              </Command.Group>

              <Command.Group
                heading="Actions"
                className="[&_[cmdk-group-heading]]:mono-label [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3"
              >
                <Command.Item
                  value="toggle theme appearance dark light"
                  onSelect={() => run(toggleTheme)}
                  className={ITEM_CLASS}
                >
                  {theme === 'dark' ? (
                    <SunMedium className="size-4 shrink-0 text-fg-faint" />
                  ) : (
                    <MoonStar className="size-4 shrink-0 text-fg-faint" />
                  )}
                  <span className="flex-1 font-medium text-fg">
                    Switch to {theme === 'dark' ? 'light' : 'dark'} mode
                  </span>
                </Command.Item>
                <Command.Item
                  value="sign out log out"
                  onSelect={() => run(() => void signOut())}
                  className={ITEM_CLASS}
                >
                  <LogOut className="size-4 shrink-0 text-danger" />
                  <span className="flex-1 font-medium text-danger">Sign out</span>
                </Command.Item>
              </Command.Group>
            </Command.List>

            <div className="flex items-center justify-between border-t border-line px-3 py-2 text-2xs text-fg-faint">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="size-3" />
                to select
              </span>
              <span className="font-mono">jobify · command</span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
