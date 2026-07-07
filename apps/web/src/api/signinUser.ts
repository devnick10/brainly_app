import { apiClient } from '@/lib/axios';
import type { UserData } from '../lib/types';

export async function signinUser(data: UserData) {
  const response = await apiClient.post(`/user/signin`, data);
  return response.data;
}
