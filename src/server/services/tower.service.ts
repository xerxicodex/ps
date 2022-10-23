import { Prisma, Tower } from "@prisma/client";
import { GiveBadgeToTrainer } from "./badge.service";
import { GiveRewardToTrainer } from "./reward.service";
import { GetTrainerById } from "./trainer.service";

export const CreateTower = async (input: Prisma.TowerCreateInput) => {
    return (await prisma.tower.create({
        data: input,
    })) as Tower;
};

export const FindTower = async (
    where: Partial<Prisma.TowerWhereInput>,
    select?: Prisma.TowerSelect
) => {
    return (await prisma.tower.findFirst({
        where,
        select,
    })) as Tower;
};

export const FindUniqueTower = async (
    where: Prisma.TowerWhereUniqueInput,
    select?: Prisma.TowerSelect
) => {
    return (await prisma.tower.findUnique({
        where,
        select,
    })) as Tower;
};

export const UpdateTower = async (
    where: Partial<Prisma.TowerWhereUniqueInput>,
    data: Prisma.TowerUpdateInput,
    select?: Prisma.TowerSelect
) => {
    return (await prisma.tower.update({ where, data, select })) as Tower;
};

export async function GetTowerList(props?: Prisma.TowerFindManyArgs) {
    return await prisma?.tower.findMany({ ...props })
}


export async function GetTowerById(id: number) {
    return await FindTower({ id });
}

export async function GetTowerByName(name: string) {
    return await FindTower({ name });
}

export async function DefeatTowerByTrainer(
    tower_id: number,
    trainer_id: number
) {
    const tower = await GetTowerById(tower_id);

    if (tower) {
        const trainer = await GetTrainerById(trainer_id);

        if (trainer) {
            const badges = await prisma.towerBadge.findMany({
                where: { tower },
            });

            while (badges.length > 0) {
                const id = badges.shift()?.badge_id;

                if (id) {
                    await GiveBadgeToTrainer(id, trainer.id);
                }
            }

            const rewards = await prisma.towerReward.findMany({
                where: { tower },
            });

            while (rewards.length > 0) {
                const id = rewards.shift()?.reward_id;

                if (id) {
                    await GiveRewardToTrainer(id, trainer.id);
                }
            }
        }
    }
}

export async function GetTowerPokemonById(id: number) {
    return await prisma.towerPokemon.findFirst({ where: { id } });
}