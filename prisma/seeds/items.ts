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


                if (processed_item_names.indexOf(name) == -1) {
                    let category = ItemCategoryEnumType[
                        (item.category?.name ?? "")
                            .replace(/-/gi, "_") as keyof typeof ItemCategoryEnumType
                    ];

                    let description = "";

                    if (category == ItemCategoryEnumType.all_machines) {
                        item.effect_entries.forEach((f) => {
                            if (f?.language?.name == "en") {
                                description = f.effect;
                            }
                        })
                    } else if (category == ItemCategoryEnumType.mega_stones) {
                        item.effect_entries.forEach((f) => {
                            if (f?.language?.name == "en") {
                                description = f.effect.replace("Held: ", "");
                            }
                        })
                    } else {
                        item.flavor_text_entries.forEach((f) => {
                            if (f?.language?.name == "en") {
                                description = f.text;
                            }
                        })
                    }

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

                    switch (category) {
                        case ItemCategoryEnumType.gameplay:
                        case ItemCategoryEnumType.training:
                        case ItemCategoryEnumType.mega_stones:
                        case ItemCategoryEnumType.dex_completion:
                        case ItemCategoryEnumType.apricorn_balls:
                        case ItemCategoryEnumType.plot_advancement:
                            rarity = RarityEnumType.mythical;
                            break;
                        case ItemCategoryEnumType.vitamins:
                        case ItemCategoryEnumType.all_machines:
                            rarity = RarityEnumType.legendary;
                            break;
                    }

                    _items.push({
                        name,
                        description,
                        category: category,
                        rarity
                    })

                    processed_item_names.push(name)
                }
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
