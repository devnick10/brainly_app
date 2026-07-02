import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signinUser } from '../signinUser';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('signinUser', () => {
  const baseUrl = 'http://localhost:8787/api/v1';
  vi.stubEnv('VITE_BASE_URL', baseUrl);

  it('sends credentials and returns token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, token: 'xyz' }),
    });

    const result = await signinUser({ email: 'a@b.com', password: '1234' });
    expect(result.token).toBe('xyz');
  });

  it('throws on failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(
      signinUser({ email: 'a@b.com', password: '1234' }),
    ).rejects.toThrow();
  });
});
