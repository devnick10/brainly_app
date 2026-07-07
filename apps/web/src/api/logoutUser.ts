import { apiClient } from '@/lib/axios';

export async function logoutUser() {
  const response = await apiClient.post('/user/logout');
  return response.data;
}
