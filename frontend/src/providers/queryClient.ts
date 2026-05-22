import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Never retry auth/permission failures — only transient ones.
        if (error instanceof ApiError && [401, 403, 404].includes(error.status)) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 20_000,
    },
    mutations: {
      retry: false,
    },
  },
});
