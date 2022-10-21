import { createAuthRouter } from "../createRouter";
import { getTowersHandler } from "../controllers/tower.controller";

const towerRouter = createAuthRouter()
    .query("list", {
        resolve: ({ ctx }) => getTowersHandler({ ctx }),
    })

export default towerRouter;
