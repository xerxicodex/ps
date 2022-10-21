import { Pokemon } from "@prisma/client";
import classNames from "classnames";

export type PokemonProfileImageProps = { className?: string, color: string, pokemon: Pokemon| null };

const PokemonProfileImage = (props: PokemonProfileImageProps) => {
    // return (
    //     <div className={classNames("relative w-12 h-12 flex items-center justify-center bg-white shadow rounded-full overflow-hidden", props.className)}>
    //         <div className="absolute w-[100px] h-[50px] bg-no-repeat" style={{ top: '5%', left: '-60%', backgroundSize: "50%", backgroundPosition: 'top', backgroundImage: `url(api/images/pokemon/${props?.pokemon?.name}?color=${props?.color})`}}></div>
    //     </div>
    // );

    return (
        <div className={classNames("relative min-w-[50px] min-h-[50px] flex items-center justify-center overflow-hidden", props.className)}>
            <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(api/images/pokemon/${props?.pokemon?.name}?color=${props?.color})`}}></div>
        </div>
    );
};

export default PokemonProfileImage;
