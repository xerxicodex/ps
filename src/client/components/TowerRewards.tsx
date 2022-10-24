import { Tower } from "@prisma/client";
import { title } from "case";
import classNames from "classnames";
import numeral from "numeral";
import { RewardAmount, RewardName } from "../utils/reward";
import RewardImage from "./RewardImage";

export type TowerRewardsProps = {
    headerClassName?: string;
    className?: string;
    tower: Tower;
};

const TowerRewards = (props: TowerRewardsProps) => {
    let { tower, headerClassName } = props;

    return (
        <div className="flex flex-wrap w-full h-full overflow-hidden">
            <div
                className={classNames(
                    "w-full h-[7%] p-6 mb-6 font-semibold uppercase opacity-50",
                    (headerClassName as string)?.indexOf("text-") >= 0
                        ? ""
                        : "text-lg",
                    headerClassName
                )}
            >
                Rewards
            </div>
            <div className="w-full min-h-[93%]">
                <div className="flex flex-wrap ">
                    {(tower as any).rewards
                        ?.sort(
                            (a: any, b: any) =>
                                RewardAmount(a.reward) - RewardAmount(b.reward)
                        )
                        ?.map((towerReward: any) => {
                            // const value = RewardValue(towerReward.reward)
                            const name = RewardName(towerReward.reward);

                            const amount = RewardAmount(towerReward.reward);

                            return (
                                <div
                                    key={towerReward.id}
                                    className="w-full p-4 pb-0 border-t mb-4"
                                >
                                    <div className="flex gap-x-4 w-full items-center justify-between">
                                        <div className="flex gap-x-4 w-full items-center">
                                            <div className="w-8 h-8 bg-red-100 rounded-full">
                                                <RewardImage
                                                    reward={towerReward.reward}
                                                />
                                            </div>
                                            <div className="">
                                                {title(name)}
                                            </div>
                                        </div>
                                        <div className="">
                                            {numeral(amount).format("0,0")}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default TowerRewards;
