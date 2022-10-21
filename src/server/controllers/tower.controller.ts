import { Prisma, Tower } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../createContext";
import { GetTowerList, GetTowerById } from "../data/tower";
import { createPaginator } from 'prisma-pagination'

export const getTowersHandler = async ({ ctx }: { ctx: Context }) => {
    try {
        // const trainer = ctx.trainer;
        const paginate = createPaginator({ perPage: ctx.limit ?? 20 })

        const results = await paginate<Tower, Prisma.TowerFindManyArgs>(
            prisma.tower,
            {
                include: { pokemon: { orderBy: [{ floor: "desc" }, { level: "desc" }], include: { pokemon: true } } },
                orderBy: {
                    difficulty: 'asc',
                }
            },
            { page: ctx.page ?? 1 }
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
