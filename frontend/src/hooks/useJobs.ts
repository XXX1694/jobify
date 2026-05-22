import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as jobsApi from '@/api/jobs';
import { qk } from '@/lib/constants';
import type { JobInput, JobQuery } from '@/api/types';

export function useJobs(query: JobQuery) {
  return useQuery({
    queryKey: qk.jobs(query),
    queryFn: () => jobsApi.listJobs(query),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: qk.job(id ?? ''),
    queryFn: () => jobsApi.getJob(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: JobInput) => jobsApi.createJob(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Role published to the board');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: JobInput }) =>
      jobsApi.updateJob(id, input),
    onSuccess: (job) => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
      qc.invalidateQueries({ queryKey: qk.job(job.id) });
      toast.success('Role updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Role removed from the board');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
