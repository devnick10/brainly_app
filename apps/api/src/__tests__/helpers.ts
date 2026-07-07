import type { ExtendedPrismaClient } from '@brainly/db';
import { vi } from 'vitest';

export const mockEnv = {
  ACCESS_ORIGIN: '*',
  DEV_ACCESS_ORIGIN: 'http://localhost:5173',
  DATABASE_URL: 'test-db-url',
  ACCESS_TOKEN_SECRET: 'test-access-secret',
  REFRESH_TOKEN_SECRET: 'test-refresh-secret',
  ACCESS_TOKEN_EXPIRY: '15min',
  REFRESH_TOKEN_EXPIRY: '7days',
  GOOGLE_CLIENT_ID: 'test-google-client-id',
  NODE_ENV: 'test',
  AI: { run: vi.fn() } as unknown as Ai,
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
    session: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $queryRaw: vi.fn(),
  }) as unknown as ExtendedPrismaClient;

export const mockPrisma = createMockPrisma();
