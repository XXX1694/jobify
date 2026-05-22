/**
 * TypeScript mirrors of the Go backend domain (internal/domain) and the
 * `pkg/response` envelope. Field names match the JSON tags exactly.
 */

export type Role = 'developer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface DeveloperProfile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  skills: string[];
  experience_years: number;
  salary_min: number;
  salary_max: number;
  remote_only: boolean;
  github_url: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  salary_min: number;
  salary_max: number;
  is_remote: boolean;
  location: string;
  job_type?: string;
  source: string;
  source_id?: string;
  url: string;
  is_active: boolean;
  views_count: number;
  created_at: string;
}

export interface JobWithMatch extends Job {
  match_percent: number;
  matched_skills: string[];
  missing_skills: string[];
}

export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'interview',
  'offer',
  'rejected',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  note: string;
  applied_at?: string | null;
  updated_at: string;
  job?: Job | null;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: ApiMeta;
}

export interface MeResponse {
  user: User;
  profile: DeveloperProfile | null;
}

export interface JobInput {
  title: string;
  company: string;
  description: string;
  skills: string[];
  salary_min: number;
  salary_max: number;
  is_remote: boolean;
  location: string;
  url: string;
}

export interface ProfileInput {
  name: string;
  bio: string;
  skills: string[];
  experience_years: number;
  salary_min: number;
  salary_max: number;
  remote_only: boolean;
  github_url: string;
}

export interface JobQuery {
  page?: number;
  limit?: number;
  skills?: string[];
  remote?: boolean;
  salary_min?: number;
  salary_max?: number;
}

export interface Paginated<T> {
  items: T[];
  meta: ApiMeta | null;
}
