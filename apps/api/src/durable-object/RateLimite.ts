import { DurableObject } from 'cloudflare:workers';

/**
 * This Class executes when middleware is called and it will limit the number of requests that can be made to the API.
 * It uses the Durable Object to store the number of requests made and the time when the limit will reset.
 * If the number of requests exceeds the limit, it will return a 429 status code.
 */
export class RateLimiter extends DurableObject {
  async fetch(request: Request) {
    const { limit, window } = await request.json<{
      limit: number;
      window: number;
    }>();

    const now = Date.now();

    const resetAt = (await this.ctx.storage.get<number>('resetAt')) ?? 0;

    let count = (await this.ctx.storage.get<number>('count')) ?? 0;

    if (now > resetAt) {
      count = 0;

      await this.ctx.storage.put('resetAt', now + window * 1000);
    }

    count++;

    await this.ctx.storage.put('count', count);

    if (count > limit) {
      return new Response('Too Many Requests', {
        status: 429,
      });
    }

    return new Response('OK');
  }
}
