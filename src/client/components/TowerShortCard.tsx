import { DifficultyEnumType, Tower } from "@prisma/client";
import { title } from "case";
import classNames from "classnames";
import { DifficultyColors } from "../utils/colors";
import PokemonProfileImage from "./PokemonProfileImage";

export type TowerShortCardProps = {
    className?: string;
    active?: boolean,
    tower: Tower;
};

const TowerShortCard = (props: TowerShortCardProps) => {
    let { tower, active } = props;

    let pokemonImagesRendered = 0;

    return (
        <div className="flex flex-wrap w-full h-full overflow-hidden">
            <div
                key={tower.id}
                className={classNames(
                    active
                        ? "from-blue-200/25 to-blue-400/25"
                        : "cursor-pointer hover:bg-gray-50",
                    "bg-gradient-to-r border-b transition-all duration-500 flex flex-wrap w-full h-full"
                )}
            >
                <div className="flex w-full px-8 pt-4 h-1/4 justify-between">
                    <div className="flex flex-wrap justify-start">
                        <div className="title w-full overflow-elipsis nowrap font-bold text-slate-500 mb-2">
                            #{tower.id} {tower.name}
                        </div>
                        {/* <div
                                                className={classNames(
                                                    `${
                                                        DifficultyColors[
                                                            tower?.difficulty as keyof typeof DifficultyEnumType
                                                        ]?.text
                                                    }`,
                                                    "rounded-lg py-1 text-xs uppercase font-semibold"
                                                )}
                                            >
                                                {title(tower?.difficulty ?? "")}
                                            </div> */}
                    </div>
                    <div className="text-xs">
                        <div
                            className={classNames(
                                `${
                                    DifficultyColors[
                                        tower?.difficulty as keyof typeof DifficultyEnumType
                                    ]?.text
                                }`,
                                "rounded-lg py-1 text-xs uppercase font-semibold"
                            )}
                        >
                            {title(tower?.difficulty ?? "")}
                        </div>
                    </div>
                </div>
                <div className="flex items-center px-8 justify-start w-full h-3/4">
                    <div className="flex gap-x-4">
                        {(tower as any)?.pokemon?.slice(-3)?.map((p: any) => (
                            <PokemonProfileImage
                                key={p.id}
                                className="min-w-[50px] min-h-[50px]"
                                pokemon={(p as any).pokemon}
                                color={p.color ?? ""}
                            />
                        ))}
                        <div className="flex items-center">
                            +{(tower as any).pokemon.length - 3} more
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TowerShortCard;
