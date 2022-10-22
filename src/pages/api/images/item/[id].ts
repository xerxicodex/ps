import { NextApiRequest, NextApiResponse } from "next";
import { GetPokemonImage } from "../../../../server/utils/pokemon";
import connectDB from "../../../../server/utils/prisma";
import cache from "memory-cache";
import { ImagesPokemonSpeciesRoute } from "../pokemon/[species]";
import { Prisma } from "@prisma/client";
import fs from 'fs';

// Connect to Prisma
// connectDB();

type Data = {
    name: string;
};

export async function ImagesItemIdRoute (props: { name?: string | null, id?: number | null }) {
    const { name, id } = props;

    const cache_key = JSON.stringify(["item", id]);

    let img = cache.get(cache_key);

    if (!img) {
        connectDB();

        console.log("find item", props)

        let item = null;

        if (name) {
            item = await prisma.item.findFirst({ where: { name } });
        } else if (id) {
            item = await prisma.item.findFirst({ where: { id } });
        }
        
        img =  item ? fs.readFileSync(`public/images/icons/items/${item?.category?.replace('_', '-')}/${item?.name}.png`) : null;

        console.log("done")

        cache.put(cache_key, img, 24 * 1000 * 60 * 60);

        await prisma.$disconnect();
    }

    return img;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let { id: name_id } = req.query;

    let id = parseInt(name_id as string) ?? null;
    let name = null;

    if (isNaN(id)) {
        name = name_id as string;
    }

    const img = await ImagesItemIdRoute({ name, id });

    try {
        if (img) {
            res.writeHead(200, {
                'Cache-Control': 's-maxage=86400',
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img)
        } else {
            throw("no image found")
        }
    } catch (err) {
        console.log(err)
        res.status(404).end()
    }
}