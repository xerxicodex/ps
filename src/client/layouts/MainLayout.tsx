import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/FullScreenLoader";
import useStore from "../store";
import { trpc } from "../utils/trpc";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
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

    return (
        <div className="w-screen h-screen">
            <FullScreenLoader hide={!loading} />
            <div className="w-full h-full flex flex-wrap z-0">
                <div className="w-full h-[7%]">
                    <div className="flex w-full h-full items-center justify-between px-10 border-b-2">
                        <div className="flex">
                            <Link href="/">
                                <a className="text-logo font-black">
                                    NXPRPG
                                </a>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-8 h-8 bg-slate-600 rounded-full overflow-hidden"></div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[93%]">{children}</div>
            </div>
        </div>
    );
};

export default MainLayout;
