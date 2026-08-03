import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { AppContext } from '../types';
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests/minute/IP
interface RateLimitPayload {
  key: (c: Context<AppContext>) => string;
  limit: number;
  window: number;
}

export const rateLimit = ({ key, limit, window }: RateLimitPayload) =>
  createMiddleware<AppContext>(async (c, next) => {
    const rateLimitKey = key(c);

    const id = c.env.RATE_LIMITER.idFromName(rateLimitKey);
    const stub = c.env.RATE_LIMITER.get(id);

    /** We call the Durable Object to check the rate limit , that logic in RateLimiter class */

    const res = await stub.fetch('https://rate-limit/check', {
      method: 'POST',
      body: JSON.stringify({
        limit,
        window,
      }),
    });

    if (!res.ok) {
      return c.json({ message: 'Too many requests' }, 429);
    }

    await next();
  });

export function createRateLimit(
  limit = RATE_LIMIT_MAX_REQUESTS,
  window = RATE_LIMIT_WINDOW,
) {
  return rateLimit({
    key: (c) => {
      return c.req.header('CF-Connecting-IP') ?? '127.0.0.1';
    },
    limit,
    window,
  });
}
