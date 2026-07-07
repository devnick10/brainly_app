import { apiClient } from '@/lib/axios';
import type { ContentPayload } from '../lib/types';

export async function addContent(data: ContentPayload) {
  const response = await apiClient.post(`/brain`, data);
  return response.data;
}
