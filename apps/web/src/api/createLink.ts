import { apiClient } from '@/lib/axios';

type DataType = {
  share: boolean;
};

export async function createLink(data: DataType) {
  const response = await apiClient.post(`/brain/share`, data);
  return response.data;
}
