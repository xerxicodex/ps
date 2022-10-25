import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../client/components/FullScreenLoader";
import MainLayout from "../../../client/layouts/MainLayout";
import { trpc } from "../../../client/utils/trpc";
import { ITowerBattle } from "../../../server/engines/tower.engine";

const BattleTower: NextPage = () => {

    const router = useRouter()
    const { id } = router.query

    const [towerId, setTowerId] = useState(0);

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

    useEffect(() => {
        const _id = parseInt(id as string);
        if (towerId !== _id) {
            setTowerId(_id);
            challenge({ tower_id: parseInt(id as string) })
        }
    }, [id])

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
