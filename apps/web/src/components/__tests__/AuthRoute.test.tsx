import '../../test/setup';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthRoute from '../AuthRoute';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';

beforeEach(() => {
  localStorage.clear();
});

describe('AuthRoute', () => {
  it('renders children when not authenticated', () => {
    render(
      <MemoryRouter>
        <AuthRoute>
          <div>public content</div>
        </AuthRoute>
      </MemoryRouter>,
    );
    expect(screen.getByText('public content')).toBeInTheDocument();
  });

  it('redirects to dashboard when authenticated', () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'some-token');
    render(
      <MemoryRouter>
        <AuthRoute>
          <div>public content</div>
        </AuthRoute>
      </MemoryRouter>,
    );
    expect(screen.queryByText('public content')).not.toBeInTheDocument();
  });
});
