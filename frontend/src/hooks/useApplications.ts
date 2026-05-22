import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as appsApi from '@/api/applications';
import { qk } from '@/lib/constants';
import type { Application, ApplicationStatus } from '@/api/types';

export function useApplications() {
  return useQuery({
    queryKey: qk.applications,
    queryFn: appsApi.listApplications,
    staleTime: 15_000,
  });
}

/** Map of job id -> the application tracking it, for "already in pipeline" checks. */
export function useApplicationsByJob(): Map<string, Application> {
  const { data } = useApplications();
  return useMemo(() => {
    const map = new Map<string, Application>();
    for (const app of data ?? []) map.set(app.job_id, app);
    return map;
  }, [data]);
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, note }: { jobId: string; note: string }) =>
      appsApi.createApplication(jobId, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.applications });
      toast.success('Added to your pipeline');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      appsApi.updateApplicationStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: qk.applications });
      const previous = qc.getQueryData<Application[]>(qk.applications);
      qc.setQueryData<Application[]>(qk.applications, (old) =>
        (old ?? []).map((app) => (app.id === id ? { ...app, status } : app)),
      );
      return { previous };
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) qc.setQueryData(qk.applications, context.previous);
      toast.error(error.message);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: qk.applications }),
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appsApi.deleteApplication(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.applications });
      const previous = qc.getQueryData<Application[]>(qk.applications);
      qc.setQueryData<Application[]>(qk.applications, (old) =>
        (old ?? []).filter((app) => app.id !== id),
      );
      return { previous };
    },
    onError: (error: Error, _id, context) => {
      if (context?.previous) qc.setQueryData(qk.applications, context.previous);
      toast.error(error.message);
    },
    onSuccess: () => toast.success('Removed from pipeline'),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.applications }),
  });
}
