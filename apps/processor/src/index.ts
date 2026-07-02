import { createPrismaClient } from '@brainly/db';
import { ExecutionContext, Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { healthRouter } from './routes/health';
import { retryRouter } from './routes/retry';
import { AppContext } from './types';
import { consumeContentQueue } from './consumer';
import { MessageBatch } from '@cloudflare/workers-types';
import { Bindings } from './types';

const app = new Hono();

app.use(
  '/api/*',
  createMiddleware<AppContext>(async (c, next) => {
    const prisma = createPrismaClient(c.env.DATABASE_URL);
    c.set('prisma', prisma);
    await next();
    await prisma.$disconnect();
  }),
);

app.route('/api/retry', retryRouter);
app.route('/api//health', healthRouter);

export default {
  fetch: app.fetch,
  // This is the queue handler for the CONTENT_QUEUE
  async queue(
    batch: MessageBatch<{ contentId: string }>,
    env: Bindings,
    ctx: ExecutionContext,
  ) {
    await consumeContentQueue(batch, env);
  },
};
