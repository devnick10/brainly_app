import { Router } from "express";
import { signin, signup } from "../controllers/user.controller";
const userRouter = Router();


userRouter.post('/signup',signup)
userRouter.post('/signin',signin)

export { userRouter };

