import { createMiddleware } from 'hono/factory'
import { Bindings } from '../types'

export const authMiddleware = createMiddleware<{ Bindings: Bindings, Variables: { userId: string } }>(async (c, next) => {
  //TODO
  // get token from header 
  // verify using jwt 
  // token valid set userId in context
  c.set("userId", "ksjkdfjk")
  await next()
})
