import { describe, it, expect, vi, beforeEach } from 'vitest';
import { googleSignIn } from '../googleSignIn';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('googleSignIn', () => {
  const baseUrl = 'http://localhost:8787/api/v1';
  vi.stubEnv('VITE_BASE_URL', baseUrl);

  it('sends access token and returns result', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, token: 'gg-token' }),
    });

    const result = await googleSignIn('google-access-token');

    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/user/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential: 'google-access-token' }),
    });
    expect(result.token).toBe('gg-token');
  });

  it('throws with server message on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid token' }),
    });

    await expect(googleSignIn('bad-token')).rejects.toThrow('Invalid token');
  });

  it('throws generic message when no error body', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => null });

    await expect(googleSignIn('bad-token')).rejects.toThrow(
      'Google sign in failed',
    );
  });
});
