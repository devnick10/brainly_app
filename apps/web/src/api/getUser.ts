import { apiClient } from '@/lib/axios';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

export async function getUser(): Promise<{ success: boolean; user: User }> {
  const response = await apiClient.get(`/user/me`);
  return response.data;
}
