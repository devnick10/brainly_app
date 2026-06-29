interface User {
  id: string;
  email: string;
  createdAt: string;
}

export async function getUser(): Promise<{ success: boolean; user: User }> {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${String(localStorage.getItem('token'))}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return await response.json();
}
