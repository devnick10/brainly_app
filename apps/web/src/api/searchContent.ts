import type { Content } from '@/lib/types';

export async function searchContent(
  query: string,
): Promise<{ success: boolean; content: Content[] }> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/brain/search?q=${encodeURIComponent(query)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${String(localStorage.getItem('token'))}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to search content');
  }

  return await response.json();
}
