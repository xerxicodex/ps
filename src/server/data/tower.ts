import { PrismaClient } from "@prisma/client";
import { GetTrainerById } from "./trainer";

const prisma = new PrismaClient();

export async function GetTowerById(id: number) {
    return await prisma.tower.findFirst({ where: { id } })
}

export async function GetTowerByName(name: string) {
    return await prisma.tower.findFirst({ where: { name } })
}

export async function DefeatTowerByTrainer(tower_id: number, trainer_id: number) {
    const tower = await GetTowerById(tower_id);

    if (tower) {
        const trainer = await GetTrainerById(trainer_id)
    }
}