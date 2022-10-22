import {
    ItemCategoryEnumType,
    MoveCategoryEnumType,
    Prisma,
    PrismaClient,
    RarityEnumType,
} from "@prisma/client";
import { Item, MainClient } from "pokenode-ts";
import process from "process";
import RunParallelLimit from "run-parallel-limit";
import fs from 'fs';

const maindex = new MainClient({ baseURL: process.env.POKEAPI_URL });

const processed_item_names: string | string[] = [];

const _items: Prisma.ItemUncheckedCreateInput[] = [];

const ids: number[] = new Array(15200).fill(null).map((x, i) => i + 1);

let item_id = 0;

const items_to_process: { id: number, category: string, name: string }[] = [] as any;

Object.values(ItemCategoryEnumType).forEach(icet => {

    const item_category = icet.replace("_", "-");

    const item_dirs = fs.readdirSync(`public/images/icons/items/${item_category}`)

    if (item_dirs.length > 0) {
        item_dirs.forEach(file_name => {
            const item_name = file_name.split(".").shift();

            if (item_name) {
                item_id++;
                items_to_process.push({ id: item_id, category: item_category, name: item_name })
            }
        });
    }

})


const jobs = items_to_process.map(item_process => {
    return async (callback: any) => {
        let item = null;

        try {
            item = await maindex.item.getItemByName(item_process.name);
        } catch(ee) {}

        const name_category = item_process.name + "-" + item_process.category;

        if (!item) {
            try {
                item = await maindex.item.getItemByName(name_category);
            } catch(ee) {}
        }

        const category_name = item_process.category + "-" + item_process.name;

        if (!item) {
            try {
                item = await maindex.item.getItemByName(category_name);
            } catch(ee) {}
        }
        
        if (!item) {
            item = {
                name: category_name,
            } as Item
        }
        
        try {
            console.log(`[item][${item_process.category}][${item_process.id}][${item.name}] process`)
            
            let name = item_process.name;

            const category = ItemCategoryEnumType[item_process.category.replace('-', '_') as keyof typeof ItemCategoryEnumType];

            if (processed_item_names.indexOf(name) == -1) {
                let description = "";

                if ([ItemCategoryEnumType.tm, ItemCategoryEnumType.tr].indexOf(category as any) != -1) {
                    item.effect_entries?.forEach((f) => {
                        if (f?.language?.name == "en") {
                            description = f.effect;
                        }
                    });
                } else if (category == ItemCategoryEnumType.mega_stone) {
                    item.effect_entries?.forEach((f) => {
                        if (f?.language?.name == "en") {
                            description = f.effect.replace("Held: ", "");
                        }
                    });
                } else {
                    item.flavor_text_entries?.forEach((f) => {
                        if (f?.language?.name == "en") {
                            description = f.text;
                        }
                    });
                }

                let rarity: RarityEnumType = RarityEnumType.common;

                if (item.cost >= 10000 || item.cost == 0) {
                    rarity = RarityEnumType.mythical;
                } else if (item.cost >= 1000) {
                    rarity = RarityEnumType.legendary;
                } else if (item.cost >= 800) {
                    rarity = RarityEnumType.rare;
                } else if (item.cost >= 600) {
                    rarity = RarityEnumType.uncommon;
                }

                switch (category) {
                    case ItemCategoryEnumType.key_item:
                    case ItemCategoryEnumType.mega_stone:
                    case ItemCategoryEnumType.storage:
                        rarity = RarityEnumType.mythical;
                        break;
                    case ItemCategoryEnumType.exp_candy:
                    case ItemCategoryEnumType.evo_item:
                        rarity = RarityEnumType.legendary;
                        break;
                }

                _items.push({
                    category,
                    name,
                    alt_name: name != item.name ? item.name : null,
                    description,
                    rarity,
                });

                processed_item_names.push(name);
            }
            console.log(`[item][${item_process.category}][${item_process.id}][${item.name}] added`)
            callback(null, `done ${item.name}`);
        

        } catch (error) {
            console.log(`[item][${item_process.category}][${item_process.id}][${item.name}] Skipped`);
            console.log(error);
            callback(null, `Skipped ${item_process.name}`);
        }
    }
})

// return async (callback: any) => {
//     try {
//     } catch (error) {
//         console.log(`[item][${item_id}] Skipped`);
//         callback(null, `Skipped ${item_id}`);
//     }
// }

// const jobs_old = ids.map((item_id) => {
//     return async (callback: any) => {
//         try {
//             const item = await maindex.item.getItemById(item_id);

//             if (item) {
//                 let name = "";

//                 item.names.forEach((x) => {
//                     if (x?.language?.name == "en") {
//                         name = x.name.toLowerCase();
//                     }
//                 });

//                 if (processed_item_names.indexOf(name) == -1) {
//                     let category =
//                         ItemCategoryEnumType[
//                             (item.category?.name ?? "").replace(
//                                 /-/gi,
//                                 "_"
//                             ) as keyof typeof ItemCategoryEnumType
//                         ];

//                     let description = "";

//                     if (category == ItemCategoryEnumType.all_machines) {
//                         item.effect_entries.forEach((f) => {
//                             if (f?.language?.name == "en") {
//                                 description = f.effect;
//                             }
//                         });
//                     } else if (category == ItemCategoryEnumType.mega_stones) {
//                         item.effect_entries.forEach((f) => {
//                             if (f?.language?.name == "en") {
//                                 description = f.effect.replace("Held: ", "");
//                             }
//                         });
//                     } else {
//                         item.flavor_text_entries.forEach((f) => {
//                             if (f?.language?.name == "en") {
//                                 description = f.text;
//                             }
//                         });
//                     }

//                     let rarity: RarityEnumType = RarityEnumType.common;

//                     if (item.cost >= 10000 || item.cost == 0) {
//                         rarity = RarityEnumType.mythical;
//                     } else if (item.cost >= 1000) {
//                         rarity = RarityEnumType.legendary;
//                     } else if (item.cost >= 800) {
//                         rarity = RarityEnumType.rare;
//                     } else if (item.cost >= 600) {
//                         rarity = RarityEnumType.uncommon;
//                     }

//                     switch (category) {
//                         case ItemCategoryEnumType.gameplay:
//                         case ItemCategoryEnumType.training:
//                         case ItemCategoryEnumType.mega_stones:
//                         case ItemCategoryEnumType.dex_completion:
//                         case ItemCategoryEnumType.apricorn_balls:
//                         case ItemCategoryEnumType.plot_advancement:
//                             rarity = RarityEnumType.mythical;
//                             break;
//                         case ItemCategoryEnumType.vitamins:
//                         case ItemCategoryEnumType.all_machines:
//                             rarity = RarityEnumType.legendary;
//                             break;
//                     }

//                     _items.push({
//                         name,
//                         description,
//                         category: category,
//                         rarity,
//                     });

//                     processed_item_names.push(name);
//                 }
//             }

//             console.log(`[item][${item_id}] Loaded`);
//             callback(null, `Loaded ${item_id}`);
//         } catch (error) {
//             console.log(`[item][${item_id}] Skipped`);
//             callback(null, `Skipped ${item_id}`);
//         }
//     };
// });

export const seedItems = async (prisma: PrismaClient) => {
    await prisma.item.deleteMany();

    const itemCount = await prisma.item.count();

    if (itemCount == 0) {
        while (jobs.length > 0) {

            let _jobs: any = [];
    
            if (jobs.length >= 5) {
                _jobs = jobs.splice(0, 10);
            } else {
                _jobs = jobs.splice(0, jobs.length);
            }
    
            await new Promise((done) =>
                RunParallelLimit(
                    _jobs,
                    parseInt(`${process.env.POKEAPI_PARALLEL_LIMIT}`),
                    done
                )
            );
    
            console.log("jobs remaining", jobs.length);
        }

        await prisma.item.createMany({
            data: _items
        })
    
        // while (_items.length > 0) {
        //     const data = _items.shift();
        //     if (data) {
        //         const id = data?.id;
        //         delete data['id'];
        //         await prisma.item.upsert({
        //             where: { id: id },
        //             create: data,
        //             update: data
        //         });
        //     }
        // }
    }
};
