import { create } from 'zustand';

const SIDEBAR_KEY = 'jobify.sidebar-collapsed';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === 'true';
  } catch {
    return false;
  }
}

interface LayoutState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useLayout = create<LayoutState>((set, get) => ({
  sidebarCollapsed: readCollapsed(),
  mobileNavOpen: false,
  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    try {
      localStorage.setItem(SIDEBAR_KEY, String(next));
    } catch {
      /* ignore */
    }
    set({ sidebarCollapsed: next });
  },
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}));
