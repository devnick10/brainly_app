import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/lib/axios';
import { signupUser } from '../signupUser';

vi.mock('@/lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(apiClient.post);

beforeEach(() => {
  mockedPost.mockReset();
});

describe('signupUser', () => {
  it('sends email and password', async () => {
    mockedPost.mockResolvedValueOnce({
      data: { success: true, token: 'abc' },
    });

    const result = await signupUser({ email: 'a@b.com', password: '1234' });

    expect(mockedPost).toHaveBeenCalledWith('/user/signup', {
      email: 'a@b.com',
      password: '1234',
    });
    expect(result.token).toBe('abc');
  });

  it('throws on error', async () => {
    mockedPost.mockRejectedValueOnce(new Error('Signup failed'));

    await expect(
      signupUser({ email: 'a@b.com', password: '1234' }),
    ).rejects.toThrow('Signup failed');
  });
});
