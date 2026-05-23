import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ADMIN_NAV_ITEM, NAV_ITEMS, type NavItem } from '@/lib/constants';
import { useLayout } from '@/hooks/useLayout';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Logo, LogoMark } from '@/components/common/Logo';
import { Tooltip } from '@/components/ui/Tooltip';
import { Kbd } from '@/components/ui/Kbd';
import { cn } from '@/lib/cn';

function SidebarItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon;

  const link = (
    <NavLink to={item.path} end={item.path === '/'} className="block">
      {({ isActive }) => (
        <span
          className={cn(
            'group relative flex h-10 items-center gap-3 rounded-xl px-3 transition-colors duration-150',
            collapsed && 'justify-center px-0',
            isActive ? 'text-fg' : 'text-fg-muted hover:bg-surface-hi hover:text-fg',
          )}
        >
          {isActive && (
            <>
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-xl border border-line bg-surface-hi"
                transition={{ type: 'spring', stiffness: 460, damping: 38 }}
              />
              <motion.span
                layoutId="sidebar-active-bar"
                className="absolute left-0 h-5 w-[3px] rounded-r-full bg-accent"
                transition={{ type: 'spring', stiffness: 460, damping: 38 }}
              />
            </>
          )}
          <Icon
            className={cn(
              'relative z-10 size-[1.15rem] shrink-0 transition-colors',
              isActive && 'text-accent-text',
            )}
            strokeWidth={2}
          />
          {!collapsed && (
            <span className="relative z-10 truncate text-sm font-medium">
              {item.label}
            </span>
          )}
        </span>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip label={item.label} side="right">
        {link}
      </Tooltip>
    );
  }
  return link;
}

export function Sidebar() {
  const collapsed = useLayout((state) => state.sidebarCollapsed);
  const toggleSidebar = useLayout((state) => state.toggleSidebar);
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-elevated/70 glass lg:flex"
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-line/70',
          collapsed ? 'justify-center px-0' : 'px-5',
        )}
      >
        {collapsed ? <LogoMark /> : <Logo />}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {!collapsed && <p className="mono-label px-3 pb-2">Navigate</p>}
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} />
        ))}
        {isAdmin && (
          <div className="mt-3 space-y-1 border-t border-line/60 pt-3">
            {!collapsed && <p className="mono-label px-3 pb-1">Admin</p>}
            <SidebarItem item={ADMIN_NAV_ITEM} collapsed={collapsed} />
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-line/70 p-3">
        {!collapsed && (
          <div className="mb-2 flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2.5">
            <span className="text-xs text-fg-muted">Command menu</span>
            <span className="flex items-center gap-0.5">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            'flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-hi hover:text-fg',
            collapsed && 'justify-center px-0',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-[1.15rem]" />
          ) : (
            <>
              <PanelLeftClose className="size-[1.15rem]" />
              Collapse
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
