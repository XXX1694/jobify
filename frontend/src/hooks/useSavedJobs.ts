import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as savedApi from '@/api/savedJobs';
import { qk } from '@/lib/constants';
import type { Job } from '@/api/types';

export function useSavedJobs() {
  return useQuery({
    queryKey: qk.savedJobs,
    queryFn: () => savedApi.listSavedJobs(),
    staleTime: 15_000,
  });
}

/** Set of bookmarked job ids, for the bookmark toggle state on cards. */
export function useSavedJobIds(): Set<string> {
  const { data } = useSavedJobs();
  return useMemo(
    () => new Set((data?.items ?? []).map((job) => job.id)),
    [data],
  );
}

export function useToggleSavedJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ job, saved }: { job: Job; saved: boolean }) =>
      saved ? savedApi.unsaveJob(job.id) : savedApi.saveJob(job.id),
    onSuccess: (_data, { saved }) => {
      qc.invalidateQueries({ queryKey: qk.savedJobs });
      toast.success(saved ? 'Removed from shortlist' : 'Added to shortlist');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
