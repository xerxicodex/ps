import { PrismaClient } from "@prisma/client";
import { GetTrainerById } from "./trainer";

const prisma = new PrismaClient();

export async function GetPokemonById(id: number) {
    return await prisma.pokemon.findFirst({ where: { id } })
}

export async function GetPokemonByName(name: string) {
    return await prisma.pokemon.findFirst({ where: { name } })
}