import { Request, Router } from "express";
import { authMiddleware } from "../middleware";
import { contentModel } from "../models/contentSchema";
import { linkModel } from "../models/linkSchema"
import { random } from "../utils";
const contentRouter = Router();

declare global {
    namespace Express {
        export interface Request {
            userId: string;
        }
    }
}



contentRouter.post('/content', authMiddleware, async (req, res) => {
    const { link, title, type } = req.body;
    const userId = req.userId;

    try {
        await contentModel.create({
            link,
            title,
            type,
            userId,
            tags: []
        })

        res.json({ message: "content added" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to add content" })
    }
})

contentRouter.get('/content', authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const userContent = await contentModel.find({
            userId
        }).populate('userId', 'email')

        res.json({
            content: userContent
        })
    } catch (error) {
        res.json({
            message: "Failed to get content"
        })
    }
})

contentRouter.delete('/content', authMiddleware, async (req, res) => {
    const { contentId } = req.body;
    await contentModel.deleteOne({
        id: contentId,
        userId: req.userId
    })
    res.json({ message: "content deleted" })
})

contentRouter.post('/brain/share', authMiddleware, async (req: Request, res) => {
    const { share } = req.body;
    const userId = req.userId;

    if (share) {
        const linkExist = await linkModel.findOne({
            userId
        })

        if (linkExist) {
            res.json({
                hash: linkExist.hash
            })
            return
        }

        const hash = random(10);

        await linkModel.create({
            hash,
            userId
        })

        res.json({
            hash
        })
    } else {
        await linkModel.deleteOne({
            userId
        })
        res.json({
            message: "Remove link"
        })
    }
})

contentRouter.get('/brain/:sharelink', async (req: Request, res) => {
    const hash = req.params.sharelink;
    try {
        const link = await linkModel.findOne({
            hash
        })

        if (!link) {
            res.json({
                message: "sorry incorrect inputs"
            })
            return;
        }

        const content = await contentModel.find({
            userId: link.userId
        }).populate("userId", "email")

        res.json({
            content
        })
    } catch (error) {
        res.json({
            message: "content not available"
        })
    }
})

export { contentRouter };

