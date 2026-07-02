import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthLayout } from '../AuthLayout';

describe('AuthLayout', () => {
  it('renders title and subtitle', () => {
    render(
      <MemoryRouter>
        <AuthLayout title="Welcome" subtitle="Sign in here">
          <div>form content</div>
        </AuthLayout>
      </MemoryRouter>,
    );
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Sign in here')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <MemoryRouter>
        <AuthLayout title="Test" subtitle="test">
          <button>submit</button>
        </AuthLayout>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });

  it('has a link back to home', () => {
    render(
      <MemoryRouter>
        <AuthLayout title="Test" subtitle="test">
          <div>content</div>
        </AuthLayout>
      </MemoryRouter>,
    );
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });
});
