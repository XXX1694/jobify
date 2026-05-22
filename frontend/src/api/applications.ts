import { api, unwrap } from './client';
import { normalizeJob } from './jobs';
import type { ApiResponse, Application, ApplicationStatus } from './types';

export async function listApplications(): Promise<Application[]> {
  const res = await api.get<ApiResponse<Application[]>>('/applications');
  const apps = unwrap(res.data) ?? [];
  return apps.map((app) => (app.job ? { ...app, job: normalizeJob(app.job) } : app));
}

export async function createApplication(
  jobId: string,
  note: string,
): Promise<Application> {
  const res = await api.post<ApiResponse<Application>>('/applications', {
    job_id: jobId,
    note,
  });
  return unwrap(res.data);
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  await api.put(`/applications/${id}`, { status });
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/applications/${id}`);
}
