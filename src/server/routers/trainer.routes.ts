import { createAuthRouter } from "../createRouter";
import { getMeHandler } from "../controllers/trainer.controller";


const trainerRouter = createAuthRouter()
    .query("me", {
        resolve: ({ ctx }) => getMeHandler({ ctx }),
    })

export default trainerRouter;
