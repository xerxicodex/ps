import { Tower } from "@prisma/client";
import classNames from "classnames";

export type TowerRankingsProps = {
    headerClassName?: string;
    className?: string;
    tower: Tower;
};

const TowerRankings = (props: TowerRankingsProps) => {
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
                Rankings
            </div>
            <div className="w-full min-h-[93%]">
                <div className="flex flex-wrap">
                    <div className="p-4 px-6">
                        None
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TowerRankings;
