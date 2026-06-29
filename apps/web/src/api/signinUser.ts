import type { UserData } from '../lib/types';

export async function signinUser(data: UserData) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return await response.json();
}
