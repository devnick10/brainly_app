import type { ExtendedPrismaClient } from '@brainly/db';

export type Bindings = {
  ACCESS_ORIGIN: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  AI: Ai;
  CONTENT_QUEUE: Queue;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: {
    prisma: ExtendedPrismaClient;
    userId: string;
  };
};

export interface ContentProcessingJob {
  contentId: string;
}

export type SearchResult = {
  id: string;
  title: string;
  description: string | null;
  link: string;
  type: string;
  searchableText: string | null;
  userId: string;
  createdAt: Date;
  distance: number;
}[];
