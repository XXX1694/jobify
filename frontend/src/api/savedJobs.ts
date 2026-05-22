import { api, metaOf, unwrap } from './client';
import { normalizeJob } from './jobs';
import type { ApiResponse, Job, Paginated } from './types';

export async function listSavedJobs(page = 1, limit = 60): Promise<Paginated<Job>> {
  const res = await api.get<ApiResponse<Job[]>>('/saved-jobs', {
    params: { page, limit },
  });
  const items = (unwrap(res.data) ?? []).map(normalizeJob);
  return { items, meta: metaOf(res) };
}

export async function saveJob(jobId: string): Promise<void> {
  await api.post('/saved-jobs', { job_id: jobId });
}

export async function unsaveJob(jobId: string): Promise<void> {
  await api.delete(`/saved-jobs/${jobId}`);
}
