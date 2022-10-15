import { Prisma, RoleEnumType } from "@prisma/client";

export const trainers: Prisma.TrainerCreateInput[] = [
    { name: "red", password: "admin@app.uexf", role: RoleEnumType.admin, starter: 2 },
    { name: "green", password: "smod@app.uexf", role: RoleEnumType.super_moderator, starter: 1 },
    { name: "blue", password: "mod@app.uexf", role: RoleEnumType.moderator, starter: 3 },
    { name: "yellow", password: "promote@app.uexf", role: RoleEnumType.promoter, starter: 4 },
    { name: "aicasso", password: "axqwes22", role: RoleEnumType.user, starter: 1 }
]