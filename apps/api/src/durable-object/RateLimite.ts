import { DurableObject } from 'cloudflare:workers';
import { evaluate, type Buckets } from '../lib/sliding-window';

const BUCKETS_KEY = 'buckets';

/**
 * This Class executes when middleware is called and it will limit the number of requests that can be made to the API.
 * It uses the Durable Object to store the requests it has seen, bucketed per second, and hands them to the
 * sliding window algorithm. If the number of requests exceeds the limit, it will return a 429 status code.
 *
 * Durable Objects are single threaded and handle one request at a time per
 * object, so the read-sum-write below is already atomic. No compare-and-swap or
 * locking is needed, which is normally the hard part of this algorithm.
 */
export class RateLimiter extends DurableObject {
  async fetch(request: Request) {
    const { limit, window } = await request.json<{
      limit: number;
      window: number;
    }>();

    const stored = await this.ctx.storage.get<Buckets>(BUCKETS_KEY);

    const result = evaluate({
      buckets: stored ?? {},
      now: Date.now(),
      limit,
      window,
    });

    await this.ctx.storage.put(BUCKETS_KEY, result.buckets);

    return new Response(result.allowed ? 'OK' : 'Too Many Requests', {
      status: result.allowed ? 200 : 429,
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
        ...(result.allowed ? {} : { 'Retry-After': String(result.retryAfter) }),
      },
    });
  }
}
