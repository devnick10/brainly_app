import { createPrismaClient } from '@brainly/db';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import errorMiddleware from './middlewares/globalError';
import { brainRouter } from './routes/brain';
import { userRouter } from './routes/user';
import { AppContext } from './types';

const app = new Hono<AppContext>();

// CORS MIDDLEWARE
app.use(
  '*',
  cors({
    origin: (origin, c) => {
      const ctx = c;
      if (origin === c.env.DEV_ACCESS_ORIGIN) {
        return origin;
      }
      return ctx.env?.ACCESS_ORIGIN || origin;
    },
    credentials: true,
  }),
);

// GLOBAL ERROR HANDLER
app.use('/api/*', errorMiddleware());

// PRISMA CLIENT MIDDLEWARE
app.use(
  '/api/*',
  createMiddleware<AppContext>(async (c, next) => {
    const prisma = createPrismaClient(c.env.DATABASE_URL);
    c.set('prisma', prisma);
    await next();
    await prisma.$disconnect();
  }),
);

// LOGGER
app.use(logger());

// HEALTH CHECK
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// APP ROUTES
app.route('/api/v1/brain', brainRouter);
app.route('/api/v1/user', userRouter);

export default app;
