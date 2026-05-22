import { useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { NAV_ITEMS, type NavItem } from '@/lib/constants';
import { useLayout } from '@/hooks/useLayout';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { Button } from '@/components/ui/Button';
import { Kbd } from '@/components/ui/Kbd';
import { LogoMark } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserMenu } from './UserMenu';
import { ActivityMenu } from './ActivityMenu';
import { cn } from '@/lib/cn';

function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const root: NavItem =
    NAV_ITEMS.find((item) => item.path === `/${segments[0] ?? ''}`) ?? NAV_ITEMS[0]!;
  const Icon = root.icon;
  const isDetail = segments.length > 1;

  return (
    <nav className="hidden items-center gap-2 text-sm lg:flex" aria-label="Breadcrumb">
      <Icon className="size-4 text-fg-faint" />
      <span className={cn('font-medium', isDetail ? 'text-fg-muted' : 'text-fg')}>
        {root.label}
      </span>
      {isDetail && (
        <>
          <span className="text-fg-faint">/</span>
          <span className="font-medium text-fg">Details</span>
        </>
      )}
    </nav>
  );
}

export function Header() {
  const setMobileNavOpen = useLayout((state) => state.setMobileNavOpen);
  const openPalette = useCommandPalette((state) => state.setOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-canvas/75 px-4 glass lg:px-8">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="size-[1.15rem]" />
      </Button>
      <div className="lg:hidden">
        <LogoMark />
      </div>

      <Breadcrumb />

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => openPalette(true)}
        className="hidden h-9 w-56 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-fg-faint transition-colors hover:border-line-hi hover:text-fg-muted sm:flex xl:w-72"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search Jobify</span>
        <span className="flex items-center gap-0.5">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="sm:hidden"
        onClick={() => openPalette(true)}
        aria-label="Search"
      >
        <Search className="size-[1.05rem]" />
      </Button>

      <ThemeToggle />
      <ActivityMenu />
      <div className="mx-0.5 hidden h-6 w-px bg-line sm:block" />
      <UserMenu />
    </header>
  );
}
