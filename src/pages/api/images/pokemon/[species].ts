import { NextApiRequest, NextApiResponse } from "next";
import { GetPokemonImage } from "../../../../server/utils/pokemon";
import connectDB from "../../../../server/utils/prisma";

// Connect to Prisma
connectDB();

type Data = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let { species, color } = req.query;

    species = species as string;

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

    const b64 = await GetPokemonImage(species, options);

    var base64Data = b64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    var img = Buffer.from(base64Data, 'base64');

    try {
      
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length
        });
        res.end(img)
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}