import '../../test/setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateRoute from '../PrivateRoute';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';
import { getUser } from '@/api/getUser';

vi.mock('@/api/getUser', () => ({
  getUser: vi.fn(),
}));

const mockedGetUser = vi.mocked(getUser);

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockedGetUser.mockReset();
});

describe('PrivateRoute', () => {
  it('redirects to signin when no token', () => {
    renderWithProviders(
      <PrivateRoute>
        <div>protected content</div>
      </PrivateRoute>,
    );

    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('shows skeleton while loading', () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'some-token');
    mockedGetUser.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <PrivateRoute>
        <div>protected content</div>
      </PrivateRoute>,
    );

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('redirects to signin when user data is falsy', async () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'some-token');
    mockedGetUser.mockResolvedValue({
      success: true,
      user: undefined as unknown as {
        id: string;
        email: string;
        createdAt: string;
      },
    });

    renderWithProviders(
      <PrivateRoute>
        <div>protected content</div>
      </PrivateRoute>,
    );

    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', async () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'some-token');
    mockedGetUser.mockResolvedValue({
      success: true,
      user: { id: '1', email: 'a@b.com', createdAt: '2024-01-01' },
    });

    renderWithProviders(
      <PrivateRoute>
        <div>protected content</div>
      </PrivateRoute>,
    );

    expect(await screen.findByText('protected content')).toBeInTheDocument();
  });
});
