import { Hono } from 'hono';

const healthRouter = new Hono();

healthRouter.post('/', (c) => {
  return c.text('Health check is working');
});

export { healthRouter };
