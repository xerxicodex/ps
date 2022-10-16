import { Prisma, PrismaClient } from "@prisma/client";
import { MainClient, PokemonClient } from 'pokenode-ts';
import process from "process";
import RunParallelLimit from "run-parallel-limit";

const pokedex = new PokemonClient({ baseURL: process.env.POKEAPI_URL });

const maindex = new MainClient({ baseURL: process.env.POKEAPI_URL })

const _pokemon: Prisma.PokemonCreateInput[] = [];

const abilities: { [key: number]: any } = {};

const _abilities: Prisma.AbilityUncheckedCreateInput[] = [];

const _pokemon_abilities: Prisma.PokemonAbilityUncheckedCreateInput[] = [];

const moves: { [key: number]: any } = {};

const _moves: Prisma.MoveUncheckedCreateInput[] = [];

const _pokemon_moves: Prisma.PokemonMoveUncheckedCreateInput[] = [];

const ids: number[] = (new Array(15200).fill(null).map((x, i) => i + 1))

const jobs = ids.map((id) => {
    return async (callback: any) => {
        try {
            const species = await pokedex.getPokemonSpeciesById(id);

            while ((species?.varieties ?? [])?.length > 0) {

                const variety = species.varieties.shift();

                const pokemon = await pokedex.getPokemonByName(variety?.pokemon?.name ?? "");

                if (pokemon) {

                    const name = pokemon.name;

                    let description = "";

                    species.flavor_text_entries.forEach(f => {
                        if (f?.language?.name == "en") {
                            description = f.flavor_text;
                        }
                    })

                    const stats: any = {};

                    pokemon.stats.forEach(stat => {
                        const key = (stat.stat?.name ?? "").toLowerCase().replace('-', '_');
                        stats[key] = stat.base_stat ?? 0;
                        stats[key + "_ev"] = stat.effort ?? 0;
                    })

                    pokemon.abilities.forEach(ability => {
                        const key = (parseInt(ability.ability?.url?.split("/")?.slice(-2)?.shift() ?? "0"));
                        if (Object.keys(abilities).indexOf(`${key}`) == -1) {
                            abilities[key] = [];
                        }
                        abilities[key].push({
                            pokemon_name: name,
                            slot: ability.slot,
                            is_hidden: ability.is_hidden
                        })
                    })

                    pokemon.moves.forEach(move => {
                        const key = (parseInt(move.move?.url?.split("/")?.slice(-2)?.shift() ?? "0"));
                        if (Object.keys(moves).indexOf(`${key}`) == -1) {
                            moves[key] = [];
                        }

                        const detail = move.version_group_details.shift();

                        const pokemon_move = {
                            pokemon_name: name,
                            level: detail?.level_learned_at,
                            method: detail?.move_learn_method?.name,
                        };

                        moves[key].push(pokemon_move)
                    })

                    let evolves_from: number | null = parseInt(species.evolves_from_species?.url?.split("/")?.slice(-2)?.shift() ?? "0");

                    if (evolves_from == 0) evolves_from = null;

                    const data = {
                        dex_id: id,
                        name,
                        species: species.name,
                        description,

                        type_1: pokemon.types.shift()?.type?.name,
                        type_2: pokemon.types.shift()?.type?.name,

                        hp: stats.hp,
                        attack: stats.attack,
                        defense: stats.defense,
                        special_attack: stats.special_attack,
                        special_defense: stats.special_defense,
                        speed: stats.speed,

                        hp_ev: stats.hp_ev,
                        attack_ev: stats.attack_ev,
                        defense_ev: stats.defense_ev,
                        special_attack_ev: stats.special_attack_ev,
                        special_defense_ev: stats.special_defense_ev,
                        speed_ev: stats.speed_ev,

                        base_exp: pokemon.base_experience,
                        height: pokemon.height,
                        weight: pokemon.weight,
                        capture_rate: species.capture_rate,
                        base_happiness: species.base_happiness,
                        is_baby: species.is_baby,
                        is_legendary: species.is_legendary,
                        is_mythical: species.is_mythical,
                        hatch_counter: species.hatch_counter,
                        has_gender_differences: species.has_gender_differences,
                        forms_switchable: species.forms_switchable,

                        evolves_from,

                        growth_rate: species.growth_rate?.name,
                        theme_color: species.color?.name,
                        shape: species.shape?.name,
                        power: 0,
                    }

                    // data.base_exp = data.base_exp + Math.floor(data.base_exp * (data.capture_rate / 255));

                    // if (data.type_1 && data.type_2) {
                    //     data.base_exp = Math.floor(data.base_exp ** 5)
                    // }

                    if (data.name.indexOf("-incarnate") != -1) {
                        data.base_exp = Math.floor(data.base_exp * 1.02);
                    }

                    if (data.name.indexOf("-origin") != -1) {
                        data.base_exp = Math.floor(data.base_exp * 1.02);
                    }

                    if (data.name.indexOf("-unbound") != -1) {
                        data.base_exp = Math.floor(data.base_exp * 1.02);
                    }

                    if (data.name.indexOf("-primal") != -1) {
                        data.base_exp = Math.floor(data.base_exp * 1.02);
                    }

                    if (data.name.indexOf("-gmax") != -1) {
                        data.base_exp = Math.floor(data.base_exp * 1.03);
                    }

                    if (data.name.indexOf("-eternamax") != -1) {
                        data.base_exp = Math.floor(data.base_exp * 1.03);
                    }

                    if (data.name.indexOf("-mega") != -1) {
                        data.base_exp = Math.floor(data.base_exp * 1.04);
                    }

                    if (data.evolves_from) {
                        data.base_exp = Math.floor(data.base_exp ** 1.005)
                    }

                    if (data.is_legendary) {
                        data.base_exp = Math.floor(data.base_exp ** 1.010);
                    }

                    if (data.is_mythical) {
                        data.base_exp = Math.floor(data.base_exp ** 1.015);
                    }

                    if (data.name.indexOf("-mega") != -1 && (data.is_legendary || data.is_mythical)) {
                        data.base_exp = Math.floor(data.base_exp * 1.03);
                    }

                    if (data.name.indexOf("-gmax") != -1 && (data.is_legendary || data.is_mythical)) {
                        data.base_exp = Math.floor(data.base_exp * 1.010);
                    }

                    if (data.is_legendary || data.is_mythical) {
                        data.base_exp = Math.floor(data.base_exp * 2);
                    }

                    if (data.name.indexOf("kyogre") != -1) {
                        data.base_exp = Math.floor(data.base_exp *  1.05);
                    }

                    if (data.name.indexOf("groudon") != -1) {
                        data.base_exp = Math.floor(data.base_exp *  1.075);
                    }

                    if (data.name.indexOf("deoxys") != -1) {
                        data.base_exp = Math.floor(data.base_exp *  1.1);
                    }

                    if (data.name.indexOf("rayquaza") != -1) {
                        data.base_exp = Math.floor(data.base_exp *  1.15);
                    }

                    if (data.name.indexOf("mewtwo") != -1) {
                        data.base_exp = Math.floor(data.base_exp *  1.25);
                    }

                    if (data.name == "mew") {
                        data.base_exp = Math.floor(data.base_exp *  1.5);
                    }

                    if (data.name.indexOf("arceus") != -1) {
                        data.base_exp = Math.floor(data.base_exp *  2);
                    }

                    if (data.is_baby) {
                        data.base_exp *= -1;
                    }

                    data.power = (data.attack + data.special_attack + data.defense + data.special_defense + data.speed)

                    data.base_exp += data.power;

                    _pokemon.push(data)

                    console.log(`Pokemon #${id} loaded (${_pokemon.length})`)
                }
            }

            callback(null, `Loaded ${id}`)
        } catch (error) {
            console.log(`Skipped pokemon #${id}`)
            callback(null, `Skipped ${id}`)
        }
    }
});

export const seedPokemon = async (prisma: PrismaClient) => {
    const pokemonCount = await prisma.pokemon.count();

    if (pokemonCount == 0) {
        await (new Promise(done => RunParallelLimit(jobs, parseInt(`${process.env.POKEAPI_PARALLEL_LIMIT}`), done)));

        await prisma.pokemon.createMany({
            data: _pokemon.sort((a, b) => a.dex_id - b.dex_id),
        });

        const abilityCount = await prisma.ability.count();

        if (abilityCount == 0) {
            const abilityKeys = Object.keys(abilities);

            await (new Promise(done => RunParallelLimit(abilityKeys.map(key => {
                return async (callback: any) => {
                    const id = parseInt(key ?? "0");

                    const ability = await pokedex.getAbilityById(id);

                    if (ability) {
                        _abilities.push({
                            id: ability.id,
                            name: ability.name,
                            effect: ability.effect_entries.filter(e => e.language.name === "en").shift()?.effect,
                        })

                        const pokemon_abilities = abilities[parseInt(key)];

                        while (pokemon_abilities.length > 0) {
                            const pokemon_ability = pokemon_abilities.shift();

                            const pokemon = await prisma.pokemon.findFirst({ where: { name: pokemon_ability.pokemon_name } })

                            if (pokemon) {
                                _pokemon_abilities.push({
                                    pokemon_id: pokemon.id,
                                    ability_id: ability.id,
                                    slot: pokemon_ability.slot,
                                    is_hidden: pokemon_ability.is_hidden
                                })
                            }
                        }

                        console.log(`Add ability ${ability.name}`);
                    }
                    callback(null, `Loaded ability #${id}`)
                }
            }), parseInt(`${process.env.POKEAPI_PARALLEL_LIMIT}`), done)));

            await prisma.ability.createMany({
                data: _abilities,
            });

            await prisma.pokemonAbility.createMany({
                data: _pokemon_abilities,
            });
        }

        const moveCount = await prisma.move.count();

        if (moveCount == 0) {
            const moveKeys = Object.keys(moves);

            await (new Promise(done => RunParallelLimit(moveKeys.map(key => {
                return async (callback: any) => {
                    const id = parseInt(key ?? "0");

                    const move = await maindex.move.getMoveById(id);

                    if (move) {
                        _moves.push({
                            id: move.id,
                            name: move.name,
                            type: move.type.name,
                            class: move.damage_class?.name,
                            category: move.meta?.category?.name,
                            ailment: move.meta?.ailment?.name,
                            effect: move.effect_entries.filter(e => e.language.name === "en").shift()?.effect,
                            power: move.power,
                            pp: move.pp,
                            accuracy: move.accuracy,
                            priority: move.priority,
                            target: move.target.name,
                            contest_type: move.contest_types?.name,
                            min_hits: move.meta?.min_hits,
                            max_hits: move.meta?.max_hits,
                            min_turns: move.meta?.min_turns,
                            max_turns: move.meta?.max_turns,
                            drain: move.meta?.drain,
                            healing: move.meta?.healing,
                            crit_rate: move.meta?.crit_rate,
                            ailment_chance: move.meta?.ailment_chance,
                            flinch_chance: move.meta?.flinch_chance,
                            stat_chance: move.meta?.stat_chance,
                            hp: move.stat_changes?.filter(x => x.stat.name == "hp")?.shift()?.change,
                            attack: move.stat_changes?.filter(x => x.stat.name == "attack")?.shift()?.change,
                            defense: move.stat_changes?.filter(x => x.stat.name == "defense")?.shift()?.change,
                            special_attack: move.stat_changes?.filter(x => x.stat.name == "special_attack")?.shift()?.change,
                            special_defense: move.stat_changes?.filter(x => x.stat.name == "special_defense")?.shift()?.change,
                            speed: move.stat_changes?.filter(x => x.stat.name == "speed")?.shift()?.change,
                        })

                        const pokemon_moves = moves[parseInt(key)];

                        while (pokemon_moves.length > 0) {
                            const pokemon_move = pokemon_moves.shift();

                            const pokemon = await prisma.pokemon.findFirst({ where: { name: pokemon_move.pokemon_name } })

                            if (pokemon) {
                                _pokemon_moves.push({
                                    pokemon_id: pokemon.id,
                                    move_id: move.id,
                                    level: pokemon_move.level,
                                    method: pokemon_move.method
                                })
                            }
                        }

                        console.log(`Add move ${move.name}`);
                    }

                    callback(null, `Loaded move #${id}`)
                }
            }), parseInt(`${process.env.POKEAPI_PARALLEL_LIMIT}`), done)));

            await prisma.move.createMany({
                data: _moves,
            });

            await prisma.pokemonMove.createMany({
                data: _pokemon_moves,
            });
        }
    }
}
