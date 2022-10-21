import { DifficultyEnumType, Tower, TowerPokemon } from "@prisma/client";
import { title } from "case";
import classNames from "classnames";
import type { GetServerSideProps, NextPage } from "next";
import numeral from "numeral";
import { ElementRef, useEffect, useState } from "react";
import FullScreenLoader from "../client/components/FullScreenLoader";
import PokemonProfileImage, { PokemonProfileImageProps } from "../client/components/PokemonProfileImage";
import MainLayout from "../client/layouts/MainLayout";
import useStore from "../client/store";
import { DifficultyColors } from "../client/utils/colors";
import { trpc } from "../client/utils/trpc";

const HomePage: NextPage = () => {
    const store = useStore();

    const [floors, setFloors] = useState({} as any);

    const [tower, setTower] = useState({} as Tower);

    const { data, isLoading, isFetching, error, isError } = trpc.useQuery([
        "tower.list",
    ]);

    useEffect(() => {
        store.setPageLoading(isLoading || isFetching);
    }, [isLoading, isFetching]);

    useEffect(() => {
        console.log("data.tower", data);
        if (data?.towers && !tower.id) {
            setTower(data.towers[0]);
        }
    }, [data, isLoading, isFetching]);

    const parseTower = (_tower: Tower) => {
        const floors: any = { };

        let top_floor = 0;

        (_tower as any)?.pokemon?.forEach((p: TowerPokemon) => {
            const floor = p.floor;
            if (floor) {
                if (floor > top_floor) top_floor = floor;

                if(!floors[floor]) {
                    floors[floor] = { leaders: [], grunts: [] };
                }

                const render = () => (<PokemonProfileImage key={p.id} pokemon={(p as any).pokemon} color={p.color ?? ""} />);

                if (floors[floor].leaders.length < 3) floors[floor].leaders.push({ pokemon: p, render })
                else floors[floor].grunts.push({render})
            }
        })

        floors.top = floors[top_floor];

        return floors;
    }

    useEffect(() => {
        setFloors(parseTower(tower))
    }, [tower])

    const handleScroll = (e: any) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            alert("test")
        }
      }
    

    return (
        <MainLayout>
            <FullScreenLoader loading={isLoading} />
            <div className="w-full h-full flex">
                <div className="w-[25%] border-r shadow-lg grid overflow-hidden">
                    <div className="w-[110%] pr-[10%] h-full overflow-y-auto" onScroll={handleScroll}>
                        {data?.towers?.map((_tower: Tower, i: number) => (
                            <div
                                key={i}
                                onClick={() => setTower(_tower)}
                                className={classNames(
                                    tower.id == _tower.id
                                        ? "from-blue-200/25 to-blue-400/25"
                                        : "cursor-pointer hover:bg-gray-50",
                                    "bg-gradient-to-r h-[150px] border-b transition-all duration-500 flex flex-wrap w-full h-full"
                                )}
                            >
                                <div className="flex w-full px-8 pt-4 h-1/4 justify-between">
                                    <div className="flex flex-wrap justify-start">
                                        <div className="title w-full font-bold text-slate-500 mb-2">
                                            {_tower.name}
                                        </div>
                                        {/* <div
                                            className={classNames(
                                                `${
                                                    DifficultyColors[
                                                        _tower?.difficulty as keyof typeof DifficultyEnumType
                                                    ]?.text
                                                }`,
                                                "rounded-lg py-1 text-xs uppercase font-semibold"
                                            )}
                                        >
                                            {title(_tower?.difficulty ?? "")}
                                        </div> */}
                                    </div>
                                    <div className="text-xs">
                                    <div
                                            className={classNames(
                                                `${
                                                    DifficultyColors[
                                                        _tower?.difficulty as keyof typeof DifficultyEnumType
                                                    ]?.text
                                                }`,
                                                "rounded-lg py-1 text-xs uppercase font-semibold"
                                            )}
                                        >
                                            {title(_tower?.difficulty ?? "")}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center px-8 justify-start w-full h-3/4">
                                    <div className="flex gap-x-4">
                                        {parseTower(_tower)?.top?.leaders?.map((x: any) => x.render())}
                                        <div className="flex items-center">
                                            +{(_tower as any).pokemon.length - 3} more
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-[75%] flex flex-wrap bg-gray-100">
                    <div className="flex items-center justify-between px-14 w-full h-1/5">
                        <div className="flex flex-wrap">
                            <div className="text-4xl font-black text-slate-600 w-full mb-2">
                                {tower?.name}
                            </div>
                            <div className="title font-semibold text-slate-500">
                                Battle tower
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    console.log({ cookies: req.cookies });
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            requireAuth: true,
            enableAuth: true,
        },
    };
};

export default HomePage;
