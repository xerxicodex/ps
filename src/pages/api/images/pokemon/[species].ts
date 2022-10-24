import { NextApiRequest, NextApiResponse } from "next";
import { GetPokemonImage } from "../../../../server/utils/pokemon";
import connectDB from "../../../../server/utils/prisma";
import redisClient from "../../../../server/utils/connectRedis";
import customConfig from "../../../../server/config/default";

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

    const cache_key = JSON.stringify({'pokemon': props});

    let base64Data = await redisClient.get(cache_key);

    if (!base64Data) {
        connectDB();

        const b64 = await GetPokemonImage(species, options);

        base64Data = b64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        await redisClient.set(cache_key, base64Data, {
            EX: customConfig.redisCacheExpiresIn * 60,
        });

        await prisma.$disconnect();
    }
    
    const img = Buffer.from(base64Data, 'base64');

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