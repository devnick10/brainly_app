import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller";
const healthCheckRouter = Router();


healthCheckRouter.get('/',healthCheck)

export { healthCheckRouter };

