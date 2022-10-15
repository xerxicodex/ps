import { Prisma, RoleEnumType } from "@prisma/client";

export const trainers: Prisma.TrainerCreateInput[] = [
  { name: "red", password: "admin@app", role: RoleEnumType.admin, starter: 2 },
  {
    name: "green",
    password: "smod@app",
    role: RoleEnumType.super_moderator,
    starter: 1,
  },
  {
    name: "blue",
    password: "mod@app",
    role: RoleEnumType.moderator,
    starter: 3,
  },
  {
    name: "yellow",
    password: "promote@app",
    role: RoleEnumType.promoter,
    starter: 4,
  },
  {
    name: "aicasso",
    password: "user@app",
    role: RoleEnumType.user,
    starter: 1,
  },
];
