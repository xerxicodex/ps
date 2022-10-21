import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { OrientationEnumType } from "../../enums";
import FullScreenLoader from "../components/FullScreenLoader";
import FullScreenMenu from "../components/FullScreenMenu";
import ProfileImage from "../components/ProfileImage";
import { HamburgerIcon } from "../icons";
import useStore from "../store";
import { trpc } from "../utils/trpc";

type MenuProps = {
    orientation: OrientationEnumType;
};

const Menu = (props: MenuProps) => {
    const router = useRouter();

    const store = useStore();

    const loading = store.pageLoading;

    const trainer = store.authTrainer;

    const queryClient = useQueryClient();

    const { mutate: logoutUser } = trpc.useMutation(["auth.logout"], {
        onSuccess() {
            queryClient.clear();
            router.push("/login");
        },
        onError(error: any) {
            error.response.errors.forEach((err: any) => {
                toast(err.message, {
                    type: "error",
                    position: "top-right",
                });
                queryClient.clear();
                router.push("/login");
            });
        },
    });

    const menuClicked = useCallback(
        (option: string) => {
            option = option.toLowerCase();

            const navigate = (x: string) => router.push(`/${x}`);

            const run: { [key: string]: () => void } = {
                logout: logoutUser,
                home: () => navigate("/"),
            };

            (run[option] ?? (() => navigate(option)))();
        },
        [router]
    );

    return (
        <div
            className={classNames([
                {
                    [OrientationEnumType.horizontal]: "flex gap-x-2",
                    [OrientationEnumType.vertical]: "flex flex-wrap gap-y-2",
                }[props.orientation]
            ])}
        >
            {["Home", "Profile", "Pokemon", "Towers", "Logout"].map((option, i) => (
                <div
                    key={i}
                    className={classNames([
                        {
                            [OrientationEnumType.horizontal]: "",
                            [OrientationEnumType.vertical]: "w-full",
                        }[props.orientation],
                        router.asPath,
                        (router.asPath.length == 1 ? "/home" : router.asPath).indexOf(`/${option.toLowerCase()}`) == 0 ? 'text-indigo-500 font-black' : '',
                        "cursor-pointer hover:opacity-50 p-2",
                    ])}
                    onClick={() => menuClicked(option)}
                >
                    {option}
                </div>
            ))}
        </div>
    );
};

export default Menu;
