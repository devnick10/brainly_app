import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUser } from '../getUser';

const mockFetch = vi.fn() as unknown as typeof fetch;
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
});

describe('getUser', () => {
  const baseUrl = 'http://localhost:8787/api/v1';
  vi.stubEnv('VITE_BASE_URL', baseUrl);

  it('sends auth header and returns user', async () => {
    localStorage.setItem('token', 'my-jwt');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: '1', email: 'a@b.com' },
      }),
    });

    const result = await getUser();
    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/user/me`, {
      method: 'GET',
      headers: { Authorization: 'Bearer my-jwt' },
    });
    expect(result.user.email).toBe('a@b.com');
  });

  it('throws when not authenticated', async () => {
    localStorage.setItem('token', 'bad');
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(getUser()).rejects.toThrow('Failed to fetch user');
  });
});
