import type { PrismaClient } from "./generated/prisma/client.js";

export type Bindings = {
  ACCESS_ORIGIN: string
  DATABASE_URL: string
  JWT_SECRET: string
}

export type AppContext = {
  Bindings: Bindings, Variables: {
    prisma: PrismaClient;
    userId: string
  };
}
