import { createPrismaClient } from '@brainly/db';
import type { MessageBatch } from '@cloudflare/workers-types';
import { Bindings } from './types';
import { processContent } from './service/process-content';

export async function consumeContentQueue(
  batch: MessageBatch<{ contentId: string }>,
  env: Bindings,
) {
  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    for (const message of batch.messages) {
      try {
        await processContent(message.body.contentId, prisma, env);

        message.ack();
      } catch (error) {
        // @ts-ignore
        console.error(
          `Failed to process content ${message.body.contentId}`,
          error,
        );
        // Cloudflare Queue will automatically retry.
      }
    }
  } finally {
    prisma.$disconnect();
  }
}
