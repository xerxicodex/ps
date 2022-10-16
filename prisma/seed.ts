import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { trainers } from "./seeds/trainer";
import { routes } from "./seeds/routes";
import { seedPokemon } from "./seeds/pokemon";

const prisma = new PrismaClient();

const seedTrainers = async () => {
  const trainerCount = await prisma.trainer.count();

  if (trainerCount == 0) {
    const _trainers = [];

    while (trainers.length > 0) {
      const trainer: Prisma.TrainerCreateInput =
        trainers.pop() as unknown as Prisma.TrainerCreateInput;

      _trainers.push({
        ...trainer,
        ...{ password: await bcrypt.hash(trainer.password, 12) },
      });
    }

    await prisma.trainer.createMany({
      data: _trainers.reverse(),
    });
  }
};

const seedRoutes = async () => {
  const routeCount = await prisma.route.count();

  if (routeCount == 0) {
    await prisma.route.createMany({
      data: routes,
    });
  }
};

async function main() {
  await seedTrainers();
  await seedRoutes();
  await seedPokemon(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
