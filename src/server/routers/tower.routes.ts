import { createAuthRouter } from "../createRouter";
import { ChallengeTowerHandler, GetTowersHandler, NewTowerChallengeHandler } from "../controllers/tower.controller";
import { z } from "zod";
import { Subscription } from "@trpc/server";
import { ITowerBattle, TowerBattleEngine } from "../engines/tower.engine";
import { EventEmitter } from "stream";

const ee = new EventEmitter();

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
    resolve: async ({ ctx, input }) => {
      const res: {
        status: string;
        battle: TowerBattleEngine;
    } = await ChallengeTowerHandler({ ctx, input });

      if (res.status == "success") {
        ee.emit("challengeUpdate", res.battle)
      }
      
      return res;
    },
  })
  .subscription("onChallangeUpdate", {
    resolve: async ({ ctx, input }) => {
      return new Subscription<ITowerBattle>((emit) => {
        const onChallangeUpdate = (data: ITowerBattle) => {
          emit.data(data);
        }
        
        ee.on("challengeUpdate", onChallangeUpdate);

        return () => {
          ee.off("challengeUpdate", onChallangeUpdate);
        }
      })
    }
  })


export default towerRouter;
