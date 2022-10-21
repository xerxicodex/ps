import { router } from "@trpc/server";
import superjson from "superjson";
import * as trpc from "@trpc/server";
import { Context } from "./createContext";
import { findUniqueTrainer } from "./services/trainer.service";
import redisClient from "./utils/connectRedis";
import { verifyJwt } from "./utils/jwt";

export function createRouter() {
    return router<Context>().transformer(superjson);
}

export function createAuthRouter() {
    return createRouter().middleware(async ({ ctx, next }) => {
        const notAuthorized = () => {
            throw new trpc.TRPCError({
                code: "UNAUTHORIZED",
                message: "You must be logged in to access this resource",
            });
        }

        const { req, res } = ctx;

        let access_token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            access_token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }

        if (!access_token) {
            notAuthorized();
        }

        // Validate Access Token
        const decoded = verifyJwt<{ sub: string }>(
            access_token ?? "",
            "accessTokenPublicKey"
        );

        if (!decoded) {
            notAuthorized();
        }

        // Check if  trainerhas a valid session
        const session = await redisClient.get(`trainer-${decoded?.sub}`);

        if (!session) {
            notAuthorized();
        } else {
            const trainer = await findUniqueTrainer({ id: JSON.parse(session).id });
            ctx.trainer = trainer;
        }

        return next();
    })
}
