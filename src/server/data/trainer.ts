import { Prisma, PrismaClient, Trainer, TrainerPokemon } from "@prisma/client";
import { GetItemById } from "./item";

const prisma = new PrismaClient();

export async function GetTrainerById(id: number) {
    return await prisma.trainer.findFirst({ where: { id } })
}

export async function GetTrainerByName(name: string) {
    return await prisma.trainer.findFirst({ where: { name } })
}

export async function UpdateTrainer(trainer: Trainer) {
    return await prisma.trainer.update({ data: trainer, where: { id: trainer.id } })
}

export async function GiveTrainerExp(trainer_id: number, exp: number) {
    const trainer = await GetTrainerById(trainer_id);

    if (trainer) {
        trainer.exp = (trainer.exp ?? 0) + exp;
        trainer.level = Math.floor((trainer.exp ?? 0) ** (1/3))
        await UpdateTrainer(trainer);
    }
}

export async function GiveTrainerBattlePoints(trainer_id: number, points: number) {
    const trainer = await GetTrainerById(trainer_id);

    if (trainer) {
        trainer.battle_points = (trainer.battle_points ?? 0) + points;
        await UpdateTrainer(trainer);
    }
}

export async function GiveTrainerCoins(trainer_id: number, coins: number) {
    await prisma.trainer.update({ data: { coins: { increment: coins } }, where: { id: trainer_id } })
}

export async function GiveTrainerItem(trainer_id: number, item_id: number, amount?: number) {
    const item = await GetItemById(item_id);

    if (item) {
        const trainerItem = await GetTrainerItemByItemIdi(item_id);

        await prisma.trainerItem.upsert({
            where: { 
                id: trainerItem?.id
            },
            update: { amount: { increment: 1 } },
            create: {
                trainer_id: amount ?? 1,
                item_id: item.id
            },
        })
    }
}

export async function GiveTrainerPokemon(trainer_id: number, pokemon: Prisma.TrainerPokemonUncheckedCreateInput) {
    const roster = await GetTrainerRoster(trainer_id);

    if (roster.length < 6) {
        pokemon.slot = roster.length + 1;
    }

    return await prisma.trainerPokemon.create({ data: { ...pokemon, trainer_id }});
}

export async function GiveTrainerRewardPokemon(trainer_id: number, data: string) {
    const pokemon = JSON.parse(data);

    delete pokemon.name;

    await GiveTrainerPokemon(trainer_id, pokemon as Prisma.TrainerPokemonUncheckedCreateInput)
}


// Trainer Item
export async function GetTrainerItemByItemIdi(item_id: number) {
    return await prisma.trainerItem.findFirst({ where: { item_id } })
}


// Trainer Pokemon
export async function GetTrainerPokemon(id: number) {
    return await prisma.trainerPokemon.findFirst({ where: { id } })
}

export async function GetTrainerRoster(trainer_id: number) {
    return await prisma.trainerPokemon.findMany({ where: { trainer_id, slot: { gte: 1, lte: 6 } }});
}

export async function GetTrainerMainPokemon(trainer_id: number) {
    return await prisma.trainerPokemon.findFirst({ where: { trainer_id, slot: 1 }});
}

export async function UpdateTrainerPokemon(trainerPokemon: TrainerPokemon) {
    return await prisma.trainer.update({ data: trainerPokemon, where: { id: trainerPokemon.id } })
}

export async function GiveTrainerPokemonEXP(pokemon_id: number, exp: number) {
    const pokemon = await GetTrainerPokemon(pokemon_id);

    if (pokemon) {
        pokemon.exp = (pokemon.exp ?? 0) + exp;
        pokemon.level = Math.floor((pokemon.exp ?? 0) ** (1/3))
        await UpdateTrainerPokemon(pokemon)
    }
}

export async function GiveTrainerMainPokemonEXP(trainer_id: number, exp: number) {
    const pokemon = await GetTrainerMainPokemon(trainer_id)

    if (pokemon) {
        await GiveTrainerPokemonEXP(pokemon.id, exp);
    }
}

