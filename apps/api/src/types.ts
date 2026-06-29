import type { ExtendedPrismaClient } from '@brainly/db';

export type Bindings = {
  ACCESS_ORIGIN: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  AI: Ai;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: {
    prisma: ExtendedPrismaClient;
    userId: string;
  };
};
