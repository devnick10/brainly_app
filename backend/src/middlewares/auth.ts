import { createMiddleware } from 'hono/factory'
import { AppContext } from '../types'

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  //TODO
  // get token from header 
  // verify using jwt 
  // token valid set userId in context
  c.set("userId", "ksjkdfjk")
  await next()
})
