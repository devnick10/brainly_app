import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { userModel } from "../models/userSchema";
const userRouter = Router();

declare global {
    namespace Express {
        export interface Request {
            userId: string;
        }
    }
}

userRouter.post('/signup', async (req: Request, res: Response) => {
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
userRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const userExist = await userModel.findOne({
        email,
        password
    })
    if (userExist) {
        const token = jwt.sign({ id: userExist.id }, JWT_SECRET as string)
        res.json({
            token
        })
    } else {
        res.status(411).json({
            message: "Incorrect credentials"
        });
    }
})

export { userRouter };

