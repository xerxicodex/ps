import { Badge, Prisma, Trainer } from "@prisma/client";
import { GetTrainerById } from "./trainer.service";

export const CreateBadge = async (input: Prisma.BadgeCreateInput) => {
    return (await prisma.badge.create({
        data: input,
    })) as Badge;
};

export const FindBadge = async (
    where: Partial<Prisma.BadgeWhereInput>,
    select?: Prisma.BadgeSelect
) => {
    return (await prisma.badge.findFirst({
        where,
        select,
    })) as Badge;
};

export const FindUniqueBadge = async (
    where: Prisma.BadgeWhereUniqueInput,
    select?: Prisma.BadgeSelect
) => {
    return (await prisma.badge.findUnique({
        where,
        select,
    })) as Badge;
};

export const UpdateBadge = async (
    where: Partial<Prisma.BadgeWhereUniqueInput>,
    data: Prisma.BadgeUpdateInput,
    select?: Prisma.BadgeSelect
) => {
    return (await prisma.badge.update({ where, data, select })) as Badge;
};

export async function GetBadgeById(id: number) {
    return await FindBadge({ id });
}

export async function GetBadgeByName(name: string) {
    return await FindBadge({ name });
}

export async function GiveBadgeToTrainer(badge_id: number, trainer_id: number) {
    const badge = await GetBadgeById(badge_id);

    if (badge) {
        const trainer = await GetTrainerById(trainer_id);

        if (trainer) {
            await prisma.trainerBadge.upsert({
                where: {
                    trainer_id_badge_id: {
                        trainer_id: trainer.id,
                        badge_id: badge.id,
                    },
                },
                update: {
                    amount: { increment: 1 },
                },
                create: {
                    trainer_id: trainer.id,
                    badge_id: badge.id,
                },
            });
        }
    }
}
