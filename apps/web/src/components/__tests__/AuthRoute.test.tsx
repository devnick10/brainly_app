import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthRoute from '../AuthRoute';

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
    localStorage.setItem('token', 'some-token');
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
