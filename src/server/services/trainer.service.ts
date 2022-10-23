import customConfig from "../config/default";
import redisClient from "../utils/connectRedis";
import { signJwt } from "../utils/jwt";
import { prisma } from "../utils/prisma";
import {
    PokemonColorEnumType,
    PokemonGenderEnumType,
    Prisma,
    Trainer,
    TrainerPokemon,
} from "@prisma/client";
import { Chance } from "chance";
import { randomUUID } from "crypto";
import { ParsePokemonFullName } from "../utils/pokemon";
import { GetItemById } from "./item.service";
import { GetPokemonById } from "./pokemon.service";
import { DefeatTowerByTrainer, GetTowerById } from "./tower.service";


export const CreateTrainer = async (input: Prisma.TrainerCreateInput) => {
    return (await prisma.trainer.create({
        data: input,
    })) as Trainer;
};

export const FindTrainer = async (
    where: Partial<Prisma.TrainerWhereInput>,
    select?: Prisma.TrainerSelect
) => {
    return (await prisma.trainer.findFirst({
        where,
        select,
    })) as Trainer;
};

export const FindUniqueTrainer = async (
    where: Prisma.TrainerWhereUniqueInput,
    select?: Prisma.TrainerSelect
) => {
    return (await prisma.trainer.findUnique({
        where,
        select,
    })) as Trainer;
};

export const UpdateTrainer = async (
    where: Partial<Prisma.TrainerWhereUniqueInput>,
    data: Prisma.TrainerUpdateInput,
    select?: Prisma.TrainerSelect
) => {
    return (await prisma.trainer.update({ where, data, select })) as Trainer;
};

export const signTokens = async (trainer: Prisma.TrainerWhereUniqueInput) => {
    // 1. Create Session
    redisClient.set(`trainer-${trainer.id}`, JSON.stringify(trainer), {
        EX: customConfig.redisCacheExpiresIn * 60,
    });

    // 2. Create Access and Refresh tokens
    const access_token = signJwt({ sub: trainer.id }, "accessTokenPrivateKey", {
        expiresIn: `${customConfig.accessTokenExpiresIn}m`,
    });

    const refresh_token = signJwt(
        { sub: trainer.id },
        "refreshTokenPrivateKey",
        {
            expiresIn: `${customConfig.refreshTokenExpiresIn}m`,
        }
    );

    return { access_token, refresh_token };
};

export const CheckTrainerProgress = async (trainer_id: number) => {
    const trainer = await GetTrainerById(trainer_id);
    const mainPokemon = await GetTrainerMainPokemon(trainer_id);

    if (!mainPokemon) {
        console.log(`[trainer][${trainer?.id}] doesn't have a main pokemon`);

        const starter = trainer?.starter;

        console.log(
            `[trainer][${trainer?.id}] finding starter pokemon num ${starter}`
        );

        const pokemon = await prisma.pokemon.findFirst({
            where: {
                dex_id: parseInt(
                    (process.env.STARTER_DEX_IDS ?? "1, 4, 7")
                        ?.split(",")
                        .at((starter ?? 1) - 1)
                        ?.trim() ?? "0"
                ),
            },
        });

        if (pokemon) {
            console.log(
                `[trainer][${trainer?.id}] found starter pokemon num ${starter} "${pokemon.name}"`
            );

            GiveTrainerPokemon(trainer_id, {
                trainer_id,
                pokemon_id: pokemon.id,
                color:
                    PokemonColorEnumType[
                    Chance().pickone(
                        (
                            process.env.DEFAULT_STARTER_COLORS ?? `none`
                        ).split(",")
                    ) as keyof typeof PokemonColorEnumType
                    ] ?? null,
                gender:
                    PokemonGenderEnumType[
                    Chance().pickone(
                        (
                            process.env.DEFAULT_STARTER_GENDERS ?? `none`
                        ).split(",")
                    ) as keyof typeof PokemonGenderEnumType
                    ] ?? null,
                level: parseInt(
                    Chance().pickone(
                        (process.env.DEFAULT_STARTER_LEVELS ?? "5").split(",")
                    )
                ),
                move_1: Chance().pickone(
                    (
                        {
                            grass: "hydro cannon,frenzy plant,frenzy plant,razor leaf,razor leaf,razor leaf,razor leaf,razor leaf,razor leaf,razor leaf,razor leaf",
                            fire: "frenzy plant,blast burn,blast burn,ember,ember,ember,ember,ember,ember,ember,ember",
                            water: "blast burn,hydro cannon,hydro cannon,water gun,water gun,water gun, water gun",
                        }[pokemon.type_1 ?? ""] ?? ""
                    ).split(",")
                ),
            });
        }
    }
}

export const GetTrainerById = async (id: number) => {
    return await FindTrainer({ id });
}

export const GetTrainerByName = async (name: string) => {
    return await FindTrainer({ name });
}

export const GiveTrainerExp = async (trainer_id: number, exp: number) => {
    const trainer = await GetTrainerById(trainer_id);

    if (trainer) {
        trainer.exp =
            ((trainer.exp ?? 0) + exp) *
            parseInt(process.env.BONUS_TRAINER_EXP ?? "1");
        trainer.level = Math.floor((trainer.exp ?? 0) ** (1 / 3));
        await UpdateTrainer({ id: trainer.id }, trainer);
    }
}

export const GiveTrainerBattlePoints = async (
    trainer_id: number,
    points: number
) => {
    const trainer = await GetTrainerById(trainer_id);

    if (trainer) {
        trainer.battle_points = (trainer.battle_points ?? 0) + points;
        await UpdateTrainer({ id: trainer.id }, trainer);
    }
}

export const GiveTrainerCoins = async (trainer_id: number, coins: number) => {
    await prisma.trainer.update({
        data: { coins: { increment: coins } },
        where: { id: trainer_id },
    });
}

export const GiveTrainerItem = async (
    trainer_id: number,
    item_id: number,
    amount?: number
) => {
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

export const GiveTrainerPokemon = async (
    trainer_id: number,
    pokemon: Prisma.TrainerPokemonUncheckedCreateInput
) => {
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

    if (!pokemon.color) {
        let checks = 1;

        let default_colors = process.env.DEFAULT_POKEMON_COLORS;

        if (_pokemon?.is_legendary) {
            default_colors = process.env.DEFAULT_LEGENDARY_POKEMON_COLORS;
        } else if (_pokemon?.is_mythical) {
            default_colors = process.env.DEFAULT_MYTHICAL_POKEMON_COLORS;
        }

        if (default_colors && default_colors.length > 0) {
            const _color =
                PokemonColorEnumType[
                Chance().pickone(
                    (default_colors ?? `none`).split(",")
                ) as keyof typeof PokemonColorEnumType
                ] ?? null;

            if (_color == PokemonColorEnumType.shiny) {
                checks = 500;
            }
        }

        if (!_pokemon?.shiny_locked && !pokemon.color) {
            const shinyCharm = await prisma.trainerItem.findFirst({
                where: { item: { name: "shiny-charm" } },
            });

            checks *= shinyCharm ? 3 : 1;

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
    }

    if (!pokemon.gender) {
        let default_genders = process.env.DEFAULT_POKEMON_GENDERS;

        if (_pokemon?.is_legendary) {
            default_genders = process.env.DEFAULT_LEGENDARY_POKEMON_GENDERS;
        } else if (_pokemon?.is_mythical) {
            default_genders = process.env.DEFAULT_MYTHICAL_POKEMON_GENDERS;
        }

        pokemon.gender =
            PokemonGenderEnumType[
            Chance().pickone(
                (default_genders ?? `none`).split(",")
            ) as keyof typeof PokemonGenderEnumType
            ] ?? null;
    }

    if (!pokemon.level) {
        let default_levels = process.env.DEFAULT_POKEMON_LEVELS;

        if (_pokemon?.is_legendary) {
            default_levels = process.env.DEFAULT_LEGENDARY_POKEMON_LEVELS;
        } else if (_pokemon?.is_mythical) {
            default_levels = process.env.DEFAULT_MYTHICAL_POKEMON_LEVELS;
        }

        pokemon.level = default_levels
            ? parseInt(Chance().pickone(default_levels?.split(",")))
            : null;
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

    pokemon.move_1 = pokemon.move_1
        ? pokemon.move_1
        : moves.shift()?.move?.name ?? null;
    pokemon.move_2 = pokemon.move_2
        ? pokemon.move_2
        : moves.shift()?.move?.name ?? null;
    pokemon.move_3 = pokemon.move_3
        ? pokemon.move_3
        : moves.shift()?.move?.name ?? null;
    pokemon.move_4 = pokemon.move_4
        ? pokemon.move_4
        : moves.shift()?.move?.name ?? null;

    const trainerPokemon = await prisma.trainerPokemon.create({
        data: { ...pokemon, trainer_id },
        include: {
            pokemon: true,
        },
    });

    if (trainerPokemon?.id) {
        console.log(
            `[trainer][${trainer?.id}][${trainer?.name
            }] captured ${await ParsePokemonFullName(trainerPokemon)}`
        );
    }

    return trainerPokemon;
}

export const GiveTrainerRewardPokemon = async (
    trainer_id: number,
    data: string
) => {
    const pokemon = JSON.parse(data);

    delete pokemon.name;

    await GiveTrainerPokemon(
        trainer_id,
        pokemon as Prisma.TrainerPokemonUncheckedCreateInput
    );
}

// Trainer Item
export const GetTrainerItemByItemIdi = async (item_id: number) => {
    return await prisma.trainerItem.findFirst({ where: { item_id } });
}

// Trainer Pokemon
export const GetTrainerPokemon = async (id: number) => {
    return await prisma.trainerPokemon.findFirst({ where: { id } });
}

export const GetTrainerRoster = async (trainer_id: number) => {
    return await prisma.trainerPokemon.findMany({
        where: { trainer_id, slot: { gte: 1, lte: 6 } },
    });
}

export const GetTrainerMainPokemon = async (trainer_id: number) => {
    return await prisma.trainerPokemon.findFirst({
        where: { trainer_id, slot: 1 },
    });
}

export const UpdateTrainerPokemon = async (trainerPokemon: TrainerPokemon) => {

    if (isNaN(trainerPokemon.level ?? NaN)) {
        trainerPokemon.level = 0;
        trainerPokemon.exp = 0;
    }

    return await prisma.trainerPokemon.update({
        data: trainerPokemon,
        where: { id: trainerPokemon.id },
    });
}

export const GiveTrainerPokemonEXP = async (pokemon_id: number, exp: number) => {
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

export const GiveTrainerMainPokemonEXP = async (
    trainer_id: number,
    exp: number
) => {
    const pokemon = await GetTrainerMainPokemon(trainer_id);

    if (pokemon) {
        await GiveTrainerPokemonEXP(pokemon.id, exp);
    }
}

export const GetTrainerActiveTowerChallenge = async (id: number) => {
    return await prisma.towerChallenge.findFirst({ where: { trainer_id: id, endDate: { equals: null } } })
}

export const GetTrainerTowerChallenges = async (id: number) => {
    return await prisma.towerChallenge.findMany({ where: { trainer_id: id } })
}

export const GetTrainerTowerChallenge = async (id: number, tower_id: number) => {
    return await prisma.towerChallenge.findFirst({ where: { trainer_id: id, tower_id } })
}

export const TrainerChallengeTower = async (id: number, tower_id: number) => {
    const roster = await GetTrainerRoster(id);
    const tower = await GetTowerById(tower_id);
    return await prisma.towerChallenge.create({ data: { trainer_id: id, tower_id, totalFloors: tower.floors, roster: JSON.stringify(roster) } })
}

export const TrainerEndTowerChallenge = async (id: number, tower_id: number) => {
    const challenge = await GetTrainerTowerChallenge(id, tower_id);
    
    if (challenge) {
        return await prisma.towerChallenge.update({ where: { id: challenge.id }, data: { endDate: new Date() } })
    }
}

export const TrainerProgressTowerChallenge = async (id: number, tower_id: number) => {
    let challenge = await GetTrainerTowerChallenge(id, tower_id);
    if (challenge) {

        if ((challenge.currentFloor ?? 0) >= (challenge.totalFloors ?? 0)) {
            challenge = await TrainerEndTowerChallenge(id, tower_id) ?? null;
            await DefeatTowerByTrainer(tower_id, id);
            return challenge;
        }

        return await prisma.towerChallenge.update({ where: { id: challenge.id }, data: { currentFloor: { increment: 1} } })
    }
}