import {
    PokemonColorEnumType,
    Prisma,
    PrismaClient,
    Trainer,
    TrainerPokemon,
} from "@prisma/client";
import { Chance } from "chance";
import { randomUUID } from "crypto";
import { ParsePokemonFullName } from "../utils/pokemon";
import { GetItemById } from "./item";
import { GetPokemonById } from "./pokemon";

const prisma = new PrismaClient();

export async function GetTrainerById(id: number) {
    return await prisma.trainer.findFirst({ where: { id } });
}

export async function GetTrainerByName(name: string) {
    return await prisma.trainer.findFirst({ where: { name } });
}

export async function UpdateTrainer(trainer: Trainer) {
    return await prisma.trainer.update({
        data: trainer,
        where: { id: trainer.id },
    });
}

export async function GiveTrainerExp(trainer_id: number, exp: number) {
    const trainer = await GetTrainerById(trainer_id);

    if (trainer) {
        trainer.exp =
            ((trainer.exp ?? 0) + exp) *
            parseInt(process.env.BONUS_TRAINER_EXP ?? "1");
        trainer.level = Math.floor((trainer.exp ?? 0) ** (1 / 3));
        await UpdateTrainer(trainer);
    }
}

export async function GiveTrainerBattlePoints(
    trainer_id: number,
    points: number
) {
    const trainer = await GetTrainerById(trainer_id);

    if (trainer) {
        trainer.battle_points = (trainer.battle_points ?? 0) + points;
        await UpdateTrainer(trainer);
    }
}

export async function GiveTrainerCoins(trainer_id: number, coins: number) {
    await prisma.trainer.update({
        data: { coins: { increment: coins } },
        where: { id: trainer_id },
    });
}

export async function GiveTrainerItem(
    trainer_id: number,
    item_id: number,
    amount?: number
) {
    const item = await GetItemById(item_id);

    if (item) {
        const trainerItem = await GetTrainerItemByItemIdi(item_id);

        await prisma.trainerItem.upsert({
            where: {
                id: trainerItem?.id,
            },
            update: { amount: { increment: 1 } },
            create: {
                trainer_id: amount ?? 1,
                item_id: item.id,
            },
        });
    }
}

export async function GiveTrainerPokemon(
    trainer_id: number,
    pokemon: Prisma.TrainerPokemonUncheckedCreateInput
) {
    const trainer = await GetTrainerById(trainer_id);

    const roster = await GetTrainerRoster(trainer_id);

    if (roster.length < 6) {
        pokemon.slot = roster.length + 1;
    }

    const _pokemon = await prisma.pokemon.findFirst({
        where: { id: pokemon.pokemon_id },
    });

    const abilities = await prisma.pokemonAbility.findMany({
        where: { pokemon_id: _pokemon?.id, is_hidden: false },
        include: { ability: true },
    });

    pokemon.ability = Chance().pickone(abilities).ability.name;

    if (Chance().integer({ min: 1, max: 4 }) == 1) {
        const hiddenAbilities = await prisma.pokemonAbility.findMany({
            where: { pokemon_id: _pokemon?.id, is_hidden: true },
            include: { ability: true },
        });

        if (hiddenAbilities.length > 0) {
            pokemon.ability = Chance().pickone(hiddenAbilities).ability.name;
        }
    }

    if (!_pokemon?.shiny_locked) {
        const shinyCharm = await prisma.trainerItem.findFirst({
            where: { item: { name: "shiny-charm" } },
        });

        let checks = shinyCharm ? 3 : 1;

        checks *= parseInt(process.env.BONUS_SHINY_CHECKS ?? "1");

        let is_shiny = false;

        while (checks > 0) {
            checks--;
            is_shiny =
                Chance("aauCANWinx" + randomUUID()).integer({
                    min: 1,
                    max: parseInt(process.env.SHINY_CHANCE ?? "8192"),
                }) == 1;

            if (is_shiny) {
                checks = 0;
            }
        }

        if (is_shiny) {
            pokemon.color = PokemonColorEnumType.shiny;
        }
    }

    const pokemonMoves = await prisma.pokemonMove.findMany({
        where: { pokemon_id: _pokemon?.id },
        include: { move: true },
    });

    const moves =
        pokemonMoves.length > 0
            ? Chance().pickset(
                  pokemonMoves,
                  Chance().integer({ min: 0, max: 4 })
              )
            : [];

    pokemon.move_1 = moves.shift()?.move?.name ?? null;
    pokemon.move_2 = moves.shift()?.move?.name ?? null;
    pokemon.move_3 = moves.shift()?.move?.name ?? null;
    pokemon.move_4 = moves.shift()?.move?.name ?? null;

    const trainerPokemon = await prisma.trainerPokemon.create({
        data: { ...pokemon, trainer_id },
        include: {
            pokemon: true,
        },
    });

    if (trainerPokemon?.id) {
        console.log(
            `[trainer][${trainer?.id}][${
                trainer?.name
            }] captured ${await ParsePokemonFullName(trainerPokemon)}`
        );
    }

    return trainerPokemon;
}

export async function GiveTrainerRewardPokemon(
    trainer_id: number,
    data: string
) {
    const pokemon = JSON.parse(data);

    delete pokemon.name;

    await GiveTrainerPokemon(
        trainer_id,
        pokemon as Prisma.TrainerPokemonUncheckedCreateInput
    );
}

// Trainer Item
export async function GetTrainerItemByItemIdi(item_id: number) {
    return await prisma.trainerItem.findFirst({ where: { item_id } });
}

// Trainer Pokemon
export async function GetTrainerPokemon(id: number) {
    return await prisma.trainerPokemon.findFirst({ where: { id } });
}

export async function GetTrainerRoster(trainer_id: number) {
    return await prisma.trainerPokemon.findMany({
        where: { trainer_id, slot: { gte: 1, lte: 6 } },
    });
}

export async function GetTrainerMainPokemon(trainer_id: number) {
    return await prisma.trainerPokemon.findFirst({
        where: { trainer_id, slot: 1 },
    });
}

export async function UpdateTrainerPokemon(trainerPokemon: TrainerPokemon) {
    return await prisma.trainer.update({
        data: trainerPokemon,
        where: { id: trainerPokemon.id },
    });
}

export async function GiveTrainerPokemonEXP(pokemon_id: number, exp: number) {
    const pokemon = await GetTrainerPokemon(pokemon_id);
    const _pokemon = await GetPokemonById(pokemon?.pokemon_id ?? 0);

    if (pokemon) {
        pokemon.exp =
            ((pokemon.exp ?? 0) + exp) *
            parseInt(process.env.BONUS_POKEMON_EXP ?? "1");

        const mod: any = {
            fast: (x: number) => x ** (1 / 2.75),
            slow: (x: number) => x ** (1 / 3.25),
            medium: (x: number) => x ** (1 / 3),
            "medium-slow": (x: number) => x ** (1 / 3.15),
            "fast-then-very-slow": (x: number) => (x * 1.5 ** 10) ** (1 / 4),
            "slow-then-very-fast": (x: number) =>
                (x * (1 / 6.2 ** 9)) ** (1 + 1 / 4) * 0.35,
        };

        pokemon.level = Math.floor(
            mod[_pokemon?.growth_rate ?? ""](pokemon.exp ?? 0)
        );

        await UpdateTrainerPokemon(pokemon);
    }
}

export async function GiveTrainerMainPokemonEXP(
    trainer_id: number,
    exp: number
) {
    const pokemon = await GetTrainerMainPokemon(trainer_id);

    if (pokemon) {
        await GiveTrainerPokemonEXP(pokemon.id, exp);
    }
}
