import { PrismaClient } from './generated/prisma/client.js';
import { withAccelerate } from '@prisma/extension-accelerate';

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

export function createPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    accelerateUrl: databaseUrl,
  }).$extends(withAccelerate());
}
