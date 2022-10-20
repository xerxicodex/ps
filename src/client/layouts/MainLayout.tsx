import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/FullScreenLoader";
import FullScreenMenu from "../components/FullScreenMenu";
import ProfileImage from "../components/ProfileImage";
import { HamburgerIcon } from "../icons";
import useStore from "../store";
import { trpc } from "../utils/trpc";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const router = useRouter();

    const store = useStore();

    const loading = store.pageLoading;

    const trainer = store.authTrainer;

    const queryClient = useQueryClient();

    const [showMenu, setShowMenu] = useState(false);

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

    const logo = (
        <Link href="/">
            <a className="text-logo font-black">NXPRPG</a>
        </Link>
    );

    return (
        <div className="w-screen h-screen">
            <FullScreenLoader hide={!loading} />
            <FullScreenMenu
                active={showMenu}
                onClose={() => setShowMenu(false)}
            />
            <div className="w-full h-full flex flex-wrap z-0">
                <div className="w-full h-[7%]">
                    <div className="flex w-full h-full items-center justify-between px-4 md:px-10 border-b-2">
                        <div className="flex">{logo}</div>

                        <div className="hidden md:flex items-center justify-center">
                            {trainer && <ProfileImage trainer={trainer} />}
                        </div>

                        <div className="flex md:hidden items-center justify-between active:opacity-50">
                            <div onClick={() => setShowMenu(true)}>
                                {HamburgerIcon}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[93%]">{children}</div>
                <div className="hidden md:flex fixed left-0 bottom-0 right-0 h-[10%] min-h-[115px] items-center justify-center py-6 px-8">
                    <div className="w-1/4 min-w-[300px] max-w-[410px] h-full bg-white rounded-lg border shadow-md mb-8"></div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
