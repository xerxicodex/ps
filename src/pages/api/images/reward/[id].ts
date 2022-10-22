import { NextApiRequest, NextApiResponse } from "next";
import { GetPokemonImage } from "../../../../server/utils/pokemon";
import connectDB from "../../../../server/utils/prisma";
import cache from "memory-cache";
import { ImagesPokemonSpeciesRoute } from "../pokemon/[species]";
import { ItemCategoryEnumType, Prisma, RewardEnumType } from "@prisma/client";
import { ImagesItemIdRoute } from "../item/[id]";

// Connect to Prisma
connectDB();

type Data = {
    name: string;
};

export async function ImagesRewardIdRoute(props: { id: number }) {
    const { id } = props;

    const cache_key = JSON.stringify(["reward", id]);

    let img = cache.get(cache_key);

    if (!img) {
        console.log("find reward")

        const reward = await prisma.reward.findFirst({ where: { id } });

        console.log("done")

        if (reward) {
            console.log("reward found", { reward })
            if (reward.reward == RewardEnumType.pokemon) {
                console.log({ reward })
                const pokemonInput = JSON.parse(reward.value ?? "{}") as Prisma.TrainerPokemonUncheckedCreateInput
                const pokemon = await prisma.pokemon.findFirst({ where: { id: pokemonInput.pokemon_id ?? 0 } })
                // img = await ImagesPokemonSpeciesRoute({ species: pokemon?.name ?? "", color: pokemonInput.color ?? "" });

                let ball = await prisma.item.findFirst({ where: { category: ItemCategoryEnumType.ball, name: 'poke' } })
                img = await ImagesItemIdRoute({ id: ball?.id });

                if (pokemon?.is_legendary || pokemon?.is_mythical) {
                    ball = await prisma.item.findFirst({ where: { category: ItemCategoryEnumType.ball, name: 'master' } });
                    img = await ImagesItemIdRoute({ id: ball?.id });
                }

                if (pokemon?.is_baby) {
                    ball = await prisma.item.findFirst({ where: { category: ItemCategoryEnumType.key_item, name: 'mystery-egg' } });
                    img = await ImagesItemIdRoute({ id: ball?.id });
                }
            }

            if (reward.reward == RewardEnumType.trainer_exp) {
                img = await ImagesItemIdRoute({ name: "coconut-milk" });
            }

            if (reward.reward == RewardEnumType.pokemon_exp) {
                img = await ImagesItemIdRoute({ name: "rare-candy" });
            }

            if (reward.reward == RewardEnumType.battle_points) {
                img = await ImagesItemIdRoute({ name: "pass" });
            }

            if (reward.reward == RewardEnumType.coins) {
                img = await ImagesItemIdRoute({ name: "relic-gold" });
            }

            cache.put(cache_key, img, 24 * 1000 * 60 * 60);
        }
    }

    return img;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let { id } = req.query;

    const img = await ImagesRewardIdRoute({ id: parseInt(id as string ?? "0") });

    try {
        if (img) {
            res.writeHead(200, {
                'Cache-Control': 's-maxage=86400',
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img)
        } else {
            throw ("no image found")
        }
    } catch (err) {
        console.log(err)
        res.status(404).end()
    }
}