import type { TokenPair } from './types';

/**
 * Single source of truth for auth tokens. Kept outside the Zustand store and
 * the Axios client so neither has to import the other (avoids a cycle).
 */
const ACCESS_KEY = 'jobify.access';
const REFRESH_KEY = 'jobify.refresh';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

let access: string | null = read(ACCESS_KEY);
let refresh: string | null = read(REFRESH_KEY);

export const tokenStore = {
  getAccess: (): string | null => access,
  getRefresh: (): string | null => refresh,
  hasSession: (): boolean => Boolean(access && refresh),

  set(pair: TokenPair): void {
    access = pair.access_token;
    refresh = pair.refresh_token;
    try {
      localStorage.setItem(ACCESS_KEY, access);
      localStorage.setItem(REFRESH_KEY, refresh);
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  },

  clear(): void {
    access = null;
    refresh = null;
    try {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } catch {
      /* ignore */
    }
  },
};
