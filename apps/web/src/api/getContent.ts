import type { Content } from '@/lib/types';

export async function getContent(): Promise<{
  success: boolean;
  content: Content[];
}> {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/brain`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${String(localStorage.getItem('token'))}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get content');
  }

  return await response.json();
}
