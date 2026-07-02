import type { PrismaClient } from '@brainly/db';
import { vi } from 'vitest';

export const mockEnv = {
  JWT_SECRET: 'test-secret',
  GOOGLE_CLIENT_ID: 'test-google-client-id',
  DATABASE_URL: 'test-db-url',
  ACCESS_ORIGIN: '*',
  DEV_ACCESS_ORIGIN: 'http://localhost:5173',
  AI: {} as Ai,
  CONTENT_QUEUE: { send: vi.fn() } as unknown as Queue,
};

const createMockPrisma = () =>
  ({
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    content: {
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    link: {
      findFirst: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    $queryRaw: vi.fn(),
  }) as unknown as PrismaClient;

export const mockPrisma = createMockPrisma();
