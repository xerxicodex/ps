import { Reward } from "@prisma/client";
import classNames from "classnames";

export type RewardImageProps = { className?: string, reward?: Reward | null, id?: number | null };

const RewardImage = (props: RewardImageProps) => {
   let { className, id, reward } = props;

    if (reward) {
        id = reward.id;
    }

    return (
        <div className={classNames("w-full h-full bg-contain bg-center bg-no-repeat", className)} style={{ backgroundImage: `url(api/images/reward/${id})`}}></div>
    );
};

export default RewardImage;
