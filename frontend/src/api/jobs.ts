import { api, metaOf, unwrap } from './client';
import type {
  ApiResponse,
  Job,
  JobInput,
  JobQuery,
  JobWithMatch,
  Paginated,
} from './types';

/** Guard against Go nil slices arriving as `null` in JSON. */
export function normalizeJob<T extends Job>(job: T): T {
  return { ...job, skills: job.skills ?? [] };
}

export async function listJobs(query: JobQuery = {}): Promise<Paginated<Job>> {
  const params: Record<string, string> = {};
  if (query.page) params.page = String(query.page);
  if (query.limit) params.limit = String(query.limit);
  if (query.skills?.length) params.skills = query.skills.join(',');
  if (query.remote) params.remote = 'true';
  if (query.salary_min) params.salary_min = String(query.salary_min);
  if (query.salary_max) params.salary_max = String(query.salary_max);

  const res = await api.get<ApiResponse<Job[]>>('/jobs', { params });
  const items = (unwrap(res.data) ?? []).map(normalizeJob);
  return { items, meta: metaOf(res) };
}

export async function getJob(id: string): Promise<JobWithMatch> {
  const res = await api.get<ApiResponse<JobWithMatch>>(`/jobs/${id}`);
  const job = unwrap(res.data);
  return {
    ...normalizeJob(job),
    matched_skills: job.matched_skills ?? [],
    missing_skills: job.missing_skills ?? [],
  };
}

export async function createJob(input: JobInput): Promise<Job> {
  const res = await api.post<ApiResponse<Job>>('/jobs', input);
  return normalizeJob(unwrap(res.data));
}

export async function updateJob(id: string, input: JobInput): Promise<Job> {
  const res = await api.put<ApiResponse<Job>>(`/jobs/${id}`, input);
  return normalizeJob(unwrap(res.data));
}

export async function deleteJob(id: string): Promise<void> {
  await api.delete(`/jobs/${id}`);
}
