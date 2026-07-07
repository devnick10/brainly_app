import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/lib/axios';
import { googleSignIn } from '../googleSignIn';

vi.mock('@/lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(apiClient.post);

beforeEach(() => {
  mockedPost.mockReset();
});

describe('googleSignIn', () => {
  it('sends access token and returns result', async () => {
    mockedPost.mockResolvedValueOnce({
      status: 200,
      data: { success: true, token: 'gg-token' },
    });

    const result = await googleSignIn('google-access-token');

    expect(result.token).toBe('gg-token');
  });

  it('throws on failure', async () => {
    mockedPost.mockResolvedValueOnce({ status: 400 });

    await expect(googleSignIn('bad-token')).rejects.toThrow(
      'Google sign in failed',
    );
  });
});
