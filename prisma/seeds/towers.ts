import {
    DifficultyEnumType,
    Move,
    MoveCategoryEnumType,
    Pokemon,
    PokemonGenderEnumType,
    PokemonMove,
    Prisma,
    PrismaClient,
    RewardEnumType,
} from "@prisma/client";
import Chance from "chance";
import { DefeatTowerByTrainer } from "../../src/server/services/tower.service";
import { ParsePokemonName } from "../../src/server/utils/pokemon";

export const seedTowers = async (prisma: PrismaClient) => {
    await prisma.towerBadge.deleteMany();
    await prisma.towerReward.deleteMany();
    await prisma.towerPokemon.deleteMany();
    await prisma.tower.deleteMany();

    const towerCount = await prisma.tower.count();

    if (towerCount == 0) {
        const towerPokemon: Prisma.TowerPokemonUncheckedCreateInput[] = [];

        // Legendary tower
        const legends = await prisma.pokemon.findMany({
            where: { is_legendary: true },
            orderBy: [
                { generation: "desc" },
                { power: "desc" },
                { name: "desc" },
            ],
        });

        let i = 0;

        while (legends.length > 0) {
            i++;

            const legend = legends.pop();

            const legendName = ParsePokemonName(
                legend?.name ?? "",
                legend?.species ?? ""
            );

            const towerName = `Legend of ${legendName}`;

            console.log(`[tower][][${towerName}] Creating`);

            const tower = await prisma.tower.create({
                data: {
                    name: towerName,
                    required_trainer_level: 1,
                },
            });

            tower.required_trainer_level = Math.floor((((((tower.id ** (1 + 0.5)) / 100) * 1000) * 1.25)) ** (1/2))

            const badge = await prisma.badge.create({
                data: {
                    name: `Tower Legend: ${legendName}`,
                    description: `Defeated the "${tower.name}" tower`,
                },
            });

            await prisma.towerBadge.create({
                data: {
                    tower_id: tower.id,
                    badge_id: badge.id,
                },
            });

            const themeQuery: Prisma.PokemonWhereInput = {
                OR: [
                    { type_1: legend?.type_1 },
                    { type_2: legend?.type_1 },
                    ...(legend?.type_2
                        ? [
                              { type_1: legend?.type_2 },
                              { type_2: legend?.type_2 },
                              {
                                  type_1: legend?.type_2,
                                  type_2: legend?.type_1,
                              },
                              {
                                  type_1: legend?.type_1,
                                  type_2: legend?.type_2,
                              },
                          ]
                        : []),
                ],
                AND: {
                    is_legendary: false,
                    is_mythical: false,
                    NOT: {
                        OR: [
                            { name: { contains: "-mega" } },
                            { name: { contains: "-gmax" } },
                            { name: { contains: "-eternamax" } },
                        ],
                    },
                },
            };

            const _floorPokemon: { [key: number]: Pokemon[] } = {};

            _floorPokemon[1] = await prisma.pokemon.findMany({
                where: { AND: [{ power: { lt: 250 } }, themeQuery] },
                orderBy: [{ power: "desc" }, { name: "desc" }],
            });
            _floorPokemon[2] = await prisma.pokemon.findMany({
                where: { AND: [{ power: { gte: 250, lt: 350 } }, themeQuery] },
                orderBy: [{ power: "desc" }, { name: "desc" }],
            });
            _floorPokemon[3] = await prisma.pokemon.findMany({
                where: { AND: [{ power: { gte: 350, lt: 400 } }, themeQuery] },
                orderBy: [{ power: "desc" }, { name: "desc" }],
            });
            _floorPokemon[4] = await prisma.pokemon.findMany({
                where: { AND: [{ power: { gte: 400, lt: 450 } }, themeQuery] },
                orderBy: [{ power: "desc" }, { name: "desc" }],
            });
            _floorPokemon[5] = await prisma.pokemon.findMany({
                where: { AND: [{ power: { gte: 450 } }, themeQuery] },
                orderBy: [{ power: "desc" }, { name: "desc" }],
            });
            _floorPokemon[6] = [];

            let index = 5;

            while (index > 0) {
                let floorBoss = _floorPokemon[index].at(0);

                const set = async (fb: Pokemon) => {
                    const evo = await prisma.pokemon.findFirst({
                        where: { evolves_from: fb.dex_id },
                    });

                    if (evo) {
                        await set(evo);
                    } else {
                        _floorPokemon[6].push(fb);
                    }
                };

                if (floorBoss) {
                    await set(floorBoss);
                }

                index--;
            }

            _floorPokemon[6].sort((a, b) =>
                (a.power ?? 0) - (b.power ?? 0) > 0 ? -1 : 1
            );

            _floorPokemon[6].unshift(legend as Pokemon);

            const floorPokemon: typeof _floorPokemon = {};

            Object.keys(_floorPokemon).forEach((key) => {
                const floor = key as unknown as number;
                if (_floorPokemon[floor].length > 0) {
                    floorPokemon[floor] = _floorPokemon[floor];
                }
            });

            let floors = Object.keys(floorPokemon);

            let max_level = 0;

            let poemon_count = 0;

            while (floors.length > 0) {
                const floor = parseInt(floors.shift() ?? "1");

                const themePokemon = floorPokemon[floor];

                while (themePokemon.length > 0) {
                    const pokemon = themePokemon.pop();

                    const abilities = await prisma.pokemonAbility.findMany({
                        where: { pokemon_id: pokemon?.id },
                        include: { ability: true },
                    });

                    const pokemonMoves = await prisma.pokemonMove.findMany({
                        where: { pokemon_id: pokemon?.id },
                        include: { move: true },
                    });

                    const moves: { [key: string]: Move | null } = {
                        attack: null,
                        ohko: null,
                        heal: null,
                        ailment: null,
                        buff: null,
                        stab: null,
                    };

                    pokemonMoves.forEach((pm) => {
                        const move = pm.move;

                        if ((move?.power ?? 0) > 1) {
                            if (
                                [
                                    pokemon?.type_1,
                                    pokemon?.type_2 ?? "none",
                                ].indexOf(move.type ?? "") == -1
                            ) {
                                if (!moves.attack) {
                                    moves.attack = move;
                                }

                                if (
                                    (move.power ?? 0) >
                                    (moves.attack?.power ?? 0)
                                ) {
                                    if (
                                        move.category ==
                                        MoveCategoryEnumType.ohko
                                    ) {
                                        moves.ohko = move;
                                    } else {
                                        moves.attack = move;
                                    }
                                }
                            } else {
                                if (!moves.stab) {
                                    moves.stab = move;
                                }

                                if (
                                    (move.power ?? 0) > (moves.stab?.power ?? 0)
                                ) {
                                    if (
                                        move.category ==
                                        MoveCategoryEnumType.ohko
                                    ) {
                                        moves.ohko = move;
                                    } else {
                                        moves.stab = move;
                                    }
                                }
                            }
                        }

                        if ((move?.healing ?? 0) > 0) {
                            if (!moves.heal) {
                                moves.heal = move;
                            }

                            if (
                                (move.healing ?? 0) >
                                (moves.healing?.healing ?? 0)
                            ) {
                                moves.heal = move;
                            }
                        }

                        if (
                            [
                                MoveCategoryEnumType.ailment.toString(),
                                MoveCategoryEnumType.damage_and_ailment.toString(),
                            ].indexOf(move?.category?.toString() ?? "") != -1
                        ) {
                            if (!moves.ailment) {
                                moves.ailment = move;
                            }

                            if (
                                move.category ==
                                MoveCategoryEnumType.damage_and_ailment
                            ) {
                                if (moves.attack != move) {
                                    if (
                                        (move.power ?? 0) >
                                        (moves.ailment?.power ?? 0)
                                    ) {
                                        moves.ailment = move;
                                    }
                                }
                            }

                            // mostly trap ailments are greater than 50
                            if (
                                (moves.ailment.stat_chance ?? 0) == 100 &&
                                (move.ailment_chance ?? 0) < 100 &&
                                (move.ailment_chance ?? 0) >
                                    (moves.ailment.stat_chance ?? 0)
                            ) {
                                moves.ailment = move;
                            }
                        }

                        const totalBuff = (m: Move) =>
                            [
                                m.attack,
                                m.defense,
                                m.special_attack,
                                m.special_defense,
                                m.speed,
                            ].reduce((a, b) => (a ?? 0) + (b ?? 0)) ?? 0;

                        if (
                            totalBuff((move ?? {}) as Move) >
                            totalBuff((moves.buff ?? {}) as Move)
                        ) {
                            moves.buff = move;
                        }
                    });

                    const _moves: string[] = [
                        moves.buff?.name,
                        moves.stab ? moves.stab?.name : moves.attack?.name,
                        moves.heal?.name,
                        moves.ohko
                            ? Chance().pickone([
                                  moves.ailment?.name,
                                  moves.ohko?.name,
                              ])
                            : moves.ailment?.name,
                    ].filter((x) => x) as string[];

                    const level = Math.floor(
                        ((5 * (((1000  + ((towerPokemon.length * 0.25) * 2.5)) * (floor * ((1 + (tower.id / 3))/100))) ** (1/3))) * 100) * 0.75
                    );

                    towerPokemon.push({
                        tower_id: tower?.id ?? 0,
                        pokemon_id: pokemon?.id ?? 0,
                        floor,
                        level,
                        gender: PokemonGenderEnumType.genderless,
                        ability: Chance().pickone(abilities).ability.name,
                        move_1: _moves.shift() ?? null,
                        move_2: _moves.shift() ?? null,
                        move_3: _moves.shift() ?? null,
                        move_4: _moves.shift() ?? null,
                    });

                    if (floor > (tower.floors ?? 0)) {
                        tower.floors = (tower.floors ?? 0) + 1;
                    }

                    if (level > max_level) {
                        max_level = level;
                    }

                    poemon_count++;
                    // console.log(`[${legend?.name}][${floor}F] -> ${pokemon?.name}  [${pokemon?.power}](${pokemon?.type_1}, ${pokemon?.type_2 ?? 'NONE'})`)
                }
            }

            if (max_level >= 8000) {
                tower.difficulty = DifficultyEnumType.master;
            } else if (max_level >= 5000) {
                tower.difficulty = DifficultyEnumType.very_hard;
            } else if (max_level >= 3000) {
                tower.difficulty = DifficultyEnumType.hard;
            } else if (max_level >= 1500) {
                tower.difficulty = DifficultyEnumType.medium;
            } else {
                tower.difficulty = DifficultyEnumType.easy;
            }

            let reward = await prisma.reward.create({
                data: {
                    reward: RewardEnumType.pokemon,
                    value: JSON.stringify({
                        name: legend?.name,
                        pokemon_id: legend?.id,
                        level: 4,
                    }),
                },
            });

            await prisma.towerReward.create({
                data: {
                    tower_id: tower.id,
                    reward_id: reward.id,
                },
            });

            reward = await prisma.reward.create({
                data: {
                    reward: RewardEnumType.pokemon_exp,
                    value: `${Math.floor(((500 * (max_level / 1000)) ** 3))}`,
                },
            });

            await prisma.towerReward.create({
                data: {
                    tower_id: tower.id,
                    reward_id: reward.id,
                },
            });

            reward = await prisma.reward.create({
                data: {
                    reward: RewardEnumType.trainer_exp,
                    value: `${Math.floor((max_level ** 1.25) * 0.01)}`,
                },
            });

            await prisma.towerReward.create({
                data: {
                    tower_id: tower.id,
                    reward_id: reward.id,
                },
            });

            reward = await prisma.reward.create({
                data: {
                    reward: RewardEnumType.coins,
                    value: `${Math.floor((max_level ** 1.25) * 0.1)}`,
                },
            });

            await prisma.towerReward.create({
                data: {
                    tower_id: tower.id,
                    reward_id: reward.id,
                },
            });

            await prisma.tower.update({ data: tower, where: { id: tower.id } });

            console.log(`[tower][${tower?.id}][${tower.name}] Created`);
        }

        await prisma.towerPokemon.createMany({ data: towerPokemon });
    }
};
