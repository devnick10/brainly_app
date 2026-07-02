import type { ExtendedPrismaClient } from '@brainly/db';
import type { Queue, Ai } from '@cloudflare/workers-types';

export type Bindings = {
  DATABASE_URL: string;
  AI: Ai;
  CONTENT_QUEUE: Queue;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: {
    prisma: ExtendedPrismaClient;
  };
};
