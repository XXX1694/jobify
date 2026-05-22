import { useNavigate } from 'react-router-dom';
import { Bookmark, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSignOut } from '@/hooks/useSignOut';

export function UserMenu() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useSignOut();
  const navigate = useNavigate();

  const name =
    profile?.name?.trim() || user?.email?.split('@')[0] || 'Developer';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-xl p-1 pr-1.5 transition-colors hover:bg-surface-hi sm:pr-2"
          aria-label="Account menu"
        >
          <Avatar name={name} size="sm" />
          <span className="hidden max-w-[7.5rem] truncate text-sm font-medium text-fg sm:block">
            {name}
          </span>
          <ChevronDown className="hidden size-3.5 text-fg-faint sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={name} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{name}</p>
            <p className="truncate text-2xs text-fg-faint">{user?.email}</p>
          </div>
        </div>
        {user?.role === 'admin' && (
          <div className="px-2 pb-1.5">
            <Badge variant="accent">Admin workspace</Badge>
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/profile')}>
          <UserIcon />
          Profile &amp; skills
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/saved')}>
          <Bookmark />
          Shortlist
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => void signOut()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
