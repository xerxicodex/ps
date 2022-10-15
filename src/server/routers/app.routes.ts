import { createRouter } from "../createRouter";
import redisClient from "../utils/connectRedis";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

import connectDB from "../utils/prisma";

// Connect to Prisma
connectDB();

export const appRouter = createRouter()
  .query("ping", {
    resolve: async (ctx) => {
      return "pong";
    },
  })
  .query("hello", {
    resolve: async (ctx) => {
      const message = await redisClient.get("tRPC");
      return { message };
    },
  })
  .merge("auth.", authRouter)
  .merge("users.", userRouter);

export type AppRouter = typeof appRouter;
