import { PrismaClient } from "@prisma/client";
import { GetTrainerById } from "./trainer";

const prisma = new PrismaClient();

export async function GetBadgeById(id: number) {
    return await prisma.badge.findFirst({ where: { id } });
}

export async function GetBadgeByName(name: string) {
    return await prisma.badge.findFirst({ where: { name } });
}

export async function GiveBadgeToTrainer(badge_id: number, trainer_id: number) {
    const badge = await GetBadgeById(badge_id);

    if (badge) {
        const trainer = await GetTrainerById(trainer_id);
        
        if (trainer) {
            await prisma.trainerBadge.upsert({
                where: { trainer_id_badge_id: { trainer_id: trainer.id, badge_id: badge.id } },
                update: {
                    amount: { increment: 1 }
                },
                create: {
                    trainer_id: trainer.id,
                    badge_id: badge.id
                }
            })
        }
    }
}
