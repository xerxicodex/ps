import { createRouter } from '../createRouter';
import redisClient from '../utils/connectRedis';
import connectDB from '../utils/prisma';

// Connect to Prisma
connectDB();

export const appRouter = createRouter().query('ping', {
    resolve: async (ctx) => {
      return "pong"
    },
  }).query('hello', {
  resolve: async (ctx) => {
    const message = await redisClient.get('tRPC');
    return { message };
  },
});

export type AppRouter = typeof appRouter;