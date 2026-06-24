import z, { string } from "zod";
enum ContenType { "youtube", "twitter", "other" }
const createContentSchema = z.object({
    link: z.string(),
    title: z.string(),
    type: z.enum(ContenType)
})

const deleteContentSchema = z.object({
    contentId: string
})

export {
    createContentSchema,
    deleteContentSchema
};

