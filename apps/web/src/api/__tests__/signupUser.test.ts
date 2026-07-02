import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signupUser } from '../signupUser';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('signupUser', () => {
  const baseUrl = 'http://localhost:8787/api/v1';
  vi.stubEnv('VITE_BASE_URL', baseUrl);

  it('sends email and password', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, token: 'abc' }),
    });

    const result = await signupUser({ email: 'a@b.com', password: '1234' });

    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: 'a@b.com', password: '1234' }),
    });
    expect(result.token).toBe('abc');
  });

  it('throws on error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(
      signupUser({ email: 'a@b.com', password: '1234' }),
    ).rejects.toThrow('Signup failed');
  });
});
