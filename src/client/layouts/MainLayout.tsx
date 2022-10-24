import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { OrientationEnumType } from "../../enums";
import FullScreenLoader from "../components/FullScreenLoader";
import FullScreenMenu from "../components/FullScreenMenu";
import Menu from "../components/Menu";
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

    const logo = (
        <Link href="/">
            <a className="text-logo font-black">NXPRPG</a>
        </Link>
    );

    return (
        <div className="w-screen h-screen text-sm md:text-lg">
            <FullScreenLoader loading={loading} />
            <div className="block md:hidden">
                <FullScreenMenu
                    active={showMenu}
                    onClose={() => setShowMenu(false)}
                />
            </div>
            <div className="w-full h-full flex flex-wrap z-0">
                <div className="w-full h-[7%]">
                    <div className="flex w-full h-full items-center justify-between md:justify-center px-4 md:px-8 bg-slate-700 text-white md:bg-transparent md:text-inherit border-b-2">
                        <div className="flex w-1/6 justify-start">{logo}</div>

                        <div className="hidden md:flex text-sm w-4/6 justify-center">
                            <div className="w-fit text-lg">
                                <Menu
                                    orientation={OrientationEnumType.horizontal}
                                />
                            </div>
                        </div>

                        <div className="hidden md:flex w-1/6 items-center justify-end">
                            <div className="flex items-center gap-x-4">
                                <div className="flex rounded-lg overflow-hidden text-sm">
                                    <div className="px-4 py-2 text-center bg-slate-300">
                                        {trainer?.name}
                                    </div>
                                    <div className="px-4 py-2 text-center bg-slate-600 text-white">#{trainer?.id}</div>
                                </div>
                                <ProfileImage trainer={trainer} />
                            </div>
                        </div>

                        <div className="flex md:hidden items-center justify-between active:opacity-50">
                            <div onClick={() => setShowMenu(!showMenu)}>
                                {HamburgerIcon}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[93%]">{children}</div>
                {/* <div className="hidden md:flex fixed left-0 bottom-0 right-0 h-[10%] min-h-[115px] items-center justify-end py-6 px-8">
                    <div className="w-1/4 min-w-[300px] max-w-[410px] h-full bg-white rounded-lg border shadow-md mb-8"></div>
                </div> */}
            </div>
        </div>
    );
};

export default MainLayout;
