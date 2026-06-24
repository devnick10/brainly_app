import { Hono } from "hono"
import { AppContext, Bindings } from "../types"


const brainRouter = new Hono<AppContext>()

brainRouter.get("/:search", (c) => {
    // get all brians 
})

brainRouter.post("/", (c) => {
    // create brain
})

brainRouter.delete("/:contentId", (c) => {
    // delete brain
})

brainRouter.post("/share", (c) => {

    // create shareable link
})

brainRouter.get("/shareLink", (c) => {
    // get shared brain
})

export { brainRouter };