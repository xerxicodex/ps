import {
    DifficultyEnumType,
    NPCPokemon,
    Pokemon,
    PokemonColorEnumType,
    PokemonGenderEnumType,
    RoutePokemon,
    TowerPokemon,
    TrainerPokemon,
} from "@prisma/client";
import { title } from "case";
import numeral from "numeral";
import axios from 'axios';
import Sharp from 'sharp';
import { PadWithZero } from "./numbers";

export function ParsePokemonName(name: string, species: string) {
    if (name.indexOf("unown")) {
        name.replace("-", "#");
    }

    let form: any = name
        ?.replace("galar", "galarian")
        .replace("aola", "alolan")
        .replace("hisui", "hisuian")
        .replace("incarnate", "")
        .replace("nidoran-f", "nidoran#f")
        .replace("nidoran-m", "nidoran#m")
        .replace("mr-mime", "mr#mime")
        .replace("mr-mime", "mr#mime")
        .replace("ho-oh", "ho#oh")
        .replace("mime-jr", "mime#jr")
        .replace("porygon-z", "porygon#z")
        .replace("type-null", "type#null")
        .replace("jangmo-o", "jangmo#o")
        .replace("hakamo-o", "hakamo#o")
        .replace("kommo-o", "kommo#o")
        .replace("kommo-o", "kommo#o")
        .replace("tapu-koko", "tapu#koko")
        .replace("tapu-lele", "tapu#lele")
        .replace("tapu-bulu", "tapu#bulu")
        .replace("tapu-fini", "tapu#fini")
        .replace("mr-rime", "mr#rime")
        .split("-")
        .slice(1)
        .join(" ")
        ?.trim();

    let prefix: any = "";

    if (["galarian", "alolan", "hisuian"].indexOf(form) != -1) {
        prefix = form;
        form = null;
    }

    const altForm = (form ?? "").split(" ").pop();

    if (altForm && altForm.length > 0) {
        if (form.indexOf("mega") != -1) {
            form = title(altForm).split(" ").join("-");
            prefix = "mega";
        }
    }

    const parsed = `${`${prefix && prefix.length > 0
        ? `${title(prefix).split(" ").join("-")}`
        : ""
        }${title(species).split(" ").join("-")}`}${form && form.length > 0 ? ` (${form})` : ""
        }`;

    return parsed;
}

export function ParseGender(gender: PokemonGenderEnumType) {
    return {
        [PokemonGenderEnumType.genderless]: "",
        [PokemonGenderEnumType.male]: "♂",
        [PokemonGenderEnumType.female]: "♀",
        [PokemonGenderEnumType.unknown]: "(?)",
    }[gender];
}

export async function ParsePokemonFullName(
    pokemon: TrainerPokemon | TowerPokemon | NPCPokemon | RoutePokemon
): Promise<string> {
    let _pokemon: Pokemon | null = null;

    if ((pokemon as any).name) {
        _pokemon = { name: "" } as Pokemon;
        _pokemon.name = (pokemon as any).name;
    } else if ((pokemon as any).pokemon) {
        _pokemon = (pokemon as any).pokemon as Pokemon;
    } else {
        _pokemon = await prisma.pokemon.findFirst({
            where: { id: pokemon.pokemon_id },
        });
    }

    let color: any = "";
    let name: any = "";
    let gender: any = "";
    let level: any = pokemon.level;

    if (level) {
        level = numeral(level).format("0,0");
    }

    if (pokemon.color && pokemon.color != PokemonColorEnumType.colorless) {
        color = title(`${pokemon.color}`);
    }

    if (pokemon.gender && pokemon.gender != PokemonGenderEnumType.genderless) {
        gender = ParseGender(pokemon.gender);
    }

    name = ParsePokemonName(_pokemon?.name ?? "", _pokemon?.species ?? "");

    return [
        color + name,
        gender ? gender : null,
        level ? `(Level: ${level})` : null,
    ]
        .filter((x) => (x ?? "").length > 0)
        .join(" ");
}

export async function GetPokemonImage(name: string, options: any) {
    let bitmap = "";

    let found = false;
    const pokemon = await prisma.pokemon.findFirst({ where: { name } })

    console.log({ pokemon })

    if (name.indexOf("deoxys") == 0) {
        if (name.indexOf("-attack") != -1)
            options.version = 1;
        else if (name.indexOf("-defence") != -1)
            options.version = 2;
        else if (name.indexOf("-speed") != -1)
            options.version = 3;
    }

    if (pokemon?.species == "unown") {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split("")
        alphabet.forEach((character, i) => {
            if (name.indexOf(`-${character}`) != -1) {
                options.version = i;
            }
        })
    }

    if (name.indexOf("-galar") != -1) {
        options.version = 1;
    }

    if (name.indexOf("-origin") != -1) {
        options.version = 1;
    }

    if (name.indexOf("-incarnate") != -1) {
        options.version = 1;
    }

    const versions = (options.version ? [options.version] : [...[null], ...(new Array(20).fill(null).map((x, i) => i + 1))]).reverse();

    const color = options.color?.toLowerCase();

    if (["dark", "golden", "aqua", "magma"].indexOf(color) == -1) {
        options.color = color;
    } else {
        options.color = "";
    }

    let imgUrl = "";

    while (!found && versions.length > 0) {
        let genders_to_try = ['mf', 'md', 'fd', 'uk', 'fo', 'mo']

        try {
            if (!found) {
                options.version = versions.pop();

                const run = async () => {
                    imgUrl = GetPokemonImageURLById(pokemon?.dex_id as number, options)

                    // console.log("get pokemon image", imgUrl)
                    let res: any = {};

                    try {
                        res = await axios.get(imgUrl, {
                            responseType: "text",
                            responseEncoding: "base64",
                        })
                    } catch(err) {}

                    bitmap = res.data;

                    found = (bitmap ?? "").length > 0

                    console.log(`\n${!found}, ${genders_to_try.length > 0}\n`)
                    if (!found && genders_to_try.length > 0) {
                        options.gender = genders_to_try.shift();
                        await run();
                    }
                }

                await run();

                if(!found) {
                    throw("can't find img")
                }
            }
        } catch (error) {
            console.log("cant find", imgUrl)
        }
    }

    if (!found) {
        return "";
    }

    let imgProcess = await new (Sharp as any)(Buffer.from(bitmap, "base64"));

    const { width, height } = await imgProcess.metadata();

    console.log({ width, height })

    let bgBuffer: Buffer | null = null;

    if (color == "magma") {
        const foreground = await imgProcess.toBuffer();
        const bg = await new (Sharp as any)(foreground).tint({ r: 200, g: 32, b: 0 });
        bgBuffer = await bg.blur(5).sharpen(5).toBuffer();

        imgProcess = await new (Sharp as any)(foreground).composite([
            { input: bgBuffer, gravity: 'center', top: 0, left: -1 },
            { input: bgBuffer, gravity: 'center' },
            { input: bgBuffer, gravity: 'center', top: 0, left: 1 },
            { input: bgBuffer, gravity: 'center', top: 0, left: 2 },
            { input: bgBuffer, gravity: 'center', top: -1, left: 0 },
            { input: foreground, gravity: 'center' },
        ])
    }

    if (color == "aqua") {
        const foreground = await imgProcess.toBuffer();
        const bg = await new (Sharp as any)(foreground).tint({ r: 50, g: 75, b: 255 });
        bgBuffer = await bg.blur(5).sharpen(5).gamma(1.5).toBuffer();

        imgProcess = await new (Sharp as any)(foreground).composite([
            { input: bgBuffer, gravity: 'center', top: 0, left: -1 },
            { input: bgBuffer, gravity: 'center' },
            { input: bgBuffer, gravity: 'center', top: 0, left: 1 },
            { input: bgBuffer, gravity: 'center', top: 0, left: 2 },
            { input: bgBuffer, gravity: 'center', top: -1, left: 0 },
            { input: foreground, gravity: 'center' },
        ])
    }

    if (color == "dark") {
        await imgProcess.tint({ r: 32, g: 32, b: 32 });
    }

    if (color == "golden") {
        await imgProcess.tint({ r: 250, g: 175, b: 50 });
    }

    const foreground = await imgProcess.toBuffer();
    const bg = await new (Sharp as any)(foreground).tint({ r: 0, g: 0, b: 0 });
    bgBuffer = await bg.blur(2).sharpen(5).toBuffer();

    imgProcess = await new (Sharp as any)(foreground).composite([
        { input: bgBuffer, gravity: 'center', top: 0, left: -1 },
        { input: bgBuffer, gravity: 'center' },
        { input: bgBuffer, gravity: 'center', top: 0, left: 1 },
        { input: bgBuffer, gravity: 'center', top: 0, left: 2 },
        { input: bgBuffer, gravity: 'center', top: -1, left: 0 },
        { input: foreground, gravity: 'center' },
    ])

    bitmap = (await imgProcess.sharpen(1).toBuffer()).toString('base64');

    const img = "data:" + "image/png" + ";base64," + bitmap;

    return img;
}


export function GetPokemonImageURLById(id: number, options: any) {
    // console.log("GetPokemonImageURLByID", { id, options })
    const color = { 'colorless': 'n', 'shiny': 'r' }[(options.color ?? 'colorless').toLowerCase() as string] ?? 'n';

    let gender = { 'any': 'mf', 'male': 'md', 'female': 'fd', 'genderless': 'uk', 'mf': 'mf', 'md': 'md', 'fd': 'fd', 'uk': 'uk', 'fo': 'fo', 'mo': 'mo' }[(options.gender ?? 'any').toLowerCase() as string];

    const form = { 'base': 'n', 'gigantamax': 'g' }[(options.isGigantamax ? 'gigantamax' : 'base').toLowerCase()]

    let version = options.version ?? 0;

    if (options.isMega) {
        version = 1;
    }

    if (options.isMegaY) {
        version = 2;
    }

    const isMaleOnly = [
        32, 33, 34, 106, 107, 128, 236, 237, 313, 381, 414,
        475, 538, 539, 627, 628, 641, 642, 645, 859, 850, 861
    ].indexOf(parseInt(`${id}`)) != -1;

    if (isMaleOnly) {
        gender = "mo";
    }

    const isFemaleOnly = [
        29, 30, 31, 113, 115, 124, 238, 241, 242,
        314, 380, 413, 416, 440, 478, 488, 548, 549,
        629, 630, 669, 670, 671, 758, 761, 762, 763,
        856, 857, 858, 868, 869, 905
    ].indexOf(parseInt(`${id}`)) != -1;

    if (isFemaleOnly) {
        gender = "fo";
    }

    const isGenderlessOnly = [
        81, 82, 100, 101, 120, 121, 132, 137, 144, 145, 146, 150, 151, 201, 233, 241,
        244, 245, 249, 250, 251, 292, 337, 338, 343, 344, 374, 375, 376, 377, 378, 379,
        382, 383, 384, 385, 386, 436, 437, 462, 474, 479, 480, 481, 482, 483, 484, 486,
        487, 489, 490, 491, 492, 493, 494, 599, 600, 601, 615, 622, 623, 638, 639, 640,
        643, 644, 646, 647, 648, 649, 703, 716, 717, 718, 719, 720, 721, 772, 773, 774,
        781, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799,
        800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 854, 855, 870, 880, 881, 882,
        883, 888, 889, 890, 894, 895, 896, 897, 898,
    ].indexOf(parseInt(`${id}`)) != -1;

    if (isGenderlessOnly) {
        gender = "uk";
    }
    // https://s3.amazonaws.com/images.dxrpg.io/images/pokemon/poke_capture_0001_000_mf_n_00000000_f_n.png
    // ${mega ? ("_" + mega.toLowerCase()) : ""}${gigantamax ? ("_" + gigantamax.toLowerCase()) : ""}${color ? ("_" + color.toLowerCase()) : ""}
    return `${process.env.IMAGE_HOST}/pokemon/poke_capture_${PadWithZero(id, '0000')}_${(PadWithZero(version, "000"))}_${gender}_${form}_00000000_f_${color}.png`
}