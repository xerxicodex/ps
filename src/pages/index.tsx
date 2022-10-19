import type { NextPage } from "next";
import { useEffect } from "react";
import MainLayout from "../client/layouts/MainLayout";
import useStore from "../client/store";
import { trpc } from "../client/utils/trpc";

const HomePage: NextPage = () => {
    const store = useStore();

    const { data, isLoading, isFetching, error, isError } = trpc.useQuery([
        "hello",
    ]);

    useEffect(() => {
        store.setPageLoading(isLoading || isFetching);
    }, [isLoading, isFetching]);

    return (
        <MainLayout>
            <section className="pt-20">
                <div className="max-w-4xl mx-auto bg-white rounded-md h-[20rem] flex justify-center items-center">
                    <p className="text-3xl font-semibold">{data?.message}</p>
                </div>
            </section>
        </MainLayout>
    );
};

export default HomePage;
