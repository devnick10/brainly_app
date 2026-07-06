import z from 'zod';
export const ContentType = {
  YOUTUBE: 'YOUTUBE',
  TWITTER: 'TWITTER',
  ARTICLE: 'ARTICLE',
  DOCUMENT: 'DOCUMENT',
} as const;

const CreateContentSchema = z.object({
  link: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(ContentType),
  tags: z.array(z.string()).optional(),
});

const DeleteContentSchema = z.object({
  contentId: z.string(),
});

const ShareLinkSchema = z.string().min(10);

export { CreateContentSchema, DeleteContentSchema, ShareLinkSchema };
