import {
    loginHandler,
    logoutHandler,
    refreshAccessTokenHandler,
    registerHandler,
} from "../controllers/auth.controller";
import { createRouter } from "../createRouter";
import { createTrainerSchema, loginTrainerSchema } from "../schema/trainer.schema";

const authRouter = createRouter()
    .mutation("register", {
        input: createTrainerSchema,
        resolve: ({ input }) => registerHandler({ input }),
    })
    .mutation("login", {
        input: loginTrainerSchema,
        resolve: async ({ input, ctx }) => await loginHandler({ input, ctx }),
    })
    .mutation("logout", {
        resolve: ({ ctx }) => logoutHandler({ ctx }),
    })
    .query("refresh", {
        resolve: ({ ctx }) => refreshAccessTokenHandler({ ctx }),
    });

export default authRouter;
