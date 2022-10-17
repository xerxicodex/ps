import { DifficultyEnumType, Move, MoveCategoryEnumType, Pokemon, PokemonGenderEnumType, Prisma, PrismaClient, RewardEnumType } from "@prisma/client";
import Chance from 'chance';

export const seedTowers = async (prisma: PrismaClient) => {
    const towerCount = await prisma.tower.count();

    if (towerCount == 0) {

        const towerPokemon: Prisma.TowerPokemonUncheckedCreateInput[] = [];

        // Legendary tower
        const legends = await prisma.pokemon.findMany({ where: { is_legendary: true }, orderBy: [{ generation: "desc" }, { power: "desc" }, { name: "desc" }] })

        let i = 0;

        while (legends.length > 0) {
            i++;

            const legend = legends.pop();

            const tower = await prisma.tower.create({
                data: {
                    name: [`Legend of`, legend?.name?.split('-').slice(1), legend?.species].filter(x => ((x ?? "").length > 0)).join(' '),
                    required_trainer_level: 100,
                }
            })

            const reward = await prisma.reward.create({
                data: {
                    reward: RewardEnumType.pokemon,
                    value: JSON.stringify({ name: legend?.name, pokemon_id: legend?.id, gender: PokemonGenderEnumType.unknown, level: 4 })
                }
            })

            await prisma.towerReward.create({
                data: {
                    tower_id: tower.id,
                    reward_id: reward.id,
                }
            })

            const themeQuery: Prisma.PokemonWhereInput = { OR: [{ type_1: legend?.type_1 }, { type_2: legend?.type_1 }, ...(legend?.type_2 ? [{ type_1: legend?.type_2 }, { type_2: legend?.type_2 }, { type_1: legend?.type_2, type_2: legend?.type_1 }, { type_1: legend?.type_1, type_2: legend?.type_2 }] : [])], AND: { is_legendary: false, is_mythical: false, NOT: { OR: [{ name: { contains: '-mega' } }, { name: { contains: '-gmax' } }, { name: { contains: "-eternamax" } }] } } };

            const floorPokemon: { [key: number]: Pokemon[] } = {}

            floorPokemon[1] = await prisma.pokemon.findMany({ where: { AND: [{ power: { lt: 250 } }, themeQuery] }, orderBy: [{ power: "desc" }, { name: "desc" }] })
            floorPokemon[2] = await prisma.pokemon.findMany({ where: { AND: [{ power: { gte: 250, lt: 350 } }, themeQuery] }, orderBy: [{ power: "desc" }, { name: "desc" }] })
            floorPokemon[3] = await prisma.pokemon.findMany({ where: { AND: [{ power: { gte: 350, lt: 400 } }, themeQuery] }, orderBy: [{ power: "desc" }, { name: "desc" }] })
            floorPokemon[4] = await prisma.pokemon.findMany({ where: { AND: [{ power: { gte: 400, lt: 450 } }, themeQuery] }, orderBy: [{ power: "desc" }, { name: "desc" }] })
            floorPokemon[5] = await prisma.pokemon.findMany({ where: { AND: [{ power: { gte: 450 } }, themeQuery] }, orderBy: [{ power: "desc" }, { name: "desc" }] })
            floorPokemon[6] = [legend as Pokemon];

            console.log(`[${legend?.name}][${legend?.type_1} | ${legend?.type_2 ?? 'NONE'}]`)

            let floors = Object.keys(floorPokemon);

            let totalPower = 0;

            let pokemonCount = 0;

            while (floors.length > 0) {
                const floor = parseInt(floors.shift() ?? "1");

                const themePokemon = floorPokemon[floor];

                while (themePokemon.length > 0) {
                    pokemonCount++;

                    const pokemon = themePokemon.pop()

                    totalPower += pokemon?.power ?? 0;

                    const abilities = await prisma.pokemonAbility.findMany({ where: { pokemon_id: pokemon?.id } })

                    const pokemonMoves = await prisma.pokemonMove.findMany({ where: { pokemon_id: pokemon?.id }, include: { move: true } })

                    const moves: { [key: string]: Move | null } = {
                        attack: null,
                        ohko: null,
                        heal: null,
                        ailment: null,
                        buff: null,
                    };

                    pokemonMoves.forEach(pm => {
                        const move = pm.move;

                        if ((move?.power ?? 0) > 1) {
                            if (!moves.attack) {
                                moves.attack = move;
                            }

                            if ((move.power ?? 0) > (moves.attack?.power ?? 0)) {
                                if (move.category == MoveCategoryEnumType.ohko) {
                                    moves.ohko = move;
                                } else {
                                    moves.attack = move;
                                }
                            }
                        }

                        if ((move?.healing ?? 0) > 0) {
                            if (!moves.heal) {
                                moves.heal = move;
                            }

                            if ((move.healing ?? 0) > (moves.healing?.healing ?? 0)) {
                                moves.heal = move;
                            }
                        }

                        if ([MoveCategoryEnumType.ailment.toString(), MoveCategoryEnumType.damage_and_ailment.toString()].indexOf(move?.category?.toString() ?? "") != -1) {
                            if (!moves.ailment) {
                                moves.ailment = move;
                            }

                            if (move.category == MoveCategoryEnumType.damage_and_ailment) {
                                if (moves.attack != move) {

                                    if ((move.power ?? 0) > (moves.ailment?.power ?? 0)) {
                                        moves.ailment = move;
                                    }
                                }
                            }

                            // mostly trap ailments are greater than 50
                            if (((moves.ailment.stat_chance ?? 0) == 100) && ((move.ailment_chance ?? 0) < 100 && (move.ailment_chance ?? 0) > (moves.ailment.stat_chance ?? 0))) {
                                moves.ailment = move;
                            }
                        }

                        const totalBuff = (m: Move) => [m.attack, m.defense, m.special_attack, m.special_defense, m.speed].reduce((a, b) => (a ?? 0) + (b ?? 0)) ?? 0

                        if (totalBuff((move ?? {}) as Move) > totalBuff((moves.buff ?? {}) as Move)) {
                            moves.buff = move;
                        }

                    })

                    towerPokemon.push({
                        tower_id: tower?.id ?? 0,
                        pokemon_id: pokemon?.id ?? 0,
                        floor,
                        level: 500 * floor,
                        gender: PokemonGenderEnumType.genderless,
                        ability_id: Chance().pickone(abilities).ability_id,
                        move_1: moves.buff?.name,
                        move_2: moves.attack?.name,
                        move_3: moves.heal?.name,
                        move_4: moves.ohko ? Chance().pickone([moves.ailment?.name, moves.ohko?.name]) : moves.attack?.name,
                    })
                    // console.log(`[${legend?.name}][${floor}F] -> ${pokemon?.name}  [${pokemon?.power}](${pokemon?.type_1}, ${pokemon?.type_2 ?? 'NONE'})`)
                }
            }

            const _serverPowerAvg = 372;

            const _powerAvg = Math.floor(totalPower / pokemonCount)

            const matchup = (((_powerAvg / _serverPowerAvg) * 100) * (6 / pokemonCount));

            if (matchup >= 5) {
                tower.difficulty = DifficultyEnumType.master
            } else if (matchup >= 4) {
                tower.difficulty = DifficultyEnumType.very_hard
            } else if (matchup >= 3) {
                tower.difficulty = DifficultyEnumType.hard
            } else if (matchup >= 2) {
                tower.difficulty = DifficultyEnumType.medium
            } else {
                tower.difficulty = DifficultyEnumType.easy;
            }

            await prisma.tower.update({ data: tower, where: { id: tower.id } })
        }

        await prisma.towerPokemon.createMany({ data: towerPokemon })
    }
}
