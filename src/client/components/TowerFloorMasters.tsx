import { Tower, TowerPokemon } from "@prisma/client";
import { title } from "case";
import classNames from "classnames";
import numeral from "numeral";
import { ParsePokemonFullName } from "../utils/pokemon";
import PokemonProfileImage from "./PokemonProfileImage";

export type TowerFloorMastersProps = {
    headerClassName?: string;
    className?: string;
    tower: Tower;
};

const TowerFloorMasters = (props: TowerFloorMastersProps) => {
    let { tower, headerClassName } = props;

    return (
        <div className="flex flex-wrap w-full h-full overflow-hidden">
            <div
                className={classNames(
                    "w-full h-[7%] p-6 mb-6 font-semibold uppercase opacity-50",
                    (headerClassName as string)?.indexOf("text-") >= 0
                        ? ""
                        : "text-lg",
                    headerClassName
                )}
            >
                Floor Masters
            </div>
            <div className="w-full min-h-[93%]">
                <div className="flex flex-wrap ">
                    {[1, 2, 3, 4, 5, 6]?.map((floor: number) => {
                        const leader = (tower as any)?.pokemon?.filter(
                            (x: TowerPokemon) => x.floor == floor
                        )[0];

                        if (leader) {
                            const name = ParsePokemonFullName(leader);
                            return (
                                <div
                                    key={leader.id + floor}
                                    className="w-full p-4 pb-0 border-t mb-4"
                                >
                                    <div className="flex gap-x-4 w-full items-center justify-between">
                                        <div className="flex gap-x-4 w-full items-center">
                                            <PokemonProfileImage
                                                pokemon={
                                                    (leader as any).pokemon
                                                }
                                                className="w-8 h-8 bg-red-100 outline outline-red-100 rounded-full"
                                                color={leader.color ?? ""}
                                            />
                                            <div className="">
                                                {title(name)}
                                            </div>
                                        </div>
                                        <div className="">
                                            {numeral(floor).format("0,0")}F
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default TowerFloorMasters;
