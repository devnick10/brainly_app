import { Hono } from "hono"
import { AppContext, Bindings } from "../types";


const userRouter = new Hono<AppContext>()

userRouter.post("/signup", (c) => {

})
userRouter.post("/signin", (c) => {

})

export { userRouter };