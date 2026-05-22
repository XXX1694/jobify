import { api, unwrap } from './client';
import type { ApiResponse, DeveloperProfile, MeResponse, ProfileInput } from './types';

export async function getMe(): Promise<MeResponse> {
  const res = await api.get<ApiResponse<MeResponse>>('/me');
  return unwrap(res.data);
}

export async function updateProfile(input: ProfileInput): Promise<DeveloperProfile> {
  const res = await api.put<ApiResponse<DeveloperProfile>>('/me', input);
  return unwrap(res.data);
}
