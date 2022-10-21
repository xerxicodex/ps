import { Prisma } from "@prisma/client";

export type ITrainer = {
    id: number;
    name: string;
    role: string;
    level: number;
    exp: number;
    coins: number;
    starter: number;
    skin: number;
    updatedAt: string;
    createdAt: string;
};


export type TowerFindProps = { where?: Prisma.TowerWhereInput, include?: Prisma.TowerInclude };