import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';
import { queryClient } from '@/providers/queryClient';

/** Ends the session, clears cached data and returns to the sign-in screen. */
export function useSignOut() {
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  return useCallback(async () => {
    await signOut();
    queryClient.clear();
    navigate('/login', { replace: true });
    toast('Signed out', { description: 'See you soon.' });
  }, [signOut, navigate]);
}
