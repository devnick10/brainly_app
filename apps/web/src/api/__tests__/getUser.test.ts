import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/lib/axios';
import { getUser } from '../getUser';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';

vi.mock('@/lib/axios', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(apiClient.get);

beforeEach(() => {
  mockedGet.mockReset();
  localStorage.clear();
});

describe('getUser', () => {
  it('sends auth header and returns user', async () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'my-jwt');
    mockedGet.mockResolvedValueOnce({
      data: { success: true, user: { id: '1', email: 'a@b.com' } },
    });

    const result = await getUser();
    expect(mockedGet).toHaveBeenCalledWith('/user/me');
    expect(result.user.email).toBe('a@b.com');
  });

  it('throws when not authenticated', async () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'bad');
    mockedGet.mockRejectedValueOnce(new Error('Failed to fetch user'));

    await expect(getUser()).rejects.toThrow('Failed to fetch user');
  });
});
