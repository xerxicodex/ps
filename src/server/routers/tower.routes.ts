import { createAuthRouter } from "../createRouter";
import { getTowersHandler } from "../controllers/tower.controller";
import { z } from "zod";

const towerRouter = createAuthRouter()
    .query("list", {
        input: z
      .object({
        page: z.number().nullish(),
      })
      .nullish(),
        resolve: ({ ctx, input }) => getTowersHandler({ ctx, input }),
    })

export default towerRouter;
