import { createRouter } from "../createRouter";
import redisClient from "../utils/connectRedis";
import authRouter from "./auth.routes";
import trainerRouter from "./trainer.routes";

import connectDB from "../utils/prisma";
import towerRouter from "./tower.routes";

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
    .merge("trainer.", trainerRouter)
    .merge("tower.", towerRouter);

export type AppRouter = typeof appRouter;
