export async function googleSignIn(accessToken: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ credential: accessToken }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || 'Google sign in failed');
  }

  return await response.json();
}
