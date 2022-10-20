import { Prisma, RoleEnumType, TrainerSkinEnumType } from "@prisma/client";

export const trainers: Prisma.TrainerCreateInput[] = [
    {
        name: "red",
        password: "admin@app",
        role: RoleEnumType.admin,
        starter: 2,
        skin: TrainerSkinEnumType.red
    },
    {
        name: "green",
        password: "smod@app",
        role: RoleEnumType.super_moderator,
        starter: 1,
        skin: TrainerSkinEnumType.green
    },
    {
        name: "blue",
        password: "mod@app",
        role: RoleEnumType.moderator,
        starter: 3,
        skin: TrainerSkinEnumType.blue
    },
    {
        name: "yellow",
        password: "promote@app",
        role: RoleEnumType.promoter,
        starter: 4,
        skin: TrainerSkinEnumType.yellow
    },
    {
        name: "aicasso",
        password: "user@app",
        role: RoleEnumType.user,
        starter: 1,
        skin: TrainerSkinEnumType.benga
    },
];
