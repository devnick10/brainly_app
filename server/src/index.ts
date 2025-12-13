import cors from "cors";
import express from "express";

import morgan from "morgan";
import { config } from "./config/config";
import { errorHandler } from "./middleware/errorHandler";
import { contentRouter } from "./routes/brain.route";
import { userRouter } from './routes/user.route';
import { healthCheckRouter } from "./routes/healthcheck.route";

const app = express();

app.use(cors({
    origin: [`${config.get("FRONDEND_URL")}`],
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials: true
}))

if (config.get("NODE_ENV") === "development") {
    app.use(morgan('dev'))
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use('/api/v1/user', userRouter)
app.use('/api/v1/brain', contentRouter)
app.use('/',healthCheckRouter);

// error handler
app.use(errorHandler)

export { app };
