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
      // 1. Allow server-to-server or tool traffic that lacks an origin header
      if (!origin) return '';

      // 2. Strict match against environments
      if (
        origin === c.env.DEV_ACCESS_ORIGIN ||
        origin === c.env.PROD_ACCESS_ORIGIN
      ) {
        return origin;
      }
      // 3. Explicitly reject all other origins
      return '';
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
