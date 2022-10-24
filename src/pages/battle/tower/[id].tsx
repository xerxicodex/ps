import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../client/components/FullScreenLoader";
import MainLayout from "../../../client/layouts/MainLayout";
import { trpc } from "../../../client/utils/trpc";
import { ITowerBattle } from "../../../server/engines/tower.engine";

const BattleTower: NextPage = (id: number) => {

    const [battle, setBattle] = useState({} as ITowerBattle)

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

    trpc.useSubscription(["tower.onChallangeUpdate"], {
        onNext(data) {
            setBattle(data);
            console.log(battle);
        }
    })

   challenge({ tower_id: id })

    return (
        <MainLayout>
            <FullScreenLoader loading={!battle} />
        </MainLayout>
    );
}

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

export default BattleTower;
