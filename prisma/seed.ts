import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import { trainers } from "./seeds/trainer";

const prisma = new PrismaClient();

const seedTrainers = async () => {

    const trainerCount = await prisma.trainer.count();

    if (trainerCount == 0) {        
        const _trainers = [];
    
        while (trainers.length > 0) {
            const trainer: Prisma.TrainerCreateInput = trainers.pop() as unknown as Prisma.TrainerCreateInput;
    
            _trainers.push({ ...trainer, ...{ password: await bcrypt.hash(trainer.password, 12) } })
        }
    
        await prisma.trainer.createMany({
            data: _trainers.reverse(),
        });
    }
}

async function main() {
    await seedTrainers();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });