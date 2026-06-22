import { Hono } from "hono"
import { Bindings } from "../types";


const userRouter = new Hono<{ Bindings: Bindings }>()

userRouter.post("/signup", (c) => {

})
userRouter.post("/signin", (c) => {

})

export { userRouter };