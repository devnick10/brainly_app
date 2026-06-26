import z, { string } from "zod";
export const ContentType = {
  YOUTUBE: 'YOUTUBE',
  TWITTER: 'TWITTER',
  ARTICLE: 'ARTICLE',
  DOCUMENT: 'DOCUMENT'
} as const
const CreateContentSchema = z.object({
    link: z.string(),
    title: z.string(),
    description: z.string().optional(),
    type: z.enum(ContentType)
})

const DeleteContentSchema = z.object({
    contentId: string
})

export {
    CreateContentSchema,
    DeleteContentSchema
};

