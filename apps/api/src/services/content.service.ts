import { HTTPException } from 'hono/http-exception';
import { generateEmbedding } from '@brainly/ai';
import { publisher } from '../lib/publisher';
import type { ExtendedPrismaClient } from '@brainly/db';
import type { SearchResult } from '../types';
import type { ContentType } from '../schema/brainSchema';

export async function searchContent(
  prisma: ExtendedPrismaClient,
  userId: string,
  query: string,
  ai: Ai,
): Promise<SearchResult> {
  const embedding = await generateEmbedding(query, ai);
  const embeddingStr = `[${embedding.join(',')}]`;

  const results = await prisma.$queryRaw<SearchResult>`
    SELECT
      id,
      title,
      description,
      link,
      type,
      "searchableText",
      "imageUrl",
      "userId",
      "createdAt",
      embedding <-> ${embeddingStr}::vector AS distance
    FROM "Content"
    WHERE "userId" = ${userId}
      AND status = 'COMPLETED'
    ORDER BY distance
    LIMIT 10;
  `;

  return results;
}

export async function getUserContent(
  prisma: ExtendedPrismaClient,
  userId: string,
) {
  return prisma.content.findMany({
    where: { userId },
    include: { tags: true },
    orderBy: { createdAt: 'desc' },
    omit: { searchableText: true },
  });
}

export async function createContent(
  prisma: ExtendedPrismaClient,
  userId: string,
  data: {
    link: string;
    title: string;
    description?: string;
    type: keyof typeof ContentType;
    tags?: string[];
  },
  queue: Queue,
): Promise<void> {
  const newContent = await prisma.content.create({
    data: {
      link: data.link,
      title: data.title,
      description: data.description,
      type: data.type,
      userId,
      ...(data.tags?.length && {
        tags: {
          connectOrCreate: data.tags.map((tag) => ({
            where: { title: tag },
            create: { title: tag },
          })),
        },
      }),
    },
  });

  await publisher(queue, { contentId: newContent.id });
}

export async function deleteContent(
  prisma: ExtendedPrismaClient,
  userId: string,
  contentId: string,
): Promise<void> {
  const result = await prisma.content.deleteMany({
    where: { id: contentId, userId },
  });

  if (result.count === 0) {
    throw new HTTPException(404, {
      message: 'Content not found or not authorized',
    });
  }
}

export async function getShareLink(
  prisma: ExtendedPrismaClient,
  userId: string,
) {
  return prisma.link.findFirst({ where: { userId } });
}

export async function createShareLink(
  prisma: ExtendedPrismaClient,
  userId: string,
): Promise<string> {
  const hash = crypto.randomUUID().replace(/-/g, '');

  await prisma.link.create({
    data: { hash, userId },
  });

  return hash;
}

export async function removeShareLink(
  prisma: ExtendedPrismaClient,
  userId: string,
): Promise<void> {
  await prisma.link.deleteMany({ where: { userId } });
}

export async function getSharedContent(
  prisma: ExtendedPrismaClient,
  hash: string,
) {
  const link = await prisma.link.findFirst({ where: { hash } });

  if (!link) {
    throw new HTTPException(404, { message: 'Share link not found' });
  }

  return prisma.content.findMany({
    where: { userId: link.userId },
    omit: { searchableText: true },
  });
}
