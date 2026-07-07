import { apiClient } from '@/lib/axios';
import type { Content } from '@/lib/types';

export async function searchContent(
  query: string,
): Promise<{ success: boolean; content: Content[] }> {
  const response = await apiClient.get(
    `/brain/search?q=${encodeURIComponent(query)}`,
  );
  return await response.data;
}
