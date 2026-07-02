import { generateEmbedding } from '@brainly/ai';
import { ExtendedPrismaClient } from '@brainly/db';
import { Bindings } from '../types';
import { getMetadata } from '../metadata';

export async function processContent(
  contentId: string,
  prisma: ExtendedPrismaClient,
  env: Bindings,
) {
  try {
    // Get content from database
    const content = await prisma.content.findFirst({
      where: { id: contentId, status: 'PROCESSING' },
    });

    if (!content) {
      throw new Error(`Content with ID ${contentId} not found`);
    }

    //  Fetch metadata
    const metadata = await getMetadata(content.link);

    //  Generate embedding
    const embedding = await generateEmbedding(metadata.searchableText, env.AI);

    //  Update database
    const embeddingStr = `[${embedding.join(',')}]`;

    // Update the content record with the embedding and metadata and mark it as COMPLETED.
    await prisma.$executeRaw`
        UPDATE "Content"
        SET
        embedding = ${embeddingStr}::vector,
        "searchableText" = ${metadata.searchableText},
        "imageUrl" = ${metadata.imageUrl || content.link},
        "siteName" = ${metadata.siteName || ''},
        "status" = 'COMPLETED',
        author = ${metadata.author || null}
        WHERE id = ${content.id};
        `;
  } catch (error) {
    console.error('Error processing content:', error);
    throw error;
  }
}
