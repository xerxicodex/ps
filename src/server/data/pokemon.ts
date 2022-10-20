import { GetTrainerById, GetTrainerMainPokemon } from "./trainer";

export async function GetPokemonById(id: number) {
    return await prisma.pokemon.findFirst({ where: { id } });
}

export async function GetPokemonByName(name: string) {
    return await prisma.pokemon.findFirst({ where: { name } });
}

// export async function DefeatPokemonByTrainer(
//     pokemon_id: number,
//     trainer_id: number
// ) {
//     const pokemon = await GetPokemonById(pokemon_id);

//     if (pokemon) {
//         const trainer = await GetTrainerById(trainer_id);

//         if (trainer) {
//             const mainPokemon = await GetTrainerMainPokemon(trainer_id);

//             if (mainPokemon) {
//                 mainPokemon.exp += 
//             }
//         }
//     }
// }
