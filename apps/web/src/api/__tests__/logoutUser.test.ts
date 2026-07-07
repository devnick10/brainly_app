import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/lib/axios';
import { logoutUser } from '../logoutUser';

vi.mock('@/lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(apiClient.post);

beforeEach(() => {
  mockedPost.mockReset();
});

describe('logoutUser', () => {
  it('sends POST to /user/logout', async () => {
    mockedPost.mockResolvedValueOnce({
      data: { success: true, message: 'Logged out successfully' },
    });

    const result = await logoutUser();

    expect(mockedPost).toHaveBeenCalledWith('/user/logout');
    expect(result.success).toBe(true);
    expect(result.message).toBe('Logged out successfully');
  });

  it('throws on failure', async () => {
    mockedPost.mockRejectedValueOnce(new Error('Network error'));

    await expect(logoutUser()).rejects.toThrow('Network error');
  });
});
