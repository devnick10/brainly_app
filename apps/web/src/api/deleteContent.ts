import { apiClient } from '@/lib/axios';

export async function deleteContent(contentId: string) {
  const response = await apiClient.delete(`/brain/${contentId}`);
  return response.data;
}
