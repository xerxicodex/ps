import { ItemCategoryEnumType, MoveCategoryEnumType, Prisma, PrismaClient, RarityEnumType } from "@prisma/client";
import { MainClient } from "pokenode-ts";
import process from "process";
import RunParallelLimit from "run-parallel-limit";

const maindex = new MainClient({ baseURL: process.env.POKEAPI_URL });

const processed_item_names: string | string[] = [];

const _items: Prisma.ItemCreateInput[] = [];

const ids: number[] = new Array(15200).fill(null).map((x, i) => i + 1);

const jobs = ids.map((item_id) => {
    return async (callback: any) => {
        try {
            const item = await maindex.item.getItemById(item_id);

            if (item) {

                let name = "";

                item.names.forEach((x) => {
                    if (x?.language?.name == "en") {
                        name = x.name;
                    }
                })

                let description = "";

                item.effect_entries.forEach((f) => {
                    if (f?.language?.name == "en") {
                        description = f.short_effect;
                    }
                })

                let rarity: RarityEnumType = RarityEnumType.common;

                if (item.cost >= 10000 || item.cost == 0) {
                    rarity = RarityEnumType.mythical
                } else if (item.cost >= 1000) {
                    rarity = RarityEnumType.legendary
                } else if (item.cost >= 800) {
                    rarity = RarityEnumType.rare
                } else if (item.cost >= 600) {
                    rarity = RarityEnumType.uncommon
                }

                _items.push({
                    name,
                    description,
                    category: ItemCategoryEnumType[
                        (item.category?.name ?? "")
                            .replace(/-/gi, "_") as keyof typeof ItemCategoryEnumType
                    ],
                    rarity
                })

            }

            console.log(`[item][${item_id}] Loaded`)
            callback(null, `Loaded ${item_id}`);
        } catch (error) {
            console.log(`[item][${item_id}] Skipped`)
            callback(null, `Skipped ${item_id}`);
        }
    };
});

export const seedItems = async (prisma: PrismaClient) => {
    await prisma.item.deleteMany();

    const itemCount = await prisma.item.count();

    if (itemCount == 0) {
        await new Promise((done) =>
            RunParallelLimit(
                jobs,
                parseInt(`${process.env.POKEAPI_PARALLEL_LIMIT}`),
                done
            )
        );

        await prisma.item.createMany({
            data: _items.sort(),
        });

        console.log("[item] Created all items")
    }
};
