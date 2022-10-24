import type { GetServerSideProps, NextPage } from "next";
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
                <div className="max-w-4xl mx-auto h-[20rem] flex justify-center items-center">
                    <p>
                        Welcome to your profile
                    </p>
                </div>
            </section>
        </MainLayout>
    );
};


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    if (!req.cookies.access_token) {
      return {
        redirect: {
          destination: '/login',
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
