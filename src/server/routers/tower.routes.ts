import { createAuthRouter } from "../createRouter";
import { ChallengeTowerHandler, GetTowersHandler } from "../controllers/tower.controller";
import { z } from "zod";

const towerRouter = createAuthRouter()
    .query("list", {
        input: z
      .object({
        page: z.number().nullish(),
      })
      .nullish(),
        resolve: ({ ctx, input }) => GetTowersHandler({ ctx, input }),
    })
    .mutation("challenge", {
      input: z.object({
        tower_id: z.number()
      }),
      resolve: async ({ ctx, input }) => await ChallengeTowerHandler({ ctx, input }),
  })

export default towerRouter;
