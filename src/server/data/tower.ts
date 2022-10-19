import { PrismaClient } from "@prisma/client";
import { GiveBadgeToTrainer } from "./badge";
import { GiveRewardToTrainer } from "./reward";
import { GetTrainerById } from "./trainer";

const prisma = new PrismaClient();

export async function GetTowerById(id: number) {
    return await prisma.tower.findFirst({ where: { id } });
}

export async function GetTowerByName(name: string) {
    return await prisma.tower.findFirst({ where: { name } });
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
