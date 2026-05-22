import { api, unwrap } from './client';
import type { ApiResponse, TokenPair, User } from './types';

export async function login(email: string, password: string): Promise<TokenPair> {
  const res = await api.post<ApiResponse<TokenPair>>('/auth/login', { email, password });
  return unwrap(res.data);
}

export async function register(email: string, password: string): Promise<User> {
  const res = await api.post<ApiResponse<User>>('/auth/register', { email, password });
  return unwrap(res.data);
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refresh_token: refreshToken });
}
