import { apiClient } from '@/lib/axios';
import type { UserData } from '../lib/types';

export async function signupUser(data: UserData) {
  const response = await apiClient.post(`/user/signup`, data);
  return response.data;
}
