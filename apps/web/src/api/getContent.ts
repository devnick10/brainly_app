import { apiClient } from '@/lib/axios';
import type { Content } from '@/lib/types';

export async function getContent(): Promise<{
  success: boolean;
  content: Content[];
}> {
  const response = await apiClient.get(`/brain`);
  return response.data;
}
