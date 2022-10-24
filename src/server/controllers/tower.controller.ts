import { Prisma, Tower } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../createContext";
import { createPaginator } from 'prisma-pagination'
import { GetTrainerActiveTowerChallenge, GetTrainerRoster, TrainerChallengeTower } from "../services/trainer.service";
import { TowerBattleEngine } from "../engines/tower.engine";

export const GetTowersHandler = async ({ ctx, input }: { ctx: Context, input: any }) => {
    // const input = {};
    console.log("getTowersHandler", { input })
    try {
        // const trainer = ctx.trainer;
        const paginate = createPaginator({ perPage: input?.limit ?? 20 })

        const results = await paginate<Tower, Prisma.TowerFindManyArgs>(
            prisma.tower,
            {
                include: { pokemon: { orderBy: [{ floor: "desc" }, { level: "desc" }, { pokemon: { power: 'desc' } }, { pokemon: { name: 'desc' } }, { id: 'asc' }], include: { pokemon: true } }, rewards: { include: { reward: true } } },
                // orderBy: {
                //     difficulty: 'asc',
                // }
            },
            { page: input?.page ?? 1 }
        )

        const res: any = {
            status: "success",
            ...results
        };

        delete res.data;

        return { ...res, ...{ towers: results.data } };
    } catch (err: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err.message,
        });
    }
};


export const ChallengeTowerHandler = async ({ ctx, input }: { ctx: Context, input: { tower_id: number} }) => {
    console.log("ChallengeTowerHandler", { input })
    try {
        const trainer = ctx.trainer;

        if (trainer) {
            const activeChallenge = await GetTrainerActiveTowerChallenge(trainer.id);

            if (!activeChallenge) {

                const trainerRoster = await GetTrainerRoster(trainer.id);

                if (trainerRoster.length > 0) {
                    
                    const challenge = await TrainerChallengeTower(trainer.id, input.tower_id)
    
                    const battle = new TowerBattleEngine(trainer, trainerRoster, challenge);
                    
                    return {
                        status: "success",
                        battle,
                    };

                } else {
                    throw("trainer doesn't have any roster pokemon")
                }
            } else {
                throw("trainer has an existing challenge")
            }
        } else {
            throw("trainer isn't active")
        }
    } catch (err: any) {
        console.log('ChallengeTowerHandler error', err)
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err.message,
        });
    }
}