import { DifficultyEnumType, Prisma, PrismaClient } from "@prisma/client";

export const seedPokemon = async (prisma: PrismaClient) => {
    const towerCount = await prisma.tower.count();

    if (towerCount == 0) {

        let towerPokemon: Prisma.TowerPokemonUncheckedCreateInput[] = [];

        let towers: Prisma.TowerUncheckedCreateInput[] = [];

        // Legendary tower
        towerPokemon = [ ...towerPokemon, ...[
            {
                id: 1,
                pokemon_id: 1,
                tower_id: 1,
            }
        ]]

        towers = [ ...towers, ...[
            {
                id: 1,
                name: "Legendary Isle",
                difficulty: DifficultyEnumType.master,
            }
         ] ]


    }
}
