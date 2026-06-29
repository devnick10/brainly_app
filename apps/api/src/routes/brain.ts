import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { authMiddleware } from '../middlewares/auth';
import { zValidator } from '../middlewares/validator';
import { CreateContentSchema } from '../schema/brainSchema';
import { AppContext } from '../types';
import { getMetadata } from '../metadata';
import { generateEmbedding } from '../lib/embeddings';

const brainRouter = new Hono<AppContext>();

brainRouter.get('/search', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const query = c.req.query('q');
  if (!query) {
    return c.json({ content: [] });
  }

  const prisma = c.get('prisma');

  const aiResponse = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [query],
  });
  const embedding = (aiResponse as { data: number[][] }).data[0];
  const embeddingStr = `[${embedding.join(',')}]`;

  const results = await prisma.$queryRawUnsafe<
    Array<{
      id: string;
      title: string;
      description: string | null;
      link: string;
      type: string;
      searchableText: string | null;
      userId: string;
      createdAt: Date;
      distance: number;
    }>
  >(
    `SELECT id, title, description, link, type, "searchableText", "userId", "createdAt",
             embedding <-> $1::vector AS distance
      FROM "Content"
      WHERE "userId" = $2
      ORDER BY distance
      LIMIT 10`,
    embeddingStr,
    userId,
  );

  return c.json({ content: results });
});

brainRouter.get('/', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = c.get('prisma');

  const content = await prisma.content.findMany({
    where: { userId },
    include: { tags: true },
    orderBy: { createdAt: 'desc' },
    omit: {
      searchableText: true,
    },
  });

  return c.json({ success: true, content });
});

brainRouter.post(
  '/',
  zValidator('json', CreateContentSchema),
  authMiddleware,
  async (c) => {
    const userId = c.get('userId');
    let { link, title, description, type, tags } = c.req.valid('json');
    const prisma = c.get('prisma');

    try {
      const metadata = await getMetadata(link);
      const searchableText = metadata.searchableText;
      const embedding = await generateEmbedding(searchableText, c.env.AI);

      // Create the content entry in the database
      await prisma.$transaction(async (tx) => {
        const newContent = await tx.content.create({
          data: {
            link,
            title,
            description,
            type,
            searchableText,
            imageUrl: metadata.imageUrl || null,
            siteName: metadata.siteName || null,
            author: metadata.author || null,
            userId,
            ...(tags?.length && {
              tags: {
                connectOrCreate: tags.map((tag) => ({
                  where: { title: tag },
                  create: { title: tag },
                })),
              },
            }),
          },
        });
        // Store the embedding in the database using raw SQL
        await tx.$executeRaw`UPDATE "Content" SET ${embedding}::vector WHERE id = ${newContent.id}`;
      });

      return c.json({
        message: 'Content created successfully',
      });
    } catch (error) {
      console.error('Error creating content:', error);
      throw new HTTPException(500, { message: 'Failed to create content' });
    }
  },
);

brainRouter.delete('/:contentId', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  const contentId = c.req.param('contentId');

  const result = await prisma.content.deleteMany({
    where: { id: contentId, userId },
  });

  if (result.count === 0) {
    throw new HTTPException(404, {
      message: 'Content not found or not authorized',
    });
  }

  return c.json({
    success: true,
    message: 'content deleted',
  });
});

brainRouter.post('/share', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  let share: boolean;
  try {
    const body = await c.req.json();
    share = body.share;
  } catch {
    throw new HTTPException(400, { message: 'Invalid request body' });
  }

  if (share) {
    const linkExist = await prisma.link.findFirst({ where: { userId } });

    if (linkExist) {
      return c.json({ success: true, hash: linkExist.hash });
    }

    const hash = crypto.randomUUID().replace(/-/g, '').slice(0, 10);

    await prisma.link.create({
      data: { hash, userId },
    });

    return c.json({ success: true, hash });
  } else {
    await prisma.link.deleteMany({ where: { userId } });

    return c.json({ success: true, message: 'Remove link' });
  }
});

brainRouter.get('/:sharelink', async (c) => {
  const prisma = c.get('prisma');
  const hash = c.req.param('sharelink');

  const link = await prisma.link.findFirst({ where: { hash } });

  if (!link) {
    return c.json({ success: false, message: 'sorry incorrect inputs' });
  }

  const content = await prisma.content.findMany({
    where: { userId: link.userId },
    include: { user: { select: { email: true } } },
  });

  return c.json({ success: true, content });
});

export { brainRouter };
