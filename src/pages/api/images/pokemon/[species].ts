import { NextApiRequest, NextApiResponse } from "next";
import { GetPokemonImage } from "../../../../server/utils/pokemon";
import connectDB from "../../../../server/utils/prisma";
import cache from "memory-cache";

// Connect to Prisma
connectDB();

type Data = {
    name: string;
};

export async function ImagesPokemonSpeciesRoute(props: {species: string, color?: string}): Promise<Buffer> {
    let { species, color } = props;

    const options: any = { color };

    if (species.indexOf("-mega") != -1) {
        options.isMega = true;

        if (species.indexOf('-y') != -1) {
            options.isMegaY = true;
        }
    }

    if (species.indexOf("gigantamax-") == 0) {
        options.isGigantamax = true;
        species = species.replace("gigantamax-", "")
    }

    console.log(options)

    const cache_key = JSON.stringify([species, options]);

    let img = cache.get(cache_key);

    if (!img) {
        const b64 = await GetPokemonImage(species, options);

        var base64Data = b64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
        img = Buffer.from(base64Data, 'base64');

        cache.put(cache_key, img, 24 * 1000 * 60 * 60);
    }

    return img;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let { species, color } = req.query;

    species = species as string;

    const img = await ImagesPokemonSpeciesRoute({ species, color: color as string })

    try {

        res.writeHead(200, {
            'Cache-Control': 's-maxage=86400',
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img)
    } catch (err) {
        console.log(err)
        res.status(404)
    }
}