import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BrainlyLanding from '../LandingPage';

function renderPage() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <BrainlyLanding />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LandingPage', () => {
  it('renders the hero heading', () => {
    renderPage();
    expect(screen.getByText('Save, Search & Share')).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    renderPage();
    expect(
      screen.getByRole('link', { name: /start building your brain/i }),
    ).toBeInTheDocument();
  });

  it('renders sign in link', () => {
    renderPage();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders Get Started button in header', () => {
    renderPage();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders the features section', () => {
    renderPage();
    expect(screen.getByText('Powerful Features')).toBeInTheDocument();
  });

  it('renders the how it works section', () => {
    renderPage();
    expect(screen.getByText('From Link to Insight')).toBeInTheDocument();
  });

  it('renders the CTA section at bottom', () => {
    renderPage();
    expect(screen.getByText('Ready to Build Your Brain?')).toBeInTheDocument();
  });
});
