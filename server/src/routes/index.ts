import { Request, Response, Router } from "express";
import { contentModel, linkModel, userModel } from "../db/db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { authMiddleware } from "../middleware";
import { random } from "../utils";
const router = Router();

declare global {
    namespace Express {
        export interface Request {
            userId: string;
        }
    }
}

router.post('/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        await userModel.create({
            email,
            password
        })
        res.json({
            message: "You are singup now signin"
        })
    } catch (error) {
        console.error(error);
        res.status(411).json({
            message: "User allready exist"
        });
    }
})
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const userExist = await userModel.findOne({
        email,
        password
    })
    if (userExist) {
        const token = jwt.sign({ id: userExist.id }, JWT_PASSWORD)
        res.json({
            token
        })
    } else {
        res.status(411).json({
            message: "Incorrect credentials"
        });
    }
})

router.post('/content', authMiddleware, async (req, res) => {
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

router.get('/content', authMiddleware, async (req, res) => {
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

router.delete('/content', authMiddleware, async (req, res) => {
    const { contentId } = req.body;
    await contentModel.deleteOne({
        id: contentId,
        userId: req.userId
    })
    res.json({ message: "content deleted" })
})

router.post('/brain/share', authMiddleware, async (req: Request, res) => {
    const { share } = req.body;
    const userId = req.userId;

    if (share) {
        const linkExist = await linkModel.findOne({
            userId
        })

        if (linkExist) {
            res.json({
                hash:linkExist.hash
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

router.get('/brain/:sharelink', async (req: Request, res) => {
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

export { router }
