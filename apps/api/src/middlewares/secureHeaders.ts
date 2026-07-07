import { createMiddleware } from 'hono/factory';
import type { AppContext } from '../types';

const CSP = [
  "default-src 'none'",
  "frame-ancestors 'none'",
  'base-uri none',
  'form-action none',
].join('; ');

export const secureHeaders = createMiddleware<AppContext>(async (c, next) => {
  const isProduction = c.env.NODE_ENV === 'production';

  c.header('Content-Security-Policy', CSP);
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  c.header('X-XSS-Protection', '0');

  if (isProduction) {
    c.header(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
  }

  await next();
});
