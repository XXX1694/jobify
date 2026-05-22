import * as DialogPrimitive from '@radix-ui/react-dialog';
import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { useLayout } from '@/hooks/useLayout';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSignOut } from '@/hooks/useSignOut';
import { Logo } from '@/components/common/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

export function MobileNav() {
  const open = useLayout((state) => state.mobileNavOpen);
  const setOpen = useLayout((state) => state.setMobileNavOpen);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useSignOut();

  const displayName = profile?.name?.trim() || user?.email || 'Developer';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-[19rem] max-w-[85vw] flex-col border-r border-line bg-elevated shadow-pop data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left data-[state=open]:duration-300 lg:hidden">
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Logo />
            <DialogPrimitive.Close
              className="grid size-8 place-items-center rounded-lg text-fg-faint transition-colors hover:bg-surface-hi hover:text-fg"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'border border-line bg-surface-hi text-fg'
                        : 'text-fg-muted hover:bg-surface-hi hover:text-fg',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn('size-[1.15rem]', isActive && 'text-accent-text')}
                      />
                      <span className="flex-1">{item.label}</span>
                      <span className="text-2xs text-fg-faint">{item.description}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-line p-3">
            <div className="mb-2 flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
              <Avatar name={displayName} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{displayName}</p>
                <p className="truncate text-2xs text-fg-faint">{user?.email}</p>
              </div>
              {user?.role === 'admin' && <Badge variant="accent">Admin</Badge>}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              <LogOut className="size-[1.15rem]" />
              Sign out
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
