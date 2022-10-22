import { Pokemon } from "@prisma/client";
import classNames from "classnames";

export type PokemonImageProps = { className?: string, color: string, pokemon?: Pokemon | null, id?: number | string };

const PokemonImage = (props: PokemonImageProps) => {
   let { className, id, pokemon, color } = props;

    if (pokemon) {
        id = pokemon.name ?? "";
    }

    return (
        <div className={classNames("w-full h-full bg-contain bg-center bg-no-repeat", className)} style={{ backgroundImage: `url(api/images/pokemon/${id}?color=${color})`}}></div>
    );
};

export default PokemonImage;
