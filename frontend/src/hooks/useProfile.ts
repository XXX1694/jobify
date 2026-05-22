import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateProfile } from '@/api/profile';
import type { ProfileInput } from '@/api/types';
import { useAuthStore } from './useAuthStore';

export function useUpdateProfile() {
  const setProfile = useAuthStore((state) => state.setProfile);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: ProfileInput) => updateProfile(input),
    onSuccess: (profile) => {
      setProfile(profile);
      // Match scores are derived from skills — refresh anything that shows them.
      qc.invalidateQueries({ queryKey: ['jobs'] });
      qc.invalidateQueries({ queryKey: ['job'] });
      toast.success('Profile saved');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
