import z, { string } from "zod";
import { ContentType } from "../generated/prisma/enums";
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

