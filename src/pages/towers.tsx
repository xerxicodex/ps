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
import { ElementRef, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ComponentLoader from "../client/components/ComponentLoader";
import FullScreenLoader from "../client/components/FullScreenLoader";
import PokemonImage from "../client/components/PokemonImage";
import PokemonProfileImage, {
    PokemonProfileImageProps,
} from "../client/components/PokemonProfileImage";

import MainLayout from "../client/layouts/MainLayout";
import useStore from "../client/store";
import { DifficultyColors } from "../client/utils/colors";

import { trpc } from "../client/utils/trpc";
import { ParsePokemonFullName } from "../client/utils/pokemon";
import TowerRewards from "../client/components/TowerRewards";
import TowerFloorMasters from "../client/components/TowerFloorMasters";
import TowerRankings from "../client/components/TowerRankings";
import TowerShortCard from "../client/components/TowerShortCard";
import { CloseIcon } from "../client/icons";

const HomePage: NextPage = () => {
    const store = useStore();

    // showFullScreenTower
    const [showFST, setShowFST] = useState(false);

    const [page, setPage] = useState(1 as number);

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
        if (data?.towers && !tower.id) {
            selectTower(data.towers[0]);
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

    const selectTower = (tower: Tower) => {
        setTower(tower);
        // setFloors((x: any) => parseTower(tower))
    };

    const mobileSelectTower = (tower: Tower) => {
        setTower(tower);
        setShowFST(true);
    };

    const handleScroll = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop ===
            e.target.clientHeight;
        if (bottom && !listLoading) {
            setPage(page + 1);
        }
    };

    const header = (
        <div className="flex flex-wrap w-full h-full">
            <div className="text-xl md:text-4xl font-black text-slate-600 w-full mb-2">
                {tower?.name}
            </div>
            <div className="title font-semibold text-slate-500">
                Battle tower
            </div>
        </div>
    );

    const enemyBubbles = (
        <div className={classNames("w-full h-full", "h-4/5")}>
            <div className="flex relative -gap-x-8 w-full h-full">
                <div className="col-span-2"></div>
                {[1, 2, 3, 4, 5, 6]?.map((floor: number) => {
                    const leader = (tower as any)?.pokemon?.filter(
                        (x: TowerPokemon) => x.floor == floor
                    )[0];
                    if (leader) {
                        return (
                            <div
                                key={leader.id}
                                className="absolute top-8"
                                style={{
                                    right: (floor - 1 + 2) * 7 + "%",
                                }}
                            >
                                <PokemonProfileImage
                                    key={leader.id}
                                    className="w-[75px] h-[75px] bg-gray-300 outline outline-white rounded-full col-span-1 h-full p-4"
                                    pokemon={(leader as any).pokemon}
                                    color={leader.color ?? ""}
                                />
                            </div>
                        );
                    }
                })}
                <div
                    className="absolute top-8"
                    style={{ right: 0 * 2.5 + "em" }}
                >
                    <div className="w-[75px] h-[75px] col-span-1 h-full flex items-center justify-center">
                        <div>
                            <div className="w-full text-lg font-black">
                                +{(tower as any)?.pokemon?.length - 6}
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
    );

    const challengeBtn = (
        <div className="w-full h-full bg-gradient-to-r from-cyan-200 to-indigo-400 hover:opacity-75 hover:shadow-lg active:scale-95 cursor-pointer rounded-lg shadow overflow-hidden p-4">
            <div
                onClick={() => challenge({ tower_id: tower.id })}
                className="flex items-center justify-center w-full h-full text-2xl text-lg font-semibold uppercase text-white"
            >
                CHALLANGE
            </div>
        </div>
    );

    return (
        <MainLayout>
            <FullScreenLoader loading={isLoading} />
            <div className="relative w-full h-full flex">
                <div className="relative w-full md:w-[25%] border-r shadow-lg grid overflow-hidden">
                    <ComponentLoader loading={listLoading} />
                    <div
                        className={classNames(
                            "overflow-y-auto w-[125%] pr-[20%] h-full"
                        )}
                        onScroll={handleScroll}
                    >
                        {Object.values(pages).map((page) =>
                            page.map((_tower: Tower) => (
                                <div className="w-full h-[150px]">
                                    <div
                                        className="w-full h-full hidden md:block"
                                        onClick={() => selectTower(_tower)}
                                    >
                                        <TowerShortCard
                                            tower={_tower}
                                            active={tower.id == _tower.id}
                                        />
                                    </div>
                                    <div className="w-full h-full block md:hidden" onClick={() => mobileSelectTower(_tower)}>
                                        <TowerShortCard tower={_tower} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="hidden md:block w-[75%] bg-gray-100 pb-12 overflow-y-auto">
                    <div className="flex items-center justify-between px-14 w-full h-1/6">
                        <div>{header}</div>
                        <div className="w-2/5 h-full flex justify-end items-center">
                            {enemyBubbles}
                        </div>
                    </div>

                    <div className="w-full px-14">
                        <div className="flex items-start gap-x-8">
                            <div className="w-4/6">
                                <div className="hidden md:block w-full h-3/6 mb-8 bg-white rounded-lg shadow">
                                    <TowerRewards tower={tower} />
                                </div>
                                <div className="hidden md:block w-full mb-8 bg-white rounded-lg shadow">
                                    <TowerFloorMasters tower={tower} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 grid-rows-6 gap-y-6 w-2/6 min-h-[50vh]">
                                <div className="hidden md:block w-full row-span-5 bg-white rounded-lg shadow">
                                    <TowerRankings tower={tower} />
                                </div>
                                <div className="w-full row-span-1">
                                    {challengeBtn}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showFST && (
                    <div
                        className="absolute grid grid-flow-row-dense inset-0 bg-white overflow-hidden"
                        style={{ zIndex: 100 }}
                    >
                        <div className="w-[125%] h-full overflow-auto pr-[25%] pb-[80px]">
                            <div className="relative border-b p-4 px-6">
                                {header}
                                <div
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center p-2 bg-red-300 rounded-full"
                                    onClick={() => setShowFST(false)}
                                >
                                    {CloseIcon}
                                </div>
                            </div>
                            <div className="">
                                <TowerRewards
                                    headerClassName="text-sm p-3 px-6 mb-0 border-0 bg-slate-200 text-slate-700"
                                    tower={tower}
                                />
                            </div>
                            <div className="">
                                <TowerFloorMasters
                                    headerClassName="text-sm p-3 px-6 mb-0 border-0 bg-slate-200 text-slate-700"
                                    tower={tower}
                                />
                            </div>
                            <div className="">
                                <TowerRankings
                                    headerClassName="text-sm p-3 px-6 mb-0 border-0 bg-slate-200 text-slate-700"
                                    tower={tower}
                                />
                            </div>
                        </div>
                        <div className="absolute left-0 bottom-0 right-0 w-full h-[75px]">
                            {challengeBtn}
                        </div>
                    </div>
                )}
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
