import { create } from 'zustand';
import * as authApi from '@/api/auth';
import { getMe } from '@/api/profile';
import { tokenStore } from '@/api/tokenStore';
import type { DeveloperProfile, User } from '@/api/types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  profile: DeveloperProfile | null;
  /** Resolve the session on app start from any persisted tokens. */
  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Called when a token refresh fails mid-session. */
  expireSession: () => void;
  setProfile: (profile: DeveloperProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,
  profile: null,

  bootstrap: async () => {
    if (!tokenStore.hasSession()) {
      set({ status: 'unauthenticated', user: null, profile: null });
      return;
    }
    try {
      const me = await getMe();
      set({ status: 'authenticated', user: me.user, profile: me.profile });
    } catch {
      tokenStore.clear();
      set({ status: 'unauthenticated', user: null, profile: null });
    }
  },

  signIn: async (email, password) => {
    const pair = await authApi.login(email, password);
    tokenStore.set(pair);
    const me = await getMe();
    set({ status: 'authenticated', user: me.user, profile: me.profile });
  },

  signUp: async (email, password) => {
    await authApi.register(email, password);
    const pair = await authApi.login(email, password);
    tokenStore.set(pair);
    const me = await getMe();
    set({ status: 'authenticated', user: me.user, profile: me.profile });
  },

  signOut: async () => {
    const refresh = tokenStore.getRefresh();
    if (refresh) {
      try {
        await authApi.logout(refresh);
      } catch {
        /* best effort — drop the session locally regardless */
      }
    }
    tokenStore.clear();
    set({ status: 'unauthenticated', user: null, profile: null });
  },

  expireSession: () => {
    tokenStore.clear();
    set({ status: 'unauthenticated', user: null, profile: null });
  },

  setProfile: (profile) => set({ profile }),
}));
