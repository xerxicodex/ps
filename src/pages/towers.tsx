import {
    DifficultyEnumType,
    Reward,
    Tower,
    TowerPokemon,
    TowerReward,
} from "@prisma/client";
import { title } from "case";
import classNames from "classnames";
import type { GetServerSideProps, NextPage } from "next";
import numeral from "numeral";
import { ElementRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ComponentLoader from "../client/components/ComponentLoader";
import FullScreenLoader from "../client/components/FullScreenLoader";
import PokemonImage from "../client/components/PokemonImage";
import PokemonProfileImage, {
    PokemonProfileImageProps,
} from "../client/components/PokemonProfileImage";
import RewardImage from "../client/components/RewardImage";
import MainLayout from "../client/layouts/MainLayout";
import useStore from "../client/store";
import { DifficultyColors } from "../client/utils/colors";
import { RewardAmount, RewardName, RewardValue } from "../client/utils/reward";
import { trpc } from "../client/utils/trpc";
import { ParsePokemonFullName } from "../client/utils/pokemon";

const HomePage: NextPage = () => {
    const store = useStore();

    const [page, setPage] = useState(1 as number);

    const [floors, setFloors] = useState({} as any);

    const [pages, setPages] = useState({} as { [key: number]: Tower[] });

    const [tower, setTower] = useState({} as Tower);

    const { data, isLoading, isFetching, error, isError, refetch } =
        trpc.useQuery(["tower.list"]);

    const { data: moreData, isFetching: listLoading } = trpc.useQuery(
        ["tower.list", { page }],
        {
            enabled: page > 1,
        }
    );

    const { mutate: challenge, isLoading: isChallenging } = trpc.useMutation(
        "tower.challenge",
        {
            onSuccess(data) {
                console.log("challenge", data);
            },
            onError(error: any) {
                toast(error.message, {
                    type: "error",
                    position: "top-center",
                });
            },
        }
    );

    useEffect(() => {
        store.setPageLoading(isLoading || isFetching || isChallenging);
    }, [isLoading, isFetching, isChallenging]);

    useEffect(() => {
        console.log("data.tower", data);
        if (data?.towers && !tower.id) {
            setTower(data.towers[0]);
        }

        if (data?.towers) {
            setPages((x: any) => ({ ...x, ...{ 1: data.towers } }));
        }
    }, [data, isLoading, isFetching]);

    useEffect(() => {
        if (moreData?.towers?.length > 0) {
            if (moreData?.meta?.currentPage == page) {
                setPages((x: any) => ({
                    ...x,
                    ...{ [page]: moreData.towers },
                }));
            }

            if (!moreData?.meta?.next) {
                setPage(moreData?.meta?.currentPage - 1);
            }
        }
    }, [moreData]);

    const parseTower = (_tower: Tower) => {
        const floors: any = {};

        let top_floor = 0;

        (_tower as any)?.pokemon?.sort(
            (
                a: TowerPokemon,
                b: TowerPokemon
            ) =>
                (a.level ?? 0) +
                (a.floor ?? 0) -
                ((b.level ?? 0) +
                    (b.floor ?? 0))
        ).forEach((p: TowerPokemon) => {
            const floor = p.floor;
            if (floor) {
                if (floor > top_floor) top_floor = floor;

                if (!floors[floor]) {
                    floors[floor] = { leaders: [], grunts: [] };
                }

                const render = (className?: string) => (
                    <PokemonProfileImage
                        key={p.id}
                        className={className}
                        pokemon={(p as any).pokemon}
                        color={p.color ?? ""}
                    />
                );

                if (floors[floor].leaders.length < 7)
                    floors[floor].leaders.push({ pokemon: p, render });
                else floors[floor].grunts.push({ render });
            }
        });

        floors.top = floors[top_floor];

        return floors;
    };

    useEffect(() => {
        setFloors(parseTower(tower));
    }, [tower]);

    const handleScroll = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop ===
            e.target.clientHeight;
        if (bottom && !listLoading) {
            setPage(page + 1);
            console.log({ page });
        }
    };

    return (
        <MainLayout>
            <FullScreenLoader loading={isLoading} />
            <div className="w-full h-full flex">
                <div className="relative w-[25%] border-r shadow-lg grid overflow-hidden">
                    <ComponentLoader loading={listLoading} />
                    <div
                        className={classNames(
                            "overflow-y-auto w-[110%] pr-[10%] h-full"
                        )}
                        onScroll={handleScroll}
                    >
                        {Object.values(pages).map((page) =>
                            page.map((_tower: Tower) => (
                                <div
                                    key={_tower.id}
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
                                                #{_tower.id} {_tower.name}
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
                                                {title(
                                                    _tower?.difficulty ?? ""
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center px-8 justify-start w-full h-3/4">
                                        <div className="flex gap-x-4">
                                            {parseTower(_tower)
                                                ?.top?.leaders?.reverse()?.splice(0, 3)
                                                ?.map((x: any) => x.render())}
                                            <div className="flex items-center">
                                                +
                                                {(_tower as any).pokemon
                                                    .length - 3}{" "}
                                                more
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="w-[75%] bg-gray-100 pb-12 overflow-y-auto">
                    <div className="flex items-center justify-between px-14 w-full h-1/6">
                        <div className="flex flex-wrap">
                            <div className="text-4xl font-black text-slate-600 w-full mb-2">
                                {tower?.name}
                            </div>
                            <div className="title font-semibold text-slate-500">
                                Battle tower
                            </div>
                        </div>

                        <div
                            className={classNames(
                                // `${
                                //     DifficultyColors[
                                //         tower?.difficulty as keyof typeof DifficultyEnumType
                                //     ]?.border
                                // }`,
                                "h-4/5"
                            )}
                        >
                            <div className="flex relative -gap-x-8 w-full h-full">
                                <div className="col-span-2"></div>
                                {parseTower(tower)?.top?.leaders?.map(
                                    (x: any, i: number) => (
                                        <div className="absolute top-8" style={{ right: (i + 2) * 2.7 + 'em'}}>
                                            {x.render(
                                                "w-[75px] h-[75px] bg-gray-300 outline outline-white rounded-full col-span-1 h-full p-4"
                                            )}
                                        </div>
                                    )
                                )}
                                <div className="absolute top-8"style={{ right: 0 * 2.5 + 'em'}}>
                                    <div className="w-[75px] h-[75px] col-span-1 h-full flex items-center justify-center">
                                        <div>
                                            <div className="w-full text-lg font-black">
                                                +
                                                {(tower as any)?.pokemon?.length -
                                                    6}
                                            </div>
                                            <div className="w-full text-xs text-center">
                                                {" "}
                                                more
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-14">
                        <div className="flex items-start gap-x-8">
                            <div className="w-4/6">
                                <div className="flex flex-wrap w-full h-3/6 mb-8 bg-white rounded-lg shadow overflow-hidden">
                                    <div className="w-full h-[7%] p-6 mb-6 text-lg font-semibold uppercase opacity-50">
                                        Rewards
                                    </div>
                                    <div className="w-full min-h-[93%]">
                                        <div className="flex flex-wrap ">
                                            {(tower as any).rewards
                                                ?.sort(
                                                    (a: any, b: any) =>
                                                        RewardAmount(a.reward) -
                                                        RewardAmount(b.reward)
                                                )
                                                ?.map((towerReward: any) => {
                                                    // const value = RewardValue(towerReward.reward)
                                                    const name = RewardName(
                                                        towerReward.reward
                                                    );

                                                    const amount = RewardAmount(
                                                        towerReward.reward
                                                    );

                                                    return (
                                                        <div className="w-full p-4 pb-0 border-t mb-4">
                                                            <div className="flex gap-x-4 w-full items-center justify-between">
                                                                <div className="flex gap-x-4 w-full items-center">
                                                                    <div className="w-8 h-8 bg-red-100 rounded-full">
                                                                        <RewardImage
                                                                            reward={
                                                                                towerReward.reward
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="">
                                                                        {title(
                                                                            name
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="">
                                                                    {numeral(
                                                                        amount
                                                                    ).format(
                                                                        "0,0"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap w-full mb-8 bg-white rounded-lg shadow overflow-hidden">
                                    <div className="w-full h-[7%] p-6 mb-0 text-lg font-semibold uppercase opacity-50">
                                        Floor Pokemon
                                    </div>
                                    <div className="w-full min-h-[93%]">
                                        <div className="flex flex-wrap ">
                                            {(tower as any).pokemon
                                                ?.map(
                                                    (
                                                        towerPokemon: TowerPokemon
                                                    ) => {
                                                        const name =
                                                            ParsePokemonFullName(
                                                                towerPokemon
                                                            );

                                                        return (
                                                            <div className="w-full p-4 pb-0 border-t mb-4">
                                                                <div className="flex gap-x-4 w-full items-center justify-between">
                                                                    <div className="flex gap-x-4 w-full items-center">
                                                                        <div className="w-8 h-8 bg-red-100 rounded-full">
                                                                            <PokemonImage
                                                                                pokemon={
                                                                                    (
                                                                                        towerPokemon as any
                                                                                    )
                                                                                        .pokemon as Pokemon
                                                                                }
                                                                                color={
                                                                                    towerPokemon.color ??
                                                                                    ""
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="">
                                                                            {title(
                                                                                name
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="">
                                                                        {numeral(
                                                                            towerPokemon.floor
                                                                        ).format(
                                                                            "0,0"
                                                                        )}
                                                                        F
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 grid-rows-6 gap-y-8 w-2/6">
                                <div className="w-full row-span-5 bg-white rounded-lg shadow overflow-hidden">
                                    <div className="w-full h-[7%] p-6 mb-6 text-lg font-semibold uppercase opacity-50">
                                        Rankings
                                    </div>
                                </div>
                                <div className="w-full row-span-1 bg-gradient-to-r from-cyan-200 to-indigo-400 hover:opacity-75 hover:shadow-lg active:scale-95 cursor-pointer rounded-lg shadow overflow-hidden p-4">
                                    <div
                                        onClick={() =>
                                            challenge({ tower_id: tower.id })
                                        }
                                        className="flex items-center justify-center w-full h-full text-2xl text-lg font-semibold uppercase text-white"
                                    >
                                        CHALLANGE
                                    </div>
                                </div>
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
