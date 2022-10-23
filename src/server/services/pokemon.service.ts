import { Pokemon, Prisma } from "@prisma/client";

export const CreatePokemon = async (input: Prisma.PokemonCreateInput) => {
    return (await prisma.pokemon.create({
        data: input,
    })) as Pokemon;
};

export const FindPokemon = async (
    where: Partial<Prisma.PokemonWhereInput>,
    select?: Prisma.PokemonSelect
) => {
    return (await prisma.pokemon.findFirst({
        where,
        select,
    })) as Pokemon;
};

export const FindUniquePokemon = async (
    where: Prisma.PokemonWhereUniqueInput,
    select?: Prisma.PokemonSelect
) => {
    return (await prisma.pokemon.findUnique({
        where,
        select,
    })) as Pokemon;
};

export const UpdatePokemon = async (
    where: Partial<Prisma.PokemonWhereUniqueInput>,
    data: Prisma.PokemonUpdateInput,
    select?: Prisma.PokemonSelect
) => {
    return (await prisma.pokemon.update({ where, data, select })) as Pokemon;
};

export async function GetPokemonById(id: number) {
    return await FindPokemon({ id })
}

export async function GetPokemonByName(name: string) {
    return await FindPokemon({ name })
}