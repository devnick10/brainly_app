import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/lib/axios';
import { signinUser } from '../signinUser';

vi.mock('@/lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(apiClient.post);

beforeEach(() => {
  mockedPost.mockReset();
});

describe('signinUser', () => {
  it('sends credentials and returns token', async () => {
    mockedPost.mockResolvedValueOnce({
      data: { success: true, token: 'xyz' },
    });

    const result = await signinUser({ email: 'a@b.com', password: '1234' });
    expect(mockedPost).toHaveBeenCalledWith('/user/signin', {
      email: 'a@b.com',
      password: '1234',
    });
    expect(result.token).toBe('xyz');
  });

  it('throws on failure', async () => {
    mockedPost.mockRejectedValueOnce(new Error('Signin failed'));

    await expect(
      signinUser({ email: 'a@b.com', password: '1234' }),
    ).rejects.toThrow('Signin failed');
  });
});
