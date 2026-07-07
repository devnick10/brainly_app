import { apiClient } from '@/lib/axios';

export async function googleSignIn(accessToken: string) {
  const response = await apiClient.post(
    `${import.meta.env.VITE_BASE_URL}/user/google`,
    {
      credential: accessToken,
    },
  );

  if (response.status !== 200) {
    throw new Error('Google sign in failed');
  }

  return response.data;
}
