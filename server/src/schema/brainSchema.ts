import { Types } from "mongoose";
import z from "zod";
enum ContenType {"youtube","twitter","other"}
const createContentSchema = z.object({
    link:z.string(),
    title: z.string(),
    type: z.enum(ContenType)
})

const deleteContentSchema = z.object({
    contentId:Types.ObjectId
})

export {
    createContentSchema,
    deleteContentSchema
};

