import { Router } from "express";
import {
    createContent,
    createShareableLink,
    deleteContent,
    getContent,
    getSharedBrain
} from "../controllers/brain.controller";
import { authMiddleware } from "../middleware/auth";
const contentRouter = Router();

declare global {
    namespace Express {
        export interface Request {
            userId: string;
        }
    }
}

contentRouter.post('/create', authMiddleware, createContent)

contentRouter.get('/', authMiddleware, getContent)

contentRouter.delete('/:contentId', authMiddleware, deleteContent)

contentRouter.post('/share', authMiddleware, createShareableLink)

contentRouter.get('/:sharelink', getSharedBrain)

export { contentRouter };

