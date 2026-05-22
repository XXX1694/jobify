import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { tokenStore } from './tokenStore';
import type { ApiResponse, TokenPair } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

/** Fired when a refresh attempt fails — the auth provider listens for this. */
export const AUTH_EXPIRED_EVENT = 'jobify:auth-expired';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const FALLBACK_MESSAGE: Record<number, string> = {
  400: 'That request looked off — double-check the form.',
  401: 'Your session has expired. Please sign in again.',
  403: "You don't have access to that.",
  404: "We couldn't find what you were looking for.",
  409: 'That already exists.',
  429: 'Easy there — too many requests. Give it a moment.',
  500: 'Something broke on our end. Try again shortly.',
};

function normalizeError(error: AxiosError<ApiResponse<unknown>>): ApiError {
  if (error.response) {
    const status = error.response.status;
    const message =
      error.response.data?.error ||
      FALLBACK_MESSAGE[status] ||
      `Request failed (${status}).`;
    return new ApiError(message, status);
  }
  if (error.code === 'ECONNABORTED') {
    return new ApiError('The request timed out. The API may be busy.', 0);
  }
  return new ApiError(
    'Cannot reach the Jobify API. Make sure the Go backend is running on :8080.',
    0,
  );
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Single-flight refresh — concurrent 401s share one refresh request. */
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;
  try {
    const res = await axios.post<ApiResponse<TokenPair>>(
      `${BASE_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );
    const pair = res.data.data;
    if (!pair?.access_token) return null;
    tokenStore.set(pair);
    return pair.access_token;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes('/auth/');

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      refreshInFlight = refreshInFlight ?? refreshAccessToken();
      const fresh = await refreshInFlight;
      refreshInFlight = null;

      if (fresh) {
        original.headers.Authorization = `Bearer ${fresh}`;
        return api(original);
      }
      tokenStore.clear();
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }

    return Promise.reject(normalizeError(error));
  },
);

/** Unwrap the `{ success, data }` envelope, throwing on a failed response. */
export function unwrap<T>(payload: ApiResponse<T>): T {
  if (!payload.success) {
    throw new ApiError(payload.error || 'The request did not succeed.', 0);
  }
  return payload.data as T;
}

export function metaOf(res: AxiosResponse<ApiResponse<unknown>>) {
  return res.data.meta ?? null;
}
