import {
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

    const parsed = `${`${
        prefix && prefix.length > 0
            ? `${title(prefix).split(" ").join("-")}`
            : ""
    }${title(species).split(" ").join("-")}`}${
        form && form.length > 0 ? ` (${form})` : ""
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
