import apiClient from '@/lib/axios';
import type { QueryKey } from '@tanstack/react-query';

export async function sharedBrain({ queryKey }: { queryKey: QueryKey }) {
  const response = await apiClient.get(`/brain/` + queryKey[0]);
  return response.data;
}
